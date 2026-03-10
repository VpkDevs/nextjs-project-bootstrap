import { Character, CharacterRole, Action, ActionType, StatusEffect } from '../types/combat';

// Julia Blackthorne - Dark Cleric with Veilroot Addiction
export const juliaBlackthorne: Character = {
  id: 'julia',
  name: 'Julia Blackthorne',
  role: CharacterRole.DARK_CLERIC,
  level: 5,
  currentHp: 120,
  maxHp: 120,
  currentMana: 80,
  maxMana: 80,
  stats: {
    vitality: 12,
    strength: 8,
    arcana: 16,
    dexterity: 10,
    faith: 14,
    resolve: 12,
  },
  statusEffects: [],
  isAlive: true,
  hasUsedRevive: false,
  relationship: 50,
};

// Patrick - The Sentinel (Marine, tank)
export const patrick: Character = {
  id: 'patrick',
  name: 'Patrick "The Sentinel"',
  role: CharacterRole.SENTINEL,
  level: 5,
  currentHp: 180,
  maxHp: 180,
  currentMana: 40,
  maxMana: 40,
  stats: {
    vitality: 18,
    strength: 14,
    arcana: 6,
    dexterity: 8,
    faith: 10,
    resolve: 16,
  },
  statusEffects: [],
  isAlive: true,
  hasUsedRevive: false,
  relationship: 50,
};

// Dustin - The Truth-Bearer (Scholar, support/healer)
export const dustin: Character = {
  id: 'dustin',
  name: 'Dustin "The Truth-Bearer"',
  role: CharacterRole.TRUTH_BEARER,
  level: 5,
  currentHp: 100,
  maxHp: 100,
  currentMana: 100,
  maxMana: 100,
  stats: {
    vitality: 10,
    strength: 6,
    arcana: 14,
    dexterity: 12,
    faith: 16,
    resolve: 14,
  },
  statusEffects: [],
  isAlive: true,
  hasUsedRevive: false,
  relationship: 50,
};

// Vincent - The Returned (Undead warrior)
export const vincent: Character = {
  id: 'vincent',
  name: 'Vincent "The Returned"',
  role: CharacterRole.RETURNED,
  level: 5,
  currentHp: 150,
  maxHp: 150,
  currentMana: 50,
  maxMana: 50,
  stats: {
    vitality: 15,
    strength: 16,
    arcana: 10,
    dexterity: 14,
    faith: 8,
    resolve: 12,
  },
  statusEffects: [],
  isAlive: true,
  hasUsedRevive: false,
  relationship: 50,
};

// Julia's Abilities
export const juliaAbilities: Action[] = [
  {
    id: 'shadow_bolt',
    name: 'Shadow Bolt',
    type: ActionType.ATTACK,
    description: 'Dark magic attack scaling with Arcana',
    manaCost: 15,
    cooldown: 0,
    currentCooldown: 0,
    targetType: 'enemy',
    effects: [
      {
        type: 'damage',
        value: 25,
        statScaling: 'arcana',
        scalingMultiplier: 1.5,
      },
    ],
  },
  {
    id: 'tainted_heal',
    name: 'Tainted Heal',
    type: ActionType.HEAL,
    description: 'Dark healing that restores HP but may apply Cursed',
    manaCost: 20,
    cooldown: 1,
    currentCooldown: 0,
    targetType: 'ally',
    effects: [
      {
        type: 'heal',
        value: 40,
        statScaling: 'faith',
        scalingMultiplier: 1.2,
      },
    ],
  },
  {
    id: 'veilroot_surge',
    name: 'Veilroot Surge',
    type: ActionType.VEILROOT,
    description: 'Tap into Veilroot addiction for massive power boost. Increases addiction by 10%.',
    manaCost: 0,
    cooldown: 3,
    currentCooldown: 0,
    targetType: 'self',
    effects: [
      {
        type: 'special',
        value: 0, // Handled specially in combat logic
      },
    ],
  },
  {
    id: 'void_grasp',
    name: 'Void Grasp',
    type: ActionType.SKILL,
    description: 'Channel void energy to damage and potentially stun enemy',
    manaCost: 25,
    cooldown: 2,
    currentCooldown: 0,
    targetType: 'enemy',
    effects: [
      {
        type: 'damage',
        value: 35,
        statScaling: 'arcana',
        scalingMultiplier: 1.8,
      },
      {
        type: 'status',
        value: 0,
        statusEffect: StatusEffect.STUNNED,
        duration: 1,
      },
    ],
  },
  {
    id: 'redemption_light',
    name: 'Redemption Light',
    type: ActionType.HEAL,
    description: 'Pure healing that reduces Veilroot addiction by 5%',
    manaCost: 30,
    cooldown: 4,
    currentCooldown: 0,
    targetType: 'ally',
    effects: [
      {
        type: 'heal',
        value: 60,
        statScaling: 'faith',
        scalingMultiplier: 1.5,
      },
      {
        type: 'special',
        value: -5, // Reduces addiction
      },
    ],
  },
];

