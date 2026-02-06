import { v4 as uuidv4 } from 'uuid';

// In-memory session storage (in production, use a database)
const sessions = new Map();
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

class SessionService {
  constructor() {
    // Clean up expired sessions every hour
    setInterval(() => this.cleanupExpiredSessions(), 60 * 60 * 1000);
  }

  /**
   * Create a new session
   */
  createSession(initialData = {}) {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      scenario: initialData.scenario || '',
      language: initialData.language || 'en',
      storyHistory: [],
      currentChoices: [],
      state: {},
      metadata: initialData.metadata || {}
    };

    sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get a session by ID
   */
  getSession(sessionId) {
    const session = sessions.get(sessionId);
    if (session) {
      session.lastAccessedAt = new Date().toISOString();
      sessions.set(sessionId, session);
    }
    return session;
  }

  /**
   * Update a session
   */
  updateSession(sessionId, updates) {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  /**
   * Add a story event to the session
   */
  addStoryEvent(sessionId, event) {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const storyEvent = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...event
    };

    const updatedSession = {
      ...session,
      storyHistory: [...session.storyHistory, storyEvent],
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  /**
   * Add choices to the session
   */
  addChoices(sessionId, choices) {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const updatedSession = {
      ...session,
      currentChoices: choices,
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  /**
   * Update session state
   */
  updateState(sessionId, stateUpdates) {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const updatedSession = {
      ...session,
      state: { ...session.state, ...stateUpdates },
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId) {
    return sessions.delete(sessionId);
  }

  /**
   * Get all sessions (for debugging)
   */
  getAllSessions() {
    return Array.from(sessions.values());
  }

  /**
   * Get session count
   */
  getSessionCount() {
    return sessions.size;
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions() {
    const now = Date.now();
    let cleaned = 0;

    for (const [id, session] of sessions.entries()) {
      const lastAccessed = new Date(session.lastAccessedAt).getTime();
      if (now - lastAccessed > SESSION_TIMEOUT) {
        sessions.delete(id);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} expired sessions`);
    }

    return cleaned;
  }

  /**
   * Export session for persistence
   */
  exportSession(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    return {
      id: session.id,
      scenario: session.scenario,
      language: session.language,
      storyHistory: session.storyHistory,
      state: session.state,
      metadata: session.metadata,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Import session from export data
   */
  importSession(exportData) {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      scenario: exportData.scenario || '',
      language: exportData.language || 'en',
      storyHistory: exportData.storyHistory || [],
      state: exportData.state || {},
      metadata: exportData.metadata || {},
      importedAt: new Date().toISOString()
    };

    sessions.set(sessionId, session);
    return session;
  }
}

// Export singleton instance
export default new SessionService();
