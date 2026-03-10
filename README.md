# SHADOWLIGHT: A Cleric's Redemption - Turn-Based Combat System

A comprehensive turn-based combat system built with Next.js 15, TypeScript, and React 19 for the dark fantasy narrative game SHADOWLIGHT.

## Overview

This project implements a complete turn-based combat system featuring:

- **Initiative-based turn order** with kinetic typography display
- **6 Core Stats**: Vitality, Strength, Arcana, Dexterity, Faith, Resolve
- **4 Unique Characters** with 4-5 abilities each
- **5 Enemy Types** with distinct behaviors and patterns
- **Veilroot Addiction Mechanic** for protagonist Julia Blackthorne
- **Status Effects & Buffs/Debuffs**
- **Narrative Integration** with relationship tracking

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the combat system in action.

### Build

```bash
npm run build
npm start
```

## System Architecture

### Core Components

#### 1. Type System (`src/types/combat.ts`)
- Complete TypeScript definitions for all combat entities
- Character, Enemy, Action, and Combat State interfaces
- Status effects and buff/debuff system

#### 2. Combat Engine (`src/lib/combat-engine.ts`)
- Core combat logic and state management
- Initiative calculation and turn order
- Damage/healing calculations with stat scaling
- Status effect processing
- Victory/defeat condition checking

#### 3. Character Data (`src/lib/characters.ts`)
Defines the four party members:

**Julia Blackthorne** (Dark Cleric)
- Shadow Bolt: Dark magic attack
- Tainted Heal: Corrupted healing
- Veilroot Surge: Addiction-powered boost
- Void Grasp: Stun + damage
- Redemption Light: Pure heal that reduces addiction

**Patrick "The Sentinel"** (Tank/Marine)
- Shield Bash: Physical attack
- Protective Stance: Party-wide defense
- Semper Fi: Revive fallen ally (once per combat)
- Rallying Cry: Buff party stats
- Iron Will: Status immunity

**Dustin "The Truth-Bearer"** (Scholar/Healer)
- Divine Light: Pure healing
- Truth Revelation: Reveal enemy weakness
- Guardian Spirit: Auto-revival (passive)
- Cleansing Ritual: Remove debuffs
- Wisdom Barrier: Absorb damage

**Vincent "The Returned"** (Undead Warrior)
- Reckless Strike: High damage attack
- Life Drain: Damage + self-heal
- Defiant Breath: Auto-resurrect at 0 HP (passive)
- Vengeful Fury: Scales with missing HP
- Undead Resilience: Defense + regeneration

#### 4. Enemy System (`src/lib/enemies.ts`)
Five enemy types with unique abilities:
- **Corrupted**: Twisted holy beings (Tainted Smite, Dark Prayer)
- **Shades**: Shadow entities (Shadow Strike, Phase Shift)
- **Beasts**: Corrupted animals (Savage Bite, Frenzied Roar)
- **Echoes**: Manifestations of memories (Lament, Memory Strike)
- **Inner Demons**: Julia's personal demons (Guilt Strike, Whisper Doubt)

### UI Components

#### CombatUI (`src/components/CombatUI.tsx`)
Main combat interface orchestrator

#### CharacterPanel (`src/components/CharacterPanel.tsx`)
- Displays character stats, HP/MP bars
- Shows status effects
- Highlights current turn
- Clickable for targeting

#### EnemyPanel (`src/components/EnemyPanel.tsx`)
- Enemy information display
- Threat level indicator
- Targeting interface

#### ActionBar (`src/components/ActionBar.tsx`)
- Shows available abilities
- Displays mana costs and cooldowns
- Action selection interface

#### TurnOrder (`src/components/TurnOrder.tsx`)
- Initiative-based turn order display
- Visual indicator for current combatant
- Kinetic typography with animations

#### CombatLog (`src/components/CombatLog.tsx`)
- Real-time combat event feed
- Color-coded by event type
- Auto-scrolls to latest

## Key Mechanics

### Veilroot Addiction System
Julia's unique mechanic that provides power at a cost:
- **Veilroot Surge**: Increases addiction by 10%, grants power boost
- **Redemption Light**: Reduces addiction by 5%, provides pure healing
- Withdrawal damage scales with addiction level
- Narrative consequences for high addiction

### Companion Resurrections
Each companion has a unique resurrection ability:
- **Patrick**: "Semper Fi" - Active ability to revive an ally
- **Dustin**: "Guardian Spirit" - Automatic revival when ally dies
- **Vincent**: "Defiant Breath" - Self-resurrect at 0 HP

### Initiative System
- Turn order calculated at combat start
- Based on Dexterity stat + random element
- Displays in sidebar with current combatant highlighted

### Status Effects
- Poisoned: Damage over time
- Stunned: Skip turn
- Blessed: Increased stats
- Cursed: Reduced effectiveness
- Regenerating: Heal over time
- Weakened: Reduced damage
- Veilroot Withdrawal: Special addiction effect

### Enemy AI
- Pattern-based action selection
- Threat level calculation
- Targets lowest HP characters
- Type-specific behaviors

## Combat Flow

1. **Initiative Phase**: Calculate turn order based on Dexterity
2. **Player Turn**: 
   - Select ability
   - Select target
   - Execute action
3. **Enemy Turn**: AI-controlled enemy actions
4. **Resolution**: Process status effects, check win/loss conditions
5. **Repeat** until victory or defeat

## Customization & Extension

### Adding New Characters
1. Define character in `src/lib/characters.ts`
2. Create ability set with `Action[]`
3. Add to `playerParty` array

### Adding New Enemies
1. Define enemy in `src/lib/enemies.ts`
2. Create action pattern
3. Add to encounter configurations

### Adding New Abilities
```typescript
{
  id: 'ability_id',
  name: 'Ability Name',
  type: ActionType.SKILL,
  description: 'What it does',
  manaCost: 20,
  cooldown: 2,
  currentCooldown: 0,
  targetType: 'enemy',
  effects: [
    {
      type: 'damage',
      value: 30,
      statScaling: 'strength',
      scalingMultiplier: 1.5,
    },
  ],
}
```

## Design Philosophy

### Narrative Integration
- Combat choices affect character relationships
- Victory/defeat tied to story progression
- Special abilities reflect character backgrounds
- Veilroot addiction creates moral tension

### Strategic Depth
- 6-stat system allows diverse builds
- Status effects create tactical decisions
- Cooldowns encourage varied ability use
- Initiative system rewards speed investment

### Visual Feedback
- Color-coded health bars
- Animated status indicators
- Kinetic turn order display
- Real-time combat log

## Future Enhancements

Potential areas for expansion:
- Equipment system
- Skill trees and character progression
- More enemy types and bosses
- Multiple encounter scenarios
- Save/load combat state
- Difficulty settings
- Animation system
- Sound effects and music
- Mobile responsive design improvements

## Technical Stack

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **CSS Modules**: Scoped styling
- **Client-side State**: React hooks for combat state

## License

This project is part of the SHADOWLIGHT game development.

---

**SHADOWLIGHT: A Cleric's Redemption** - Where every choice costs a piece of your soul.
