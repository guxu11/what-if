/**
 * Narrative Engine for Epic Interactive Stories
 *
 * Handles:
 * - Chapter and scene progression
 * - Conditional choices based on story state
 * - Consequences and branching
 * - Dice/skill checks
 * - Dynamic content generation
 */

import { StoryState } from "./storyState";

/**
 * Represents a condition that must be met for a choice or event
 */
export class Condition {
  constructor(type, value) {
    this.type = type; // 'flag', 'resource', 'item', 'reputation', 'quest', 'variable'
    this.value = value;
  }

  /**
   * Check if the condition is met given the story state
   */
  check(state) {
    switch (this.type) {
      case "flag":
        return state.getFlag(this.value.key, this.value.defaultValue) === this.value.expected;
      case "resource":
        return (state.resources[this.value.resource] || 0) >= this.value.minimum;
      case "item":
        return state.hasItem(this.value.itemId);
      case "reputation":
        const character = state.getCharacter(this.value.characterId);
        return character && character.attitude >= this.value.minimum;
      case "quest":
        const quest = state.quests.get(this.value.questId);
        if (this.value.status === "active") return quest && quest.active;
        if (this.value.status === "completed") return quest && quest.completed;
        return false;
      case "variable":
        return state.variables[this.value.name] === this.value.expected;
      default:
        return true;
    }
  }
}

/**
 * Represents a consequence of a choice
 */
export class Consequence {
  constructor(type, value) {
    this.type = type; // 'flag', 'resource', 'item', 'reputation', 'quest', 'branch', 'variable', 'chapter'
    this.value = value;
  }

  /**
   * Apply the consequence to the story state
   */
  apply(state) {
    switch (this.type) {
      case "flag":
        state.setFlag(this.value.key, this.value.value);
        break;
      case "resource":
        state.modifyResource(this.value.resource, this.value.amount);
        break;
      case "item":
        if (this.value.amount > 0) {
          state.addItem(this.value.itemId, this.value.amount);
        } else {
          state.removeItem(this.value.itemId, Math.abs(this.value.amount));
        }
        break;
      case "reputation":
        state.interactWithCharacter(
          this.value.characterId,
          this.value.attitudeChange || 0,
          this.value.trustChange || 0
        );
        break;
      case "quest":
        if (this.value.action === "start") {
          state.startQuest(this.value.questId);
        } else if (this.value.action === "complete") {
          state.completeQuest(this.value.questId);
        } else if (this.value.action === "advance") {
          state.advanceQuest(this.value.questId);
        }
        break;
      case "branch":
        if (this.value.action === "unlock") {
          state.unlockBranch(this.value.branchId);
        } else if (this.value.action === "lock") {
          state.lockBranch(this.value.branchId);
        }
        break;
      case "variable":
        state.variables[this.value.name] = this.value.value;
        break;
      case "chapter":
        state.currentChapter = this.value.chapter;
        state.currentScene = this.value.scene || 1;
        break;
      case "faction":
        state.modifyFactionStanding(this.value.factionId, this.value.change);
        break;
    }
    return this;
  }
}

/**
 * Represents a skill check (dice roll)
 */
export class SkillCheck {
  constructor(skill, difficulty, modifier = 0) {
    this.skill = skill; // 'strength', 'charisma', 'wisdom', etc.
    this.difficulty = difficulty; // Target number to beat
    this.modifier = modifier; // Bonus or penalty to the roll
  }

  /**
   * Perform the skill check
   * @returns {Object} {success: boolean, roll: number, result: number}
   */
  perform() {
    const roll = Math.floor(Math.random() * 20) + 1; // d20
    const result = roll + this.modifier;
    const success = result >= this.difficulty;
    return { success, roll, result };
  }

  /**
   * Get a description of the check
   */
  describe(language = "en") {
    const descriptions = {
      en: `${this.skill} check (DC ${this.difficulty})`,
      es: `Verificación de ${this.skill} (DC ${this.difficulty})`,
      fr: `Test de ${this.skill} (DD ${this.difficulty})`,
      de: `${this.skill} Probe (SG ${this.difficulty})`,
      zh: `${this.skill} 检定 (DC ${this.difficulty})`,
      ja: `${this.skill} 判定 (DC ${this.difficulty})`,
      pt: `Teste de ${this.skill} (CD ${this.difficulty})`,
    };
    return descriptions[language] || descriptions.en;
  }
}

