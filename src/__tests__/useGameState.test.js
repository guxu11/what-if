import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useGameState } from '../hooks/useGameState';

describe('useGameState', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.currentScreen).toBe('menu');
    expect(result.current.currentScenario).toBeNull();
    expect(result.current.currentNode).toBeNull();
    expect(result.current.pathHistory).toEqual([]);
    expect(result.current.progress).toBe(0);
    expect(result.current.insight).toBe('');
    expect(result.current.isComplete).toBe(false);
  });

  it('should allow screen changes', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.setCurrentScreen('game');
    });

    expect(result.current.currentScreen).toBe('game');
  });

  it('should save and load games', () => {
    const { result } = renderHook(() => useGameState());

    // First, select a scenario to have state to save
    act(() => {
      result.current.selectScenario('career');
    });

    expect(result.current.currentScenario).toBe('career');
    expect(result.current.currentNode).toBeDefined();

    // Save the game
    act(() => {
      result.current.saveGame('Test Save');
    });

    expect(result.current.savedGames.length).toBe(1);
    expect(result.current.savedGames[0].name).toBe('Test Save');

    // Reset
    act(() => {
      result.current.resetGame();
    });

    expect(result.current.currentScenario).toBeNull();

    // Load the saved game
    act(() => {
      result.current.loadGame(result.current.savedGames[0].id);
    });

    expect(result.current.currentScenario).toBe('career');
  });

  it('should delete games', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.selectScenario('career');
      result.current.saveGame('Save 1');
      result.current.saveGame('Save 2');
    });

    expect(result.current.savedGames.length).toBe(2);

    act(() => {
      result.current.deleteGame(result.current.savedGames[0].id);
    });

    expect(result.current.savedGames.length).toBe(1);
  });

  it('should track path history', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.selectScenario('career');
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

  it('should reset game state', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.selectScenario('career');
    });

    expect(result.current.currentScenario).toBe('career');
    expect(result.current.progress).toBe(0);

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.currentScenario).toBeNull();
    expect(result.current.currentNode).toBeNull();
    expect(result.current.pathHistory).toEqual([]);
    expect(result.current.progress).toBe(0);
    expect(result.current.insight).toBe('');
    expect(result.current.isComplete).toBe(false);
    expect(result.current.currentScreen).toBe('menu');
  });
});
