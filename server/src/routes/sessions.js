import express from 'express';
import sessionService from '../services/sessionService.js';

const router = express.Router();

/**
 * POST /api/sessions
 * Create a new session
 */
router.post('/', (req, res) => {
  try {
    const { scenario, language, metadata } = req.body;

    const session = sessionService.createSession({
      scenario,
      language,
      metadata
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sessions/:sessionId
 * Get a session by ID
 */
router.get('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = sessionService.getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/sessions/:sessionId
 * Update a session
 */
router.put('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;

    const session = sessionService.updateSession(sessionId, updates);

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Session update error:', error);

    if (error.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/sessions/:sessionId
 * Delete a session
 */
router.delete('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;

    const deleted = sessionService.deleteSession(sessionId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Session deletion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sessions
 * Get all sessions (debug endpoint)
 */
router.get('/', (req, res) => {
  try {
    const sessions = sessionService.getAllSessions();

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Sessions retrieval error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sessions/:sessionId/export
 * Export a session for persistence
 */
router.post('/:sessionId/export', (req, res) => {
  try {
    const { sessionId } = req.params;

    const exportData = sessionService.exportSession(sessionId);

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Session export error:', error);

    if (error.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sessions/import
 * Import a session from export data
 */
router.post('/import', (req, res) => {
  try {
    const exportData = req.body;

    if (!exportData) {
      return res.status(400).json({
        success: false,
        error: 'Export data is required'
      });
    }

    const session = sessionService.importSession(exportData);

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Session import error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
