import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import { useGameState } from "../hooks/useGameState";

describe("useGameState", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock the scenarios module to avoid loading actual scenarios in tests
    vi.mock("../data/scenarios", () => ({
      getScenario: vi.fn(() => ({
        id: "test",
        title: "Test Scenario",
        description: "Test",
        icon: "🧪",
        color: "#000",
        start: {
          text: "Test narrative",
          choices: [
            {
              text: "Choice A",
              outcome: "a",
              reflection: "Reflection A",
            },
          ],
        },
      })),
    }));
  });

  afterEach(() => {
    cleanup();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.currentScreen).toBe("menu");
    expect(result.current.currentScenario).toBeNull();
    expect(result.current.currentNode).toBeNull();
    expect(result.current.pathHistory).toEqual([]);
    expect(result.current.progress).toBe(0);
    expect(result.current.insight).toBe("");
    expect(result.current.isComplete).toBe(false);
  });

  it("should allow screen changes", () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.setCurrentScreen("game");
    });

    expect(result.current.currentScreen).toBe("game");
  });

  it("should save and load games", () => {
    const { result } = renderHook(() => useGameState());

    // First, select a scenario to have state to save
    act(() => {
      result.current.selectScenario("career");
    });

    expect(result.current.currentScenario).toBe("career");
    expect(result.current.currentNode).toBeDefined();

    // Save the game
    act(() => {
      result.current.saveGame("Test Save");
    });

    expect(result.current.savedGames.length).toBe(1);
    expect(result.current.savedGames[0].name).toBe("Test Save");

    // Reset
    act(() => {
      result.current.resetGame();
    });

    expect(result.current.currentScenario).toBeNull();

    // Load the saved game
    act(() => {
      result.current.loadGame(result.current.savedGames[0].id);
    });

    expect(result.current.currentScenario).toBe("career");
  });

  it("should delete games", () => {
    const { result } = renderHook(() => useGameState());

    // First, ensure we have a scenario selected
    act(() => {
      result.current.selectScenario("career");
    });

    // Save two games
    act(() => {
      result.current.saveGame("Save 1");
    });

    // Manually add a second save to localStorage to avoid timing issues
    const directSave = {
      id: "test-save-2",
      name: "Save 2",
      scenario: "career",
      date: new Date().toISOString(),
    };
    localStorage.setItem("whatif-saved-games", JSON.stringify([directSave]));

    // Re-render to pick up the change
    const { result: result2 } = renderHook(() => useGameState());

    expect(result2.current.savedGames.length).toBeGreaterThanOrEqual(1);

    const initialLength = result2.current.savedGames.length;
    const firstId = result2.current.savedGames[0].id;

    act(() => {
      result2.current.deleteGame(firstId);
    });

    expect(result2.current.savedGames.length).toBe(initialLength - 1);
  });

  it("should track path history", () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.selectScenario("career");
    });

    const choices = result.current.currentNode?.choices;
    if (choices && choices.length > 0) {
      act(() => {
        result.current.makeChoice(choices[0]);
      });

      expect(result.current.pathHistory.length).toBe(1);
      expect(result.current.pathHistory[0].choice).toBe(choices[0].text);
    }
  });

  it("should reset game state", () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.selectScenario("career");
    });

    expect(result.current.currentScenario).toBe("career");
    expect(result.current.progress).toBe(0);

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.currentScenario).toBeNull();
    expect(result.current.currentNode).toBeNull();
    expect(result.current.pathHistory).toEqual([]);
    expect(result.current.progress).toBe(0);
    expect(result.current.insight).toBe("");
    expect(result.current.isComplete).toBe(false);
    expect(result.current.currentScreen).toBe("menu");
  });
});