// Patrick's Abilities (The Sentinel)
export const patrickAbilities: Action[] = [
  {
    id: 'shield_bash',
    name: 'Shield Bash',
    type: ActionType.ATTACK,
    description: 'Physical attack that can stun',
    manaCost: 10,
    cooldown: 0,
    currentCooldown: 0,
    targetType: 'enemy',
    effects: [
      {
        type: 'damage',
        value: 30,
        statScaling: 'strength',
        scalingMultiplier: 1.3,
      },
    ],
  },
  {
    id: 'protective_stance',
    name: 'Protective Stance',
    type: ActionType.DEFEND,
    description: 'Take defensive position, reducing damage to all allies',
    manaCost: 15,
    cooldown: 2,
    currentCooldown: 0,
    targetType: 'all_allies',
    effects: [
      {
        type: 'buff',
        value: 30, // 30% damage reduction
        duration: 2,
      },
    ],
  },
  {
    id: 'semper_fi',
    name: 'Semper Fi',
    type: ActionType.SKILL,
    description: 'Refuse to give up - revive a fallen ally with 50% HP (once per combat)',
    manaCost: 40,
    cooldown: 999, // Effectively once per combat
    currentCooldown: 0,
    targetType: 'ally',
    effects: [
      {
        type: 'special',
        value: 50, // 50% HP restore
      },
    ],
  },
  {
    id: 'rallying_cry',
    name: 'Rallying Cry',
    type: ActionType.SKILL,
    description: 'Inspire allies, boosting their Strength and Resolve',
    manaCost: 20,
    cooldown: 3,
    currentCooldown: 0,
    targetType: 'all_allies',
    effects: [
      {
        type: 'buff',
        value: 5,
        duration: 3,
      },
    ],
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    type: ActionType.DEFEND,
    description: 'Channel resolve to become immune to status effects',
    manaCost: 25,
    cooldown: 4,
    currentCooldown: 0,
    targetType: 'self',
    effects: [
      {
        type: 'buff',
        value: 100, // Status immunity
        duration: 2,
      },
    ],
  },
];

