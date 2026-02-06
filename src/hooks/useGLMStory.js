import { useState, useCallback, useEffect } from 'react';
import {
  createSession,
  getSession,
  updateSession,
  deleteSession,
  generateStory,
  generateEnding,
  streamStory,
  detectLanguage
} from '../utils/glm';

const GLM_SESSION_KEY = 'whatif-glm-session';

export function useGLMStory() {
  const [sessionId, setSessionId] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [storyHistory, setStoryHistory] = useState([]);
  const [choices, setChoices] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguageState] = useState('en');
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Load saved session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(GLM_SESSION_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSessionId(parsed.sessionId);
        setStoryHistory(parsed.storyHistory || []);
        setLanguageState(parsed.language || 'en');

        // Load session from backend
        getSession(parsed.sessionId).then(session => {
          if (session) {
            setChoices(session.currentChoices || []);
            setCurrentStory(session.storyHistory?.[session.storyHistory.length - 1]?.content || null);
          }
        }).catch(() => {
          // Session might have expired on server
          localStorage.removeItem(GLM_SESSION_KEY);
        });
      } catch (e) {
        console.error('Failed to load saved session:', e);
      }
    }
  }, []);

  // Auto-save session state
  useEffect(() => {
    if (sessionId) {
      const sessionData = {
        sessionId,
        storyHistory,
        language
      };
      localStorage.setItem(GLM_SESSION_KEY, JSON.stringify(sessionData));
    }
  }, [sessionId, storyHistory, language]);

  /**
   * Start a new GLM-powered story
   */
  const startStory = useCallback(async (scenario, initialLanguage = null) => {
    setIsLoading(true);
    setError(null);

    try {
      // Detect language if not provided
      const detectedLanguage = initialLanguage || await detectLanguage(scenario);
      setLanguageState(detectedLanguage);

      // Create session
      const session = await createSession(scenario, detectedLanguage, {
        createdAt: new Date().toISOString()
      });

      setSessionId(session.id);
      setStoryHistory([]);
      setChoices([]);
      setIsComplete(false);
      setInsight('');
      setCurrentStory(null);

      // Generate initial story
      const story = await generateStory({
        scenario,
        language: detectedLanguage,
        sessionId: session.id
      });

      setCurrentStory(story.text);
      setChoices(story.choices || []);
      setStoryHistory([{ type: 'story', content: story.text, timestamp: new Date().toISOString() }]);

      return story;
    } catch (err) {
      setError(err.message || 'Failed to start story');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Make a choice in the story
   */
  const makeChoice = useCallback(async (choiceText, choiceData = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add choice to history
      const choiceEvent = {
        type: 'choice',
        content: choiceText,
        timestamp: new Date().toISOString(),
        ...choiceData
      };

      const updatedHistory = [...storyHistory, choiceEvent];
      setStoryHistory(updatedHistory);

      // Generate next story segment
      const story = await generateStory({
        scenario: currentStory || '',
        userChoice: choiceText,
        storyHistory: updatedHistory.map(h => `${h.type}: ${h.content}`),
        language,
        sessionId
      });

      setCurrentStory(story.text);
      setChoices(story.choices || []);

      // Check if this is an ending
      if (story.isEnding) {
        setIsComplete(true);
        setInsight(story.text);

        // Save to localStorage as a completed game
        const savedGames = JSON.parse(localStorage.getItem('whatif-saved-games') || '[]');
        const saveData = {
          id: Date.now().toString(),
          name: `Story ${new Date().toLocaleString()}`,
          scenario: 'glm-story',
          currentNode: { text: story.text },
          pathHistory: updatedHistory.filter(h => h.type === 'choice').map(h => ({ choice: h.content })),
          progress: updatedHistory.length,
          insight: story.text,
          isComplete: true,
          date: new Date().toISOString(),
          isGLMStory: true,
          language
        };
        savedGames.push(saveData);
        localStorage.setItem('whatif-saved-games', JSON.stringify(savedGames));
      } else {
        setStoryHistory([...updatedHistory, { type: 'story', content: story.text, timestamp: new Date().toISOString() }]);
      }

      return story;
    } catch (err) {
      setError(err.message || 'Failed to process choice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentStory, storyHistory, language, sessionId]);

  /**
   * Generate an ending for the current story
   */
  const generateStoryEnding = useCallback(async (finalChoice) => {
    setIsLoading(true);
    setError(null);

    try {
      const ending = await generateEnding({
        storyHistory: storyHistory.map(h => `${h.type}: ${h.content}`),
        finalChoice,
        language,
        sessionId
      });

      setIsComplete(true);
      setInsight(ending.text);
      setCurrentStory(ending.text);
      setChoices([]);

      // Add ending to history
      const updatedHistory = [...storyHistory, { type: 'ending', content: ending.text, timestamp: new Date().toISOString() }];
      setStoryHistory(updatedHistory);

      // Save to localStorage as a completed game
      const savedGames = JSON.parse(localStorage.getItem('whatif-saved-games') || '[]');
      const saveData = {
        id: Date.now().toString(),
        name: `Story ${new Date().toLocaleString()}`,
        scenario: 'glm-story',
        currentNode: { text: ending.text },
        pathHistory: updatedHistory.filter(h => h.type === 'choice').map(h => ({ choice: h.content })),
        progress: updatedHistory.length,
        insight: ending.text,
        isComplete: true,
        date: new Date().toISOString(),
        isGLMStory: true,
        language
      };
      savedGames.push(saveData);
      localStorage.setItem('whatif-saved-games', JSON.stringify(savedGames));

      return ending;
    } catch (err) {
      setError(err.message || 'Failed to generate ending');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [storyHistory, language, sessionId]);

  /**
   * Stream story generation for better UX
   */
  const streamStoryContent = useCallback((scenario, userChoice = null) => {
    setIsStreaming(true);
    setStreamedText('');
    setError(null);

    let fullText = '';

    return streamStory({
      scenario,
      userChoice,
      storyHistory: storyHistory.map(h => `${h.type}: ${h.content}`),
      language,
      sessionId,
      onChunk: (chunk) => {
        fullText += chunk;
        setStreamedText(fullText);
      },
      onDone: () => {
        setIsStreaming(false);
        setCurrentStory(fullText);
      },
      onError: (err) => {
        setIsStreaming(false);
        setError(err.message || 'Streaming error');
      }
    });
  }, [storyHistory, language, sessionId]);

  /**
   * Reset the current story
   */
  const resetStory = useCallback(() => {
    setSessionId(null);
    setCurrentStory(null);
    setStoryHistory([]);
    setChoices([]);
    setIsComplete(false);
    setInsight('');
    setError(null);
    setStreamedText('');
    setIsStreaming(false);
    localStorage.removeItem(GLM_SESSION_KEY);

    // Delete session from backend if exists
    if (sessionId) {
      deleteSession(sessionId).catch(() => {});
    }
  }, [sessionId]);

  /**
   * Continue a saved session
   */
  const continueSession = useCallback(async (savedSessionData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Import session data
      const session = await importSession(savedSessionData);

      setSessionId(session.id);
      setStoryHistory(session.storyHistory || []);
      setChoices(session.currentChoices || []);
      setLanguageState(session.language || 'en');
      setIsComplete(session.state?.isComplete || false);
      setInsight(session.state?.isComplete ? (session.storyHistory?.[session.storyHistory.length - 1]?.content || '') : '');

      // Get the current story text
      const lastStoryEvent = [...(session.storyHistory || [])].reverse().find(h => h.type === 'story');
      setCurrentStory(lastStoryEvent?.content || null);

      // Update local storage
      const sessionData = {
        sessionId: session.id,
        storyHistory: session.storyHistory || [],
        language: session.language || 'en'
      };
      localStorage.setItem(GLM_SESSION_KEY, JSON.stringify(sessionData));

      return session;
    } catch (err) {
      setError(err.message || 'Failed to continue session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Set the language for story generation
   */
  const setLanguage = useCallback((newLanguage) => {
    setLanguageState(newLanguage);
  }, []);

  return {
    // State
    sessionId,
    currentStory,
    storyHistory,
    choices,
    isComplete,
    insight,
    isLoading,
    error,
    language,
    streamedText,
    isStreaming,

    // Actions
    startStory,
    makeChoice,
    generateStoryEnding,
    streamStoryContent,
    resetStory,
    continueSession,
    setLanguage,

    // Utilities
    detectLanguage: detectLanguage
  };
}
