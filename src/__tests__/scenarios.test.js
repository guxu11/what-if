import { describe, it, expect } from "vitest";
import { getScenario, getAllScenarios } from "../data/scenarios";

describe("Scenarios", () => {
  describe("getScenario", () => {
    it("should return a scenario by id", () => {
      const career = getScenario("career");
      expect(career).toBeDefined();
      expect(career.id).toBe("career");
      expect(career.title).toBe("The Career Crossroads");
    });

    it("should return null for non-existent scenario", () => {
      const result = getScenario("non-existent");
      expect(result).toBeNull();
    });

    it("should have all required fields", () => {
      const scenario = getScenario("career");
      expect(scenario).toHaveProperty("id");
      expect(scenario).toHaveProperty("title");
      expect(scenario).toHaveProperty("description");
      expect(scenario).toHaveProperty("icon");
      expect(scenario).toHaveProperty("color");
      expect(scenario).toHaveProperty("start");
    });

    it("should have branching choices", () => {
      const scenario = getScenario("career");
      expect(scenario.start.choices).toBeDefined();
      expect(Array.isArray(scenario.start.choices)).toBe(true);
      expect(scenario.start.choices.length).toBeGreaterThan(0);
    });
  });

  describe("getAllScenarios", () => {
    it("should return an array of scenarios", () => {
      const scenarios = getAllScenarios();
      expect(Array.isArray(scenarios)).toBe(true);
    });

    it("should return all four pre-built scenarios (including epic)", () => {
      const scenarios = getAllScenarios();
      expect(scenarios.length).toBe(4);

      const ids = scenarios.map(s => s.id);
      expect(ids).toContain("career");
      expect(ids).toContain("relationship");
      expect(ids).toContain("relocation");
      expect(ids).toContain("epic");
    });
  });
});
