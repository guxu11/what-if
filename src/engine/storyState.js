/**
 * Story State Model for Epic Interactive Stories
 *
 * This module defines the data structures and state management for:
 * - World state (locations, factions, events)
 * - Characters (relationships, attitudes, allegiances)
 * - Timeline (events, milestones, consequences)
 * - Player inventory and resources
 * - Quest tracking and flags
 */

/**
 * Represents a location in the game world
 */
export class Location {
  constructor(id, name, description, accessible = true) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.accessible = accessible; // Whether player can visit
    this.visits = 0; // How many times visited
    this.firstVisit = true; // First time flag
  }

  visit() {
    this.visits++;
    if (this.visits > 1) {
      this.firstVisit = false;
    }
    return this;
  }
}

/**
 * Represents an NPC (Non-Player Character)
 */
export class Character {
  constructor(id, name, description, initialAttitude = 50) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.attitude = initialAttitude; // 0-100: hostile to friendly
    this.trust = 50; // 0-100: distrust to trust
    this.allegiance = null; // faction they belong to
    this.met = false; // Has player met them
    this.interactions = 0; // Number of interactions
    this.knownSecrets = []; // Secrets the player knows about them
  }

  interact(attitudeChange = 0, trustChange = 0) {
    this.attitude = Math.max(0, Math.min(100, this.attitude + attitudeChange));
    this.trust = Math.max(0, Math.min(100, this.trust + trustChange));
    this.interactions++;
    if (!this.met) {
      this.met = true;
    }
    return this;
  }

  getRelationship() {
    if (this.attitude >= 75) return "allied";
    if (this.attitude >= 50) return "friendly";
    if (this.attitude >= 25) return "neutral";
    return "hostile";
  }
}

/**
 * Represents a faction or group in the world
 */
export class Faction {
  constructor(id, name, description, initialInfluence = 50) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.influence = initialInfluence; // 0-100: weak to powerful
    this.playerStanding = 50; // 0-100: hated to revered
    this.goals = []; // What the faction wants
    this.secrets = []; // Secrets the faction holds
  }

  modifyStanding(change) {
    this.playerStanding = Math.max(0, Math.min(100, this.playerStanding + change));
    return this;
  }

  modifyInfluence(change) {
    this.influence = Math.max(0, Math.min(100, this.influence + change));
    return this;
  }

  getStanding() {
    if (this.playerStanding >= 75) return "revered";
    if (this.playerStanding >= 50) return "respected";
    if (this.playerStanding >= 25) return "tolerated";
    return "hated";
  }
}

/**
 * Represents a quest or mission
 */
export class Quest {
  constructor(id, name, description, type = "main", active = false, completed = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type; // main, side, optional
    this.active = active;
    this.completed = completed;
    this.startedAt = null;
    this.completedAt = null;
    this.steps = []; // Steps to complete the quest
    this.currentStep = 0;
    this.rewards = [];
  }

  start() {
    this.active = true;
    this.startedAt = new Date().toISOString();
    return this;
  }

  complete() {
    this.active = false;
    this.completed = true;
    this.completedAt = new Date().toISOString();
    return this;
  }

  advanceStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
    return this;
  }

  getProgress() {
    if (this.steps.length === 0) return 0;
    return Math.round((this.currentStep / this.steps.length) * 100);
  }
}

/**
 * Represents a timeline event
 */
export class TimelineEvent {
  constructor(id, description, timestamp, type = "choice", impact = {}) {
    this.id = id;
    this.description = description;
    this.timestamp = timestamp;
    this.type = type; // choice, consequence, discovery, milestone
    this.impact = impact; // How this event affected the world
  }
}

/**
 * Main Story State class
 * Manages all aspects of the game world and player state
 */
export class StoryState {
  constructor() {
    this.version = "2.0";
    this.startTime = new Date().toISOString();
    this.lastUpdate = new Date().toISOString();

    // World elements
    this.locations = new Map();
    this.characters = new Map();
    this.factions = new Map();

    // Player state
    this.inventory = new Map();
    this.resources = {
      gold: 100,
      health: 100,
      mana: 100,
      influence: 50,
    };

    // Quest system
    this.quests = new Map();
    this.activeQuests = [];
    this.completedQuests = [];

    // Timeline
    this.timeline = [];
    this.currentChapter = 1;
    this.currentScene = 1;

    // Flags and state tracking
    this.flags = new Map();
    this.variables = {};
    this.pathHistory = [];

    // Consequences and branches
    this.unlockedBranches = new Set();
    this.lockedBranches = new Set();
    this.choicesWithConsequences = new Map();
  }

  // Location management
  addLocation(location) {
    this.locations.set(location.id, location);
    return this;
  }

  getLocation(id) {
    return this.locations.get(id);
  }

  visitLocation(id) {
    const location = this.locations.get(id);
    if (location) {
      location.visit();
    }
    return this;
  }

  // Character management
  addCharacter(character) {
    this.characters.set(character.id, character);
    return this;
  }

  getCharacter(id) {
    return this.characters.get(id);
  }

  interactWithCharacter(id, attitudeChange = 0, trustChange = 0) {
    const character = this.characters.get(id);
    if (character) {
      character.interact(attitudeChange, trustChange);
    }
    return this;
  }

  // Faction management
  addFaction(faction) {
    this.factions.set(faction.id, faction);
    return this;
  }

  getFaction(id) {
    return this.factions.get(id);
  }

  modifyFactionStanding(id, change) {
    const faction = this.factions.get(id);
    if (faction) {
      faction.modifyStanding(change);
    }
    return this;
  }

  // Inventory management
  addItem(itemId, quantity = 1) {
    this.inventory.set(itemId, (this.inventory.get(itemId) || 0) + quantity);
    return this;
  }

