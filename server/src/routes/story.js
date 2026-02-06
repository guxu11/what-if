import express from 'express';
import glmService from '../services/glmService.js';
import sessionService from '../services/sessionService.js';

const router = express.Router();

/**
 * POST /api/story/generate
 * Generate a story segment based on scenario and history
 */
router.post('/generate', async (req, res) => {
  try {
    const { scenario, userChoice, storyHistory, language, sessionId } = req.body;

    if (!scenario) {
      return res.status(400).json({ error: 'Scenario is required' });
    }

    // Detect language from input if not provided
    const detectedLanguage = language || glmService.detectLanguage(scenario);
    const outputLanguage = detectedLanguage;

    // Generate story
    const story = await glmService.generateStory(
      scenario,
      userChoice || null,
      storyHistory || [],
      outputLanguage
    );

    // Update session if provided
    if (sessionId) {
      const session = sessionService.getSession(sessionId);
      if (session) {
        if (userChoice) {
          sessionService.addStoryEvent(sessionId, {
            type: 'choice',
            content: userChoice
          });
        }

        sessionService.addStoryEvent(sessionId, {
          type: 'story',
          content: story.text
        });

        sessionService.addChoices(sessionId, story.choices);
        sessionService.updateState(sessionId, {
          language: outputLanguage
        });
      }
    }

    res.json({
      success: true,
      data: {
        ...story,
        language: outputLanguage
      },
      sessionId
    });
  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/story/ending
 * Generate a story ending/reflection
 */
router.post('/ending', async (req, res) => {
  try {
    const { storyHistory, finalChoice, language, sessionId } = req.body;

    if (!storyHistory || !Array.isArray(storyHistory)) {
      return res.status(400).json({ error: 'storyHistory is required' });
    }

    const outputLanguage = language || 'en';

    // Generate ending
    const ending = await glmService.generateEnding(
      storyHistory,
      finalChoice,
      outputLanguage
    );

    // Update session if provided
    if (sessionId) {
      sessionService.addStoryEvent(sessionId, {
        type: 'ending',
        content: ending.text
      });

      sessionService.updateState(sessionId, {
        isComplete: true
      });
    }

    res.json({
      success: true,
      data: {
        ...ending,
        language: outputLanguage
      },
      sessionId
    });
  } catch (error) {
    console.error('Ending generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/story/stream
 * Stream story generation (SSE)
 */
router.post('/stream', async (req, res) => {
  try {
    const { scenario, userChoice, storyHistory, language, sessionId } = req.body;

    if (!scenario) {
      return res.status(400).json({ error: 'Scenario is required' });
    }

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const detectedLanguage = language || glmService.detectLanguage(scenario);
    const outputLanguage = detectedLanguage;

    let fullContent = '';

    try {
      for await (const chunk of glmService.generateStoryStream(
        scenario,
        userChoice || null,
        storyHistory || [],
        outputLanguage
      )) {
        fullContent += chunk;
        res.write(`data: ${JSON.stringify({ chunk, language: outputLanguage })}\n\n`);
      }

      // Send completion signal
      res.write(`data: ${JSON.stringify({ done: true, language: outputLanguage })}\n\n`);

      // Update session if provided
      if (sessionId) {
        if (userChoice) {
          sessionService.addStoryEvent(sessionId, {
            type: 'choice',
            content: userChoice
          });
        }

        sessionService.addStoryEvent(sessionId, {
          type: 'story',
          content: fullContent
        });
      }

      res.end();
    } catch (streamError) {
      console.error('Stream error:', streamError);
      res.write(`data: ${JSON.stringify({ error: streamError.message })}\n\n`);
      res.end();
    }
  } catch (error) {
    console.error('Story stream setup error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

/**
 * POST /api/story/detect-language
 * Detect language from text
 */
router.post('/detect-language', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const detectedLanguage = glmService.detectLanguage(text);

    res.json({
      success: true,
      data: {
        language: detectedLanguage,
        text
      }
    });
  } catch (error) {
    console.error('Language detection error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
