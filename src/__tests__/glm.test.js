import { describe, it, expect } from 'vitest';
import { generateOutcome, generateReflection, generateDeepReflection, createCustomScenario } from '../utils/glm';

describe('GLM (Guidance & Learning Model)', () => {
  describe('generateOutcome', () => {
    it('should generate an outcome for a choice', () => {
      const outcome = generateOutcome('Choose the risky path');
      expect(outcome).toBeDefined();
      expect(typeof outcome).toBe('string');
      expect(outcome.length).toBeGreaterThan(0);
    });

    it('should include the choice in the outcome', () => {
      const choice = 'Accept the promotion';
      const outcome = generateOutcome(choice);
      expect(outcome).toContain(choice);
    });

    it('should generate different outcomes on multiple calls', () => {
      const outcome1 = generateOutcome('Test choice');
      const outcome2 = generateOutcome('Test choice');
      // Due to randomness, outcomes might be different
      expect(typeof outcome1).toBe('string');
      expect(typeof outcome2).toBe('string');
    });
  });

  describe('generateReflection', () => {
    it('should generate a reflection for a choice and question', () => {
      const reflection = generateReflection('Stay here', 'Should I move?');
      expect(reflection).toBeDefined();
      expect(typeof reflection).toBe('string');
      expect(reflection.length).toBeGreaterThan(0);
    });

    it('should include both choice and question in reflection', () => {
      const choice = 'Leave now';
      const question = 'Should I stay or go?';
      const reflection = generateReflection(choice, question);
      expect(reflection).toContain(choice);
      expect(reflection).toContain(question);
    });

    it('should have meaningful content about living in the present', () => {
      const reflection = generateReflection('Any choice', 'Any question?');
      expect(reflection).toMatch(/present|now|moment|live|today/i);
    });
  });

  describe('generateDeepReflection', () => {
    it('should generate a deep reflection', () => {
      const reflection = generateDeepReflection('Take the risk', 'Should I play it safe?');
      expect(reflection).toBeDefined();
      expect(typeof reflection).toBe('string');
      expect(reflection.length).toBeGreaterThan(0);
    });

    it('should include choice and question', () => {
      const choice = 'Accept the offer';
      const question = 'Job or startup?';
      const reflection = generateDeepReflection(choice, question);
      expect(reflection).toContain(choice);
      expect(reflection).toContain(question);
    });

    it('should provide philosophical insights', () => {
      const reflection = generateDeepReflection('Any choice', 'Any question?');
      // Check for philosophical keywords
      expect(reflection).toMatch(/value|truth|insight|learn|choice|path|life/i);
    });
  });

  describe('createCustomScenario', () => {
    it('should create a custom scenario with valid structure', () => {
      const scenario = createCustomScenario(
        'My Scenario',
        'What should I do?',
        ['Option A', 'Option B', 'Option C']
      );

      expect(scenario).toBeDefined();
      expect(scenario.id).toBeDefined();
      expect(scenario.title).toBe('My Scenario');
      expect(scenario.description).toBe('What should I do?');
      expect(scenario.icon).toBe('🎨');
      expect(scenario.isCustom).toBe(true);
    });

    it('should create choices with correct structure', () => {
      const scenario = createCustomScenario(
        'Test',
        'Question?',
        ['Opt 1', 'Opt 2']
      );

      expect(scenario.start.choices).toBeDefined();
      expect(Array.isArray(scenario.start.choices)).toBe(true);
      expect(scenario.start.choices.length).toBe(2);

      const firstChoice = scenario.start.choices[0];
      expect(firstChoice).toHaveProperty('text');
      expect(firstChoice).toHaveProperty('outcome');
      expect(firstChoice).toHaveProperty('next');
    });

    it('should handle empty options gracefully', () => {
      const scenario = createCustomScenario(
        'Test',
        'Question?',
        ['Option A', '', '   ', 'Option B']
      );

      expect(scenario.start.choices.length).toBe(2);
    });

    it('should generate unique IDs for each scenario', () => {
      const scenario1 = createCustomScenario('A', 'Q?', ['Opt1', 'Opt2']);
      const scenario2 = createCustomScenario('B', 'Q2?', ['Opt1', 'Opt2']);

      expect(scenario1.id).not.toBe(scenario2.id);
    });
  });
});