  removeItem(itemId, quantity = 1) {
    const current = this.inventory.get(itemId) || 0;
    if (current >= quantity) {
      this.inventory.set(itemId, current - quantity);
      return true;
    }
    return false;
  }

  hasItem(itemId) {
    return (this.inventory.get(itemId) || 0) > 0;
  }

  getItemCount(itemId) {
    return this.inventory.get(itemId) || 0;
  }

  // Resource management
  modifyResource(resource, amount) {
    if (this.resources.hasOwnProperty(resource)) {
      this.resources[resource] = Math.max(0, this.resources[resource] + amount);
      if (this.resources[resource] > 100) {
        this.resources[resource] = 100; // Cap at 100
      }
    }
    return this;
  }

  // Quest management
  addQuest(quest) {
    this.quests.set(quest.id, quest);
    return this;
  }

  startQuest(id) {
    const quest = this.quests.get(id);
    if (quest && !quest.active && !quest.completed) {
      quest.start();
      this.activeQuests.push(id);
    }
    return this;
  }

  completeQuest(id) {
    const quest = this.quests.get(id);
    if (quest && quest.active) {
      quest.complete();
      this.activeQuests = this.activeQuests.filter(q => q !== id);
      this.completedQuests.push(id);

      // Grant rewards
      quest.rewards.forEach(reward => {
        if (reward.type === "item") {
          this.addItem(reward.id, reward.quantity);
        } else if (reward.type === "resource") {
          this.modifyResource(reward.id, reward.amount);
        }
      });
    }
    return this;
  }

  advanceQuest(id) {
    const quest = this.quests.get(id);
    if (quest && quest.active) {
      quest.advanceStep();
      if (quest.currentStep >= quest.steps.length) {
        this.completeQuest(id);
      }
    }
    return this;
  }

  // Timeline management
  addEvent(description, type = "choice", impact = {}) {
    const event = new TimelineEvent(
      Date.now(),
      description,
      new Date().toISOString(),
      type,
      impact
    );
    this.timeline.push(event);
    return this;
  }

  // Flag management
  setFlag(key, value = true) {
    this.flags.set(key, value);
    return this;
  }

  getFlag(key, defaultValue = false) {
    return this.flags.get(key) ?? defaultValue;
  }

  hasFlag(key) {
    return this.flags.has(key);
  }

  unsetFlag(key) {
    this.flags.delete(key);
    return this;
  }

  // Branch management
  unlockBranch(branchId) {
    this.unlockedBranches.add(branchId);
    this.lockedBranches.delete(branchId);
    return this;
  }

  lockBranch(branchId) {
    this.lockedBranches.add(branchId);
    this.unlockedBranches.delete(branchId);
    return this;
  }

  isBranchUnlocked(branchId) {
    return this.unlockedBranches.has(branchId);
  }

  isBranchLocked(branchId) {
    return this.lockedBranches.has(branchId);
  }

  // Path tracking
  recordChoice(choiceId, choiceText, consequences = {}) {
    const record = {
      id: Date.now(),
      choiceId,
      text: choiceText,
      timestamp: new Date().toISOString(),
      consequences,
      chapter: this.currentChapter,
      scene: this.currentScene,
    };
    this.pathHistory.push(record);
    return record;
  }

  // State serialization
  toJSON() {
    return {
      version: this.version,
      startTime: this.startTime,
      lastUpdate: this.lastUpdate,
      locations: Array.from(this.locations.entries()),
      characters: Array.from(this.characters.entries()),
      factions: Array.from(this.factions.entries()),
      inventory: Array.from(this.inventory.entries()),
      resources: this.resources,
      quests: Array.from(this.quests.entries()),
      activeQuests: this.activeQuests,
      completedQuests: this.completedQuests,
      timeline: this.timeline,
      currentChapter: this.currentChapter,
      currentScene: this.currentScene,
      flags: Array.from(this.flags.entries()),
      variables: this.variables,
      pathHistory: this.pathHistory,
      unlockedBranches: Array.from(this.unlockedBranches),
      lockedBranches: Array.from(this.lockedBranches),
      choicesWithConsequences: Array.from(this.choicesWithConsequences.entries()),
    };
  }

  static fromJSON(json) {
    const state = new StoryState();
    state.startTime = json.startTime;
    state.lastUpdate = json.lastUpdate;
    state.locations = new Map(json.locations);
    state.characters = new Map(json.characters);
    state.factions = new Map(json.factions);
    state.inventory = new Map(json.inventory);
    state.resources = json.resources;
    state.quests = new Map(json.quests);
    state.activeQuests = json.activeQuests;
    state.completedQuests = json.completedQuests;
    state.timeline = json.timeline;
    state.currentChapter = json.currentChapter;
    state.currentScene = json.currentScene;
    state.flags = new Map(json.flags);
    state.variables = json.variables;
    state.pathHistory = json.pathHistory;
    state.unlockedBranches = new Set(json.unlockedBranches);
    state.lockedBranches = new Set(json.lockedBranches);
    state.choicesWithConsequences = new Map(json.choicesWithConsequences);
    return state;
  }

  // Utility methods
  getSummary() {
    return {
      playTime: new Date(this.lastUpdate) - new Date(this.startTime),
      choicesMade: this.pathHistory.length,
      locationsVisited: Array.from(this.locations.values()).filter(l => l.visits > 0).length,
      charactersMet: Array.from(this.characters.values()).filter(c => c.met).length,
      questsCompleted: this.completedQuests.length,
      questsActive: this.activeQuests.length,
      currentChapter: this.currentChapter,
    };
  }
}

/**
 * Factory function to create a new story state
 */
export function createStoryState() {
  return new StoryState();
}