// Dustin's Abilities (The Truth-Bearer)
export const dustinAbilities: Action[] = [
  {
    id: 'divine_light',
    name: 'Divine Light',
    type: ActionType.HEAL,
    description: 'Pure healing light',
    manaCost: 25,
    cooldown: 0,
    currentCooldown: 0,
    targetType: 'ally',
    effects: [
      {
        type: 'heal',
        value: 50,
        statScaling: 'faith',
        scalingMultiplier: 1.8,
      },
    ],
  },
  {
    id: 'truth_revelation',
    name: 'Truth Revelation',
    type: ActionType.SKILL,
    description: 'Reveal enemy weaknesses, increasing damage they take',
    manaCost: 30,
    cooldown: 2,
    currentCooldown: 0,
    targetType: 'enemy',
    effects: [
      {
        type: 'debuff',
        value: 25, // 25% more damage taken
        duration: 3,
      },
    ],
  },
  {
    id: 'guardian_spirit',
    name: 'Guardian Spirit',
    type: ActionType.SKILL,
    description: 'Automatic revival when ally dies (once per combat, passive)',
    manaCost: 0,
    cooldown: 999,
    currentCooldown: 0,
    targetType: 'ally',
    effects: [
      {
        type: 'special',
        value: 30, // 30% HP restore
      },
    ],
  },
  {
    id: 'cleansing_ritual',
    name: 'Cleansing Ritual',
    type: ActionType.HEAL,
    description: 'Remove all negative status effects from an ally',
    manaCost: 35,
    cooldown: 3,
    currentCooldown: 0,
    targetType: 'ally',
    effects: [
      {
        type: 'special',
        value: 0, // Cleanse all debuffs
      },
    ],
  },
  {
    id: 'wisdom_barrier',
    name: 'Wisdom Barrier',
    type: ActionType.DEFEND,
    description: 'Create magical barrier that absorbs damage',
    manaCost: 40,
    cooldown: 4,
    currentCooldown: 0,
    targetType: 'all_allies',
    effects: [
      {
        type: 'buff',
        value: 40, // Absorb 40 damage
        duration: 2,
      },
    ],
  },
];

// Vincent's Abilities (The Returned)
export const vincentAbilities: Action[] = [
  {
    id: 'reckless_strike',
    name: 'Reckless Strike',
    type: ActionType.ATTACK,
    description: 'Powerful attack that sacrifices defense',
    manaCost: 15,
    cooldown: 0,
    currentCooldown: 0,
    targetType: 'enemy',
    effects: [
      {
        type: 'damage',
        value: 45,
        statScaling: 'strength',
        scalingMultiplier: 1.6,
      },
    ],
  },
  {
    id: 'life_drain',
    name: 'Life Drain',
    type: ActionType.SKILL,
    description: 'Deal damage and heal self for portion of damage dealt',
    manaCost: 20,
    cooldown: 2,
    currentCooldown: 0,
    targetType: 'enemy',
    effects: [
      {
        type: 'damage',
        value: 30,
        statScaling: 'strength',
        scalingMultiplier: 1.4,
      },
      {
        type: 'heal',
        value: 15,
        statScaling: 'strength',
        scalingMultiplier: 0.7,
      },
    ],
  },
  {
    id: 'defiant_breath',
    name: 'Defiant Breath',
    type: ActionType.SKILL,
    description: 'Resurrect at 0 HP once per battle (passive)',
    manaCost: 0,
    cooldown: 999,
    currentCooldown: 0,
    targetType: 'self',
    effects: [
      {
        type: 'special',
        value: 40, // Resurrect with 40% HP
      },
    ],
  },
  {
    id: 'vengeful_fury',
    name: 'Vengeful Fury',
    type: ActionType.ATTACK,
    description: 'Damage increases based on missing HP',
    manaCost: 25,
    cooldown: 3,
    currentCooldown: 0,
    targetType: 'enemy',
    effects: [
      {
        type: 'damage',
        value: 40,
        statScaling: 'strength',
        scalingMultiplier: 2.0,
      },
    ],
  },
  {
    id: 'undead_resilience',
    name: 'Undead Resilience',
    type: ActionType.DEFEND,
    description: 'Take reduced damage and regenerate HP',
    manaCost: 30,
    cooldown: 4,
    currentCooldown: 0,
    targetType: 'self',
    effects: [
      {
        type: 'buff',
        value: 40, // 40% damage reduction
        duration: 3,
      },
      {
        type: 'status',
        value: 10,
        statusEffect: StatusEffect.REGENERATING,
        duration: 3,
      },
    ],
  },
];

export const playerParty = [juliaBlackthorne, patrick, dustin, vincent];