/**
 * Represents a choice the player can make
 */
export class Choice {
  constructor(id, text) {
    this.id = id;
    this.text = text;
    this.conditions = []; // Must be met to show this choice
    this.consequences = []; // Applied when chosen
    this.skillCheck = null; // Optional skill check
    this.next = null; // Next scene ID or object
    this.disabled = false; // If true, cannot be selected
    this.hidden = false; // If true, not shown at all
  }

  /**
   * Add a condition to this choice
   */
  withCondition(condition) {
    this.conditions.push(condition);
    return this;
  }

  /**
   * Add a consequence to this choice
   */
  withConsequence(consequence) {
    this.consequences.push(consequence);
    return this;
  }

  /**
   * Set a skill check for this choice
   */
  withSkillCheck(skill, difficulty, modifier = 0) {
    this.skillCheck = new SkillCheck(skill, difficulty, modifier);
    return this;
  }

  /**
   * Check if this choice is available
   */
  isAvailable(state) {
    if (this.disabled || this.hidden) return false;
    return this.conditions.every(cond => cond.check(state));
  }

  /**
   * Get the text with condition indicators
   */
  getText(language = "en") {
    let text = this.text;
    if (this.skillCheck) {
      const checkDesc = this.skillCheck.describe(language);
      text += ` [${checkDesc}]`;
    }
    return text;
  }
}

/**
 * Represents a scene in the story
 */
export class Scene {
  constructor(id, text, chapter = 1, sceneNumber = 1) {
    this.id = id;
    this.text = text;
    this.chapter = chapter;
    this.sceneNumber = sceneNumber;
    this.choices = [];
    this.conditions = []; // Conditions to enter this scene
    this.consequences = []; // Consequences when entering
    this.narrative = null; // Optional narrative description
    this.background = null; // Optional background image/color
  }

  /**
   * Add a choice to this scene
   */
  withChoice(choice) {
    this.choices.push(choice);
    return this;
  }

  /**
   * Add a condition to enter this scene
   */
  withCondition(condition) {
    this.conditions.push(condition);
    return this;
  }

  /**
   * Add a consequence when entering this scene
   */
  withConsequence(consequence) {
    this.consequences.push(consequence);
    return this;
  }

  /**
   * Check if this scene is accessible
   */
  isAccessible(state) {
    return this.conditions.every(cond => cond.check(state));
  }

  /**
   * Get available choices for this scene
   */
  getAvailableChoices(state) {
    return this.choices.filter(choice => choice.isAvailable(state));
  }
}

/**
 * Represents a chapter containing multiple scenes
 */
export class Chapter {
  constructor(id, title, number) {
    this.id = id;
    this.title = title;
    this.number = number;
    this.scenes = new Map();
    this.startScene = null;
  }

  /**
   * Add a scene to this chapter
   */
  addScene(scene) {
    this.scenes.set(scene.id, scene);
    if (this.scenes.size === 1) {
      this.startScene = scene.id;
    }
    return this;
  }

  /**
   * Get a scene by ID
   */
  getScene(id) {
    return this.scenes.get(id);
  }

  /**
   * Get all scenes in order
   */
  getScenes() {
    return Array.from(this.scenes.values()).sort((a, b) => a.sceneNumber - b.sceneNumber);
  }
}

/**
 * Main Narrative Engine class
 */
export class NarrativeEngine {
  constructor(storyState = null) {
    this.state = storyState || new StoryState();
    this.chapters = new Map();
    this.currentChapter = null;
    this.currentScene = null;
    this.history = [];
  }

  /**
   * Add a chapter to the story
   */
  addChapter(chapter) {
    this.chapters.set(chapter.id, chapter);
    return this;
  }

  /**
   * Start the story at a specific chapter
   */
  start(chapterId, sceneId = null) {
    const chapter = this.chapters.get(chapterId);
    if (!chapter) {
      throw new Error(`Chapter ${chapterId} not found`);
    }

    this.currentChapter = chapter;
    this.state.currentChapter = chapter.number;

    const startSceneId = sceneId || chapter.startScene;
    const scene = chapter.getScene(startSceneId);

    if (!scene) {
      throw new Error(`Scene ${startSceneId} not found in chapter ${chapterId}`);
    }

    this.loadScene(scene);
    return this;
  }

