import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  generateStory,
  generateEnding,
  streamStory,
  detectLanguage,
  createSession,
  getSession,
  updateSession,
  deleteSession,
  exportSession,
  importSession
} from "../../src/utils/glm";

// Mock fetch
global.fetch = vi.fn();

describe("GLM API Client", () => {
  const mockApiUrl = "http://localhost:3001/api";

  beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("generateStory", () => {
    it("should generate a story with the API", async () => {
      const mockResponse = {
        success: true,
        data: {
          text: "Once upon a time...",
          choices: [
            { text: "Choice 1", outcome: "Outcome 1" },
            { text: "Choice 2", outcome: "Outcome 2" }
          ],
          isEnding: false,
          language: "en"
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await generateStory({
        scenario: "A hero's journey",
        language: "en"
      });

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/story/generate`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("A hero's journey")
        })
      );

      expect(result).toEqual(mockResponse.data);
      expect(result.text).toBe("Once upon a time...");
      expect(result.choices).toHaveLength(2);
    });

    it("should handle API errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Failed to generate story" })
      });

      await expect(
        generateStory({ scenario: "Test" })
      ).rejects.toThrow("Failed to generate story");
    });
  });

  describe("generateEnding", () => {
    it("should generate an ending with the API", async () => {
      const mockResponse = {
        success: true,
        data: {
          text: "And so the journey ended...",
          isEnding: true,
          language: "en"
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const storyHistory = [
        { type: "choice", content: "Chose path A" },
        { type: "story", content: "Something happened" }
      ];

      const result = await generateEnding({
        storyHistory,
        finalChoice: "Final decision",
        language: "en"
      });

      expect(result.text).toBe("And so the journey ended...");
      expect(result.isEnding).toBe(true);
    });
  });

  describe("streamStory", () => {
    it("should stream story content", async () => {
      const chunks = ["Once ", "upon ", "a ", "time..."];
      let chunkIndex = 0;

      fetch.mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => ({
            read: async () => {
              if (chunkIndex >= chunks.length) {
                return { done: true, value: undefined };
              }
              const chunk = chunks[chunkIndex++];
              return {
                done: false,
                value: new TextEncoder().encode(`data: ${JSON.stringify({ chunk })}\n\n`)
              };
            }
          })
        }
      });

      const onChunk = vi.fn();
      const onDone = vi.fn();

      // streamStory returns an abort function, we need to wait for onDone
      const abort = streamStory({
        scenario: "Test scenario",
        onChunk,
        onDone
      });

      // Wait for onDone to be called
      await new Promise((resolve) => {
        const checkDone = setInterval(() => {
          if (onDone.mock.calls.length > 0) {
            clearInterval(checkDone);
            resolve();
          }
        }, 10);
      });

      expect(onChunk).toHaveBeenCalledTimes(chunks.length);
      expect(onDone).toHaveBeenCalled();
    });

    it("should handle stream errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const onError = vi.fn();

      const abort = streamStory({
        scenario: "Test scenario",
        onError
      });

      // Wait for onError to be called
      await new Promise((resolve) => {
        const checkError = setInterval(() => {
          if (onError.mock.calls.length > 0) {
            clearInterval(checkError);
            resolve();
          }
        }, 10);
      });

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("detectLanguage", () => {
    it("should detect English text", async () => {
      const mockResponse = {
        success: true,
        data: { language: "en", text: "Hello world" }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const language = await detectLanguage("Hello world");
      expect(language).toBe("en");
    });

    it("should detect Chinese text", async () => {
      const mockResponse = {
        success: true,
        data: { language: "zh", text: "你好世界" }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const language = await detectLanguage("你好世界");
      expect(language).toBe("zh");
    });

    it("should fallback to 'en' on error", async () => {
      fetch.mockRejectedValueOnce(new Error("Detection failed"));

      const language = await detectLanguage("Some text");
      expect(language).toBe("en");
    });
  });

  describe("Session Management", () => {
    it("should create a session", async () => {
      const mockResponse = {
        success: true,
        data: {
          id: "session-123",
          scenario: "Test scenario",
          language: "en",
          storyHistory: [],
          currentChoices: []
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const session = await createSession("Test scenario", "en");
      expect(session.id).toBe("session-123");
      expect(session.scenario).toBe("Test scenario");
    });

    it("should get a session", async () => {
      const mockResponse = {
        success: true,
        data: {
          id: "session-123",
          scenario: "Test scenario",
          storyHistory: []
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const session = await getSession("session-123");
      expect(session.id).toBe("session-123");
    });

    it("should update a session", async () => {
      const mockResponse = {
        success: true,
        data: {
          id: "session-123",
          scenario: "Updated scenario",
          metadata: { key: "value" }
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const session = await updateSession("session-123", {
        scenario: "Updated scenario",
        metadata: { key: "value" }
      });

      expect(session.scenario).toBe("Updated scenario");
      expect(session.metadata).toEqual({ key: "value" });
    });

    it("should delete a session", async () => {
      fetch.mockResolvedValueOnce({
        ok: true
      });

      const result = await deleteSession("session-123");
      expect(result).toBe(true);
    });

    it("should export a session", async () => {
      const mockResponse = {
        success: true,
        data: {
          id: "session-123",
          scenario: "Test scenario",
          language: "en",
          storyHistory: [],
          exportedAt: new Date().toISOString()
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const exportData = await exportSession("session-123");
      expect(exportData.id).toBe("session-123");
      expect(exportData.exportedAt).toBeDefined();
    });

    it("should import a session", async () => {
      const mockResponse = {
        success: true,
        data: {
          id: "session-456",
          scenario: "Test scenario",
          language: "en",
          storyHistory: [],
          importedAt: new Date().toISOString()
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const exportData = { scenario: "Test scenario", language: "en", storyHistory: [] };
      const session = await importSession(exportData);

      expect(session.id).toBe("session-456");
      expect(session.importedAt).toBeDefined();
    });
  });
});
