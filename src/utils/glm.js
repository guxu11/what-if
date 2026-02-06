// GLM API Client - Frontend wrapper for backend API
// All GLM calls go through the backend to keep the API key secure

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Generate a story segment using GLM through the backend
 * @param {Object} params - Story generation parameters
 * @param {string} params.scenario - The scenario or prompt
 * @param {string} [params.userChoice] - The user's previous choice
 * @param {Array} [params.storyHistory] - Array of previous story events
 * @param {string} [params.language] - Output language code
 * @param {string} [params.sessionId] - Session ID for persistence
 * @returns {Promise<Object>} Story data with text and choices
 */
export async function generateStory({
  scenario,
  userChoice = null,
  storyHistory = [],
  language = null,
  sessionId = null
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/story/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario,
        userChoice,
        storyHistory,
        language,
        sessionId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate story');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('GLM API error:', error);
    throw error;
  }
}

/**
 * Generate a story ending/reflection using GLM
 * @param {Object} params - Ending generation parameters
 * @param {Array} params.storyHistory - Array of story events
 * @param {string} params.finalChoice - The final choice made
 * @param {string} [params.language] - Output language code
 * @param {string} [params.sessionId] - Session ID for persistence
 * @returns {Promise<Object>} Ending data with text
 */
export async function generateEnding({
  storyHistory,
  finalChoice,
  language = 'en',
  sessionId = null
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/story/ending`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyHistory,
        finalChoice,
        language,
        sessionId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate ending');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('GLM ending error:', error);
    throw error;
  }
}

/**
 * Stream story generation using Server-Sent Events
 * @param {Object} params - Stream parameters
 * @param {string} params.scenario - The scenario or prompt
 * @param {string} [params.userChoice] - The user's previous choice
 * @param {Array} [params.storyHistory] - Array of previous story events
 * @param {string} [params.language] - Output language code
 * @param {string} [params.sessionId] - Session ID for persistence
 * @param {Function} onChunk - Callback for each chunk of text
 * @param {Function} onDone - Callback when streaming is complete
 * @param {Function} onError - Callback for errors
 * @returns {Function} Abort function to stop streaming
 */
export function streamStory({
  scenario,
  userChoice = null,
  storyHistory = [],
  language = null,
  sessionId = null,
  onChunk,
  onDone,
  onError
}) {
  const controller = new AbortController();

  fetch(`${API_BASE_URL}/story/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scenario,
      userChoice,
      storyHistory,
      language,
      sessionId
    }),
    signal: controller.signal
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to start stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (onDone) onDone();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                if (onError) onError(new Error(parsed.error));
                return;
              }

              if (parsed.done) {
                if (onDone) onDone();
                return;
              }

              if (parsed.chunk && onChunk) {
                onChunk(parsed.chunk);
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', data);
            }
          }
        }
      }
    })
    .catch((error) => {
      if (error.name !== 'AbortError' && onError) {
        onError(error);
      }
    });

  // Return abort function
  return () => controller.abort();
}

/**
 * Detect language from text using the backend
 * @param {string} text - Text to analyze
 * @returns {Promise<string>} Language code (e.g., 'en', 'zh', 'es')
 */
export async function detectLanguage(text) {
  try {
    const response = await fetch(`${API_BASE_URL}/story/detect-language`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to detect language');
    }

    const data = await response.json();
    return data.data.language;
  } catch (error) {
    console.error('Language detection error:', error);
    // Fallback to 'en' on error
    return 'en';
  }
}

/**
 * Session management functions
 */
export async function createSession(scenario, language, metadata = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario,
        language,
        metadata
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create session');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Session creation error:', error);
    throw error;
  }
}

export async function getSession(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);

    if (!response.ok) {
      throw new Error('Failed to get session');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Session retrieval error:', error);
    throw error;
  }
}

export async function updateSession(sessionId, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update session');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Session update error:', error);
    throw error;
  }
}

export async function deleteSession(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete session');
    }

    return true;
  } catch (error) {
    console.error('Session deletion error:', error);
    throw error;
  }
}

export async function exportSession(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/export`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to export session');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Session export error:', error);
    throw error;
  }
}

export async function importSession(exportData) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exportData)
    });

    if (!response.ok) {
      throw new Error('Failed to import session');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Session import error:', error);
    throw error;
  }
}

/**
 * Legacy functions for backward compatibility
 * These use static responses for scenarios that don't use GLM
 */
export function generateOutcome(choice) {
  const outcomes = [
    `You chose: ${choice}. Life unfolds in ways you couldn't predict. There are challenges, yes, but also unexpected joys.`,
    `Following the path of "${choice}" brings change. Some things improve, others get harder. That's how life works.`,
    `With this choice, you've set yourself on a new journey. The destination isn't clear yet, but each step matters. You chose: ${choice}.`,
  ];

  return outcomes[Math.floor(Math.random() * outcomes.length)];
}

export function generateReflection(choice, question) {
  return `You chose "${choice}" from the crossroads: "${question}".\n\nEvery choice closes some doors but opens others. The path not taken will always hold some mystery - that's normal. What matters is how fully you embrace the path you're walking right now. The present moment is all you truly have. Use it well.`;
}

export function generateDeepReflection(choice, question) {
  const reflections = [
    `The choice of "${choice}" reveals something about your values. Perhaps you prioritize security, or growth, or adventure, or connection. These are all valid. The key insight is this: you made this choice for a reason. Trust yourself. The path you're on is the right one simply because it's the one you're on.`,
    `Exploring "${choice}" has shown you something important: every decision has trade-offs. There is no perfect choice, only the one you make. The "what if" will always exist - it's part of being human. But here's the secret: even if you'd chosen differently, you'd still wonder. So stop wondering. Start living.`,
    `Through "${choice}" you've learned that life isn't about making the perfect decision. It's about making a decision and making it right. The future you imagined might not have happened anyway. What actually happened - what's happening right now - is the only reality. Focus here. This is where life happens.`,
    `Your exploration of "${choice}" at the crossroads of "${question}" reveals a truth: we imagine alternate paths as either better or worse, but they're just different. The grass isn't greener elsewhere - it's greener where you water it. Whatever path you take, bring your best self. That's all anyone can do.`,
  ];

  return reflections[Math.floor(Math.random() * reflections.length)];
}

export function createCustomScenario(title, question, options) {
  const choices = options
    .filter(opt => opt.trim())
    .map((option, index) => ({
      text: option,
      outcome: `option${index + 1}`,
      next: {
        text: generateOutcome(option),
        choices: [
          {
            text: "Accept this outcome",
            outcome: `accept${index + 1}`,
            reflection: generateReflection(option, question),
          },
          {
            text: "Want to explore further",
            outcome: `explore${index + 1}`,
            reflection: generateDeepReflection(option, question),
          },
        ],
      },
    }));

  return {
    id: `custom-${Date.now()}`,
    title,
    description: question,
    icon: "🎨",
    color: "#9b59b6",
    isCustom: true,
    start: {
      text: question,
      choices,
    },
  };
}
