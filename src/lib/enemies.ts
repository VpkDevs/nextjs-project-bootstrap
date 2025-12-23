import { Enemy, EnemyType, StatusEffect } from '../types/combat';

// Corrupted Enemies - Twisted holy beings
export const corruptedPriest: Enemy = {
  id: 'corrupted_priest_1',
  name: 'Corrupted Priest',
  type: EnemyType.CORRUPTED,
  level: 4,
  currentHp: 100,
  maxHp: 100,
  stats: {
    vitality: 10,
    strength: 8,
    arcana: 12,
    dexterity: 8,
    faith: 14,
    resolve: 10,
  },
  statusEffects: [],
  isAlive: true,
  threatLevel: 50,
  actionPattern: ['tainted_smite', 'dark_prayer', 'tainted_smite', 'curse_word'],
  currentPatternIndex: 0,
};

// Shade Enemies - Shadow beings
export const shadowShade: Enemy = {
  id: 'shadow_shade_1',
  name: 'Shadow Shade',
  type: EnemyType.SHADE,
  level: 3,
  currentHp: 70,
  maxHp: 70,
  stats: {
    vitality: 7,
    strength: 6,
    arcana: 14,
    dexterity: 16,
    faith: 4,
    resolve: 8,
  },
  statusEffects: [],
  isAlive: true,
  threatLevel: 40,
  actionPattern: ['shadow_strike', 'phase_shift', 'shadow_strike', 'drain_light'],
  currentPatternIndex: 0,
};

// Beast Enemies - Corrupted animals
export const veilBeast: Enemy = {
  id: 'veil_beast_1',
  name: 'Veil Beast',
  type: EnemyType.BEAST,
  level: 5,
  currentHp: 140,
  maxHp: 140,
  stats: {
    vitality: 14,
    strength: 16,
    arcana: 4,
    dexterity: 12,
    faith: 2,
    resolve: 6,
  },
  statusEffects: [],
  isAlive: true,
  threatLevel: 60,
  actionPattern: ['savage_bite', 'savage_bite', 'frenzied_roar', 'savage_bite'],
  currentPatternIndex: 0,
};

// Echo Enemies - Memories given form
export const sorrowfulEcho: Enemy = {
  id: 'sorrowful_echo_1',
  name: 'Sorrowful Echo',
  type: EnemyType.ECHO,
  level: 4,
  currentHp: 85,
  maxHp: 85,
  stats: {
    vitality: 8,
    strength: 6,
    arcana: 12,
    dexterity: 10,
    faith: 10,
    resolve: 14,
  },
  statusEffects: [],
  isAlive: true,
  threatLevel: 45,
  actionPattern: ['lament', 'memory_strike', 'sorrow_wave', 'lament'],
  currentPatternIndex: 0,
};

// Inner Demon - Julia's personal demons
export const innerDemon: Enemy = {
  id: 'inner_demon_1',
  name: 'Inner Demon',
  type: EnemyType.INNER_DEMON,
  level: 5,
  currentHp: 120,
  maxHp: 120,
  stats: {
    vitality: 12,
    strength: 10,
    arcana: 14,
    dexterity: 12,
    faith: 8,
    resolve: 16,
  },
  statusEffects: [],
  isAlive: true,
  threatLevel: 70,
  actionPattern: ['guilt_strike', 'whisper_doubt', 'guilt_strike', 'manifestation'],
  currentPatternIndex: 0,
};

// Enemy action definitions
export const enemyActions = {
  // Corrupted actions
  tainted_smite: {
    name: 'Tainted Smite',
    damage: 25,
    statScaling: 'faith',
    scalingMultiplier: 1.2,
  },
  dark_prayer: {
    name: 'Dark Prayer',
    heal: 20,
    statScaling: 'faith',
    scalingMultiplier: 1.0,
  },
  curse_word: {
    name: 'Curse Word',
    damage: 15,
    statusEffect: StatusEffect.CURSED,
    duration: 2,
  },

  // Shade actions
  shadow_strike: {
    name: 'Shadow Strike',
    damage: 20,
    statScaling: 'dexterity',
    scalingMultiplier: 1.4,
  },
  phase_shift: {
    name: 'Phase Shift',
    evasionBoost: 50, // +50% evasion
    duration: 2,
  },
  drain_light: {
    name: 'Drain Light',
    damage: 15,
    heal: 10,
  },

  // Beast actions
  savage_bite: {
    name: 'Savage Bite',
    damage: 35,
    statScaling: 'strength',
    scalingMultiplier: 1.5,
  },
  frenzied_roar: {
    name: 'Frenzied Roar',
    damage: 20,
    attackBoost: 30, // +30% attack for self
    duration: 3,
  },

  // Echo actions
  lament: {
    name: 'Lament',
    damage: 10,
    statusEffect: StatusEffect.WEAKENED,
    duration: 2,
  },
  memory_strike: {
    name: 'Memory Strike',
    damage: 25,
    statScaling: 'arcana',
    scalingMultiplier: 1.3,
  },
  sorrow_wave: {
    name: 'Sorrow Wave',
    damage: 18,
    targetAll: true,
  },

  // Inner Demon actions
  guilt_strike: {
    name: 'Guilt Strike',
    damage: 30,
    statScaling: 'arcana',
    scalingMultiplier: 1.4,
  },
  whisper_doubt: {
    name: 'Whisper Doubt',
    damage: 15,
    statusEffect: StatusEffect.CURSED,
    duration: 3,
  },
  manifestation: {
    name: 'Manifestation',
    damage: 40,
    statScaling: 'resolve',
    scalingMultiplier: 1.6,
  },
};

// Sample encounter configurations
export const encounters = {
  tutorial: [shadowShade],
  early_game: [corruptedPriest, shadowShade],
  mid_game: [veilBeast, sorrowfulEcho, shadowShade],
  boss_fight: [innerDemon, corruptedPriest, sorrowfulEcho],
  beast_pack: [veilBeast, veilBeast],
};