  /**
   * Load a scene
   */
  loadScene(scene) {
    if (!scene.isAccessible(this.state)) {
      throw new Error(`Scene ${scene.id} is not accessible`);
    }

    this.currentScene = scene;
    this.state.currentScene = scene.sceneNumber;

    // Apply scene consequences
    scene.consequences.forEach(consequence => {
      consequence.apply(this.state);
    });

    this.state.addEvent(`Entered scene: ${scene.id}`, "scene");

    return this;
  }

  /**
   * Make a choice in the current scene
   */
  makeChoice(choiceId, language = "en") {
    if (!this.currentScene) {
      throw new Error("No scene loaded");
    }

    const choice = this.currentScene.choices.find(c => c.id === choiceId);
    if (!choice) {
      throw new Error(`Choice ${choiceId} not found`);
    }

    if (!choice.isAvailable(this.state)) {
      throw new Error(`Choice ${choiceId} is not available`);
    }

    // Record the choice
    this.state.recordChoice(choiceId, choice.getText(language));

    // Handle skill check if present
    let skillCheckResult = null;
    if (choice.skillCheck) {
      skillCheckResult = choice.skillCheck.perform();
      this.state.addEvent(
        `Skill check: ${choice.skillCheck.skill} rolled ${skillCheckResult.roll} (result: ${skillCheckResult.result})`,
        "skill_check",
        skillCheckResult
      );

      // If the check fails, maybe we shouldn't proceed
      // For now, we'll still proceed but could add logic to handle failures
    }

    // Apply consequences
    const appliedConsequences = [];
    choice.consequences.forEach(consequence => {
      consequence.apply(this.state);
      appliedConsequences.push({
        type: consequence.type,
        value: consequence.value,
      });
    });

    this.state.addEvent(`Made choice: ${choice.getText(language)}`, "choice", {
      consequences: appliedConsequences,
    });

    // Move to next scene
    if (choice.next) {
      if (typeof choice.next === "string") {
        // Reference to another scene
        const nextScene = this.currentChapter.getScene(choice.next);
        if (nextScene) {
          this.loadScene(nextScene);
        } else if (this.chapters.has(choice.next)) {
          // Reference to another chapter
          this.start(choice.next);
        } else {
          // End of story
          this.currentScene = null;
        }
      } else if (typeof choice.next === "object") {
        // Inline scene object
        const nextScene = new Scene(
          choice.next.id || `scene_${Date.now()}`,
          choice.next.text,
          choice.next.chapter || this.currentChapter.number,
          choice.next.sceneNumber || this.state.currentScene + 1
        );

        // Add choices if present
        if (choice.next.choices) {
          choice.next.choices.forEach(c => {
            const newChoice = new Choice(c.id, c.text);
            if (c.conditions) c.conditions.forEach(cond => newChoice.withCondition(cond));
            if (c.consequences) c.consequences.forEach(cons => newChoice.withConsequence(cons));
            nextScene.withChoice(newChoice);
          });
        }

        this.loadScene(nextScene);
      }
    } else {
      // End of branch
      this.currentScene = null;
    }

    return {
      success: skillCheckResult?.success ?? true,
      skillCheck: skillCheckResult,
      consequences: appliedConsequences,
    };
  }

  /**
   * Get the current state of the story
   */
  getCurrentState() {
    return {
      chapter: this.currentChapter,
      scene: this.currentScene,
      state: this.state,
      availableChoices: this.currentScene?.getAvailableChoices(this.state) || [],
      isComplete: !this.currentScene,
    };
  }

  /**
   * Save the current state
   */
  save() {
    return {
      state: this.state.toJSON(),
      currentChapter: this.currentChapter?.id,
      currentScene: this.currentScene?.id,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Load a saved state
   */
  load(savedData) {
    this.state = StoryState.fromJSON(savedData.state);
    this.currentChapter = this.chapters.get(savedData.currentChapter);
    this.currentScene = this.currentChapter?.getScene(savedData.currentScene);
    return this;
  }

  /**
   * Get the story summary
   */
  getSummary() {
    return {
      ...this.state.getSummary(),
      currentChapter: this.currentChapter?.title,
      currentScene: this.currentScene?.id,
    };
  }
}

/**
 * Factory function to create a new narrative engine
 */
export function createNarrativeEngine() {
  return new NarrativeEngine();
}
