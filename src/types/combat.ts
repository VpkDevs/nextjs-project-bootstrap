// Core stat system - 6 stats
export interface CharacterStats {
  vitality: number; // Health pool
  strength: number; // Physical damage
  arcana: number; // Magical power
  dexterity: number; // Speed/evasion
  faith: number; // Healing/light magic
  resolve: number; // Mental resistance
}

// Status effects
export enum StatusEffect {
  POISONED = 'poisoned',
  STUNNED = 'stunned',
  BLESSED = 'blessed',
  CURSED = 'cursed',
  REGENERATING = 'regenerating',
  WEAKENED = 'weakened',
  VEILROOT_WITHDRAWAL = 'veilroot_withdrawal',
}

export interface ActiveStatusEffect {
  type: StatusEffect;
  duration: number; // turns remaining
  potency: number; // strength of effect
}

// Character types
export enum CharacterRole {
  DARK_CLERIC = 'dark_cleric',
  SENTINEL = 'sentinel',
  TRUTH_BEARER = 'truth_bearer',
  RETURNED = 'returned',
}

// Enemy types
export enum EnemyType {
  CORRUPTED = 'corrupted',
  SHADE = 'shade',
  BEAST = 'beast',
  ECHO = 'echo',
  INNER_DEMON = 'inner_demon',
}

// Character state
export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  level: number;
  currentHp: number;
  maxHp: number;
  currentMana: number;
  maxMana: number;
  stats: CharacterStats;
  statusEffects: ActiveStatusEffect[];
  isAlive: boolean;
  hasUsedRevive: boolean; // For Vincent's Defiant Breath
  relationship: number; // 0-100, affects story outcomes
}

// Julia-specific addon
export interface JuliaBlackthorne extends Character {
  role: CharacterRole.DARK_CLERIC;
  veilrootAddiction: number; // 0-100%
  withdrawalDamageThisTurn: number;
}

// Enemy state
export interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  level: number;
  currentHp: number;
  maxHp: number;
  currentMana: number;
  maxMana: number;
  stats: CharacterStats;
  statusEffects: ActiveStatusEffect[];
  isAlive: boolean;
  threatLevel: number; // Used by AI
  actionPattern: string[]; // Pattern of action IDs
  currentPatternIndex: number;
}

// Action/Ability types
export enum ActionType {
  ATTACK = 'attack',
  SKILL = 'skill',
  HEAL = 'heal',
  DEFEND = 'defend',
  ITEM = 'item',
  VEILROOT = 'veilroot', // Julia's addiction mechanic
}

export interface Action {
  id: string;
  name: string;
  type: ActionType;
  description: string;
  manaCost: number;
  cooldown: number; // turns
  currentCooldown: number;
  targetType: 'self' | 'ally' | 'enemy' | 'all_allies' | 'all_enemies';
  effects: ActionEffect[];
}

export interface ActionEffect {
  type: 'damage' | 'heal' | 'status' | 'buff' | 'debuff' | 'special';
  value: number;
  statScaling?: keyof CharacterStats; // Which stat affects this
  scalingMultiplier?: number;
  statusEffect?: StatusEffect;
  duration?: number;
}

// Turn order
export interface TurnOrderEntry {
  combatantId: string;
  isPlayer: boolean;
  initiative: number;
  name: string;
}

// Combat state
export enum CombatPhase {
  INITIATIVE = 'initiative',
  PLAYER_TURN = 'player_turn',
  ENEMY_TURN = 'enemy_turn',
  RESOLUTION = 'resolution',
  VICTORY = 'victory',
  DEFEAT = 'defeat',
}

export interface CombatState {
  phase: CombatPhase;
  turnNumber: number;
  turnOrder: TurnOrderEntry[];
  currentTurnIndex: number;
  playerParty: Character[];
  enemies: Enemy[];
  combatLog: CombatLogEntry[];
  isProcessing: boolean;
}

export interface CombatLogEntry {
  turn: number;
  message: string;
  type: 'action' | 'damage' | 'heal' | 'status' | 'death' | 'narrative';
  timestamp: number;
}

// Loot and rewards
export interface CombatReward {
  experience: number;
  gold: number;
  items: string[];
  relationshipChanges: { [characterId: string]: number };
  narrativeOutcome: string;
}
