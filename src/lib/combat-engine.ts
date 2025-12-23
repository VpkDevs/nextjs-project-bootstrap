import {
  CombatState,
  CombatPhase,
  Character,
  Enemy,
  TurnOrderEntry,
  Action,
  ActionEffect,
  CombatLogEntry,
  StatusEffect,
  ActiveStatusEffect,
} from '../types/combat';

export class CombatEngine {
  private state: CombatState;

  constructor(playerParty: Character[], enemies: Enemy[]) {
    this.state = {
      phase: CombatPhase.INITIATIVE,
      turnNumber: 1,
      turnOrder: [],
      currentTurnIndex: 0,
      playerParty: JSON.parse(JSON.stringify(playerParty)), // Deep copy
      enemies: JSON.parse(JSON.stringify(enemies)),
      combatLog: [],
      isProcessing: false,
    };

    this.initializeCombat();
  }

  private initializeCombat(): void {
    // Calculate initiative for all combatants
    const turnOrder: TurnOrderEntry[] = [];

    // Add player party
    this.state.playerParty.forEach((char) => {
      if (char.isAlive) {
        turnOrder.push({
          combatantId: char.id,
          isPlayer: true,
          initiative: char.stats.dexterity + Math.random() * 10,
          name: char.name,
        });
      }
    });

    // Add enemies
    this.state.enemies.forEach((enemy) => {
      if (enemy.isAlive) {
        turnOrder.push({
          combatantId: enemy.id,
          isPlayer: false,
          initiative: enemy.stats.dexterity + Math.random() * 10,
          name: enemy.name,
        });
      }
    });

    // Sort by initiative (highest first)
    turnOrder.sort((a, b) => b.initiative - a.initiative);
    this.state.turnOrder = turnOrder;

    this.addLog('Combat begins!', 'narrative');
    this.state.phase = CombatPhase.PLAYER_TURN;
  }

  public getState(): CombatState {
    return { ...this.state };
  }

  public getCurrentCombatant(): Character | Enemy | null {
    if (this.state.currentTurnIndex >= this.state.turnOrder.length) {
      return null;
    }

    const current = this.state.turnOrder[this.state.currentTurnIndex];
    if (current.isPlayer) {
      return this.state.playerParty.find((c) => c.id === current.combatantId) || null;
    } else {
      return this.state.enemies.find((e) => e.id === current.combatantId) || null;
    }
  }

  public executeAction(
    actorId: string,
    action: Action,
    targetId: string
  ): boolean {
    this.state.isProcessing = true;

    const actor = this.getCombatant(actorId);
    const target = this.getCombatant(targetId);

    if (!actor || !target) {
      this.state.isProcessing = false;
      return false;
    }

    // Check mana cost
    if (actor.currentMana < action.manaCost) {
      this.addLog(`${actor.name} doesn't have enough mana!`, 'action');
      this.state.isProcessing = false;
      return false;
    }

    // Deduct mana
    actor.currentMana -= action.manaCost;

    this.addLog(`${actor.name} uses ${action.name}!`, 'action');

    // Process each effect
    action.effects.forEach((effect) => {
      this.processEffect(actor, target, effect, action);
    });

    // Update cooldown
    action.currentCooldown = action.cooldown;

    this.state.isProcessing = false;
    return true;
  }

  private processEffect(
    actor: Character | Enemy,
    target: Character | Enemy,
    effect: ActionEffect,
    action: Action
  ): void {
    switch (effect.type) {
      case 'damage':
        this.dealDamage(actor, target, effect);
        break;
      case 'heal':
        this.healTarget(actor, target, effect);
        break;
      case 'status':
        this.applyStatus(target, effect);
        break;
      case 'buff':
      case 'debuff':
        this.applyBuffDebuff(target, effect);
        break;
      case 'special':
        this.processSpecial(actor, target, effect, action);
        break;
    }
  }

  private dealDamage(
    actor: Character | Enemy,
    target: Character | Enemy,
    effect: ActionEffect
  ): void {
    let damage = effect.value;

    // Apply stat scaling
    if (effect.statScaling && effect.scalingMultiplier) {
      const statValue = actor.stats[effect.statScaling];
      damage += statValue * effect.scalingMultiplier;
    }

    // Apply damage
    damage = Math.floor(damage);
    target.currentHp = Math.max(0, target.currentHp - damage);

    this.addLog(`${target.name} takes ${damage} damage!`, 'damage');

    // Check if target died
    if (target.currentHp === 0 && target.isAlive) {
      target.isAlive = false;
      this.addLog(`${target.name} has fallen!`, 'death');
      this.checkForRevives(target);
    }
  }

  private healTarget(
    actor: Character | Enemy,
    target: Character | Enemy,
    effect: ActionEffect
  ): void {
    let healing = effect.value;

    // Apply stat scaling
    if (effect.statScaling && effect.scalingMultiplier) {
      const statValue = actor.stats[effect.statScaling];
      healing += statValue * effect.scalingMultiplier;
    }

    healing = Math.floor(healing);
    const actualHealing = Math.min(
      healing,
      target.maxHp - target.currentHp
    );
    target.currentHp += actualHealing;

    this.addLog(`${target.name} recovers ${actualHealing} HP!`, 'heal');
  }

  private applyStatus(target: Character | Enemy, effect: ActionEffect): void {
    if (!effect.statusEffect || !effect.duration) return;

    const existingStatus = target.statusEffects.find(
      (s) => s.type === effect.statusEffect
    );

    if (existingStatus) {
      existingStatus.duration = Math.max(existingStatus.duration, effect.duration);
    } else {
      target.statusEffects.push({
        type: effect.statusEffect,
        duration: effect.duration,
        potency: effect.value,
      });
    }

    this.addLog(
      `${target.name} is afflicted with ${effect.statusEffect}!`,
      'status'
    );
  }

  private applyBuffDebuff(
    target: Character | Enemy,
    effect: ActionEffect
  ): void {
    // Simplified buff/debuff handling
    this.addLog(
      `${target.name} receives ${effect.type}!`,
      'status'
    );
  }

  private processSpecial(
    actor: Character | Enemy,
    target: Character | Enemy,
    effect: ActionEffect,
    action: Action
  ): void {
    // Handle special ability effects
    switch (action.id) {
      case 'veilroot_surge':
        // Increase Julia's addiction (handled in UI layer)
        this.addLog(
          `${actor.name}'s power surges with dark energy!`,
          'narrative'
        );
        break;
      case 'semper_fi':
        if (!target.isAlive) {
          target.isAlive = true;
          target.currentHp = Math.floor(target.maxHp * 0.5);
          this.addLog(
            `${actor.name} refuses to let ${target.name} fall! They rise again!`,
            'narrative'
          );
        }
        break;
      case 'defiant_breath':
        // Auto-triggered when Vincent dies
        break;
      case 'guardian_spirit':
        // Auto-triggered when ally dies
        break;
    }
  }

  private checkForRevives(fallen: Character | Enemy): void {
    // Check Vincent's Defiant Breath
    if ('role' in fallen && !fallen.hasUsedRevive) {
      if (fallen.id === 'vincent') {
        fallen.isAlive = true;
        fallen.currentHp = Math.floor(fallen.maxHp * 0.4);
        fallen.hasUsedRevive = true;
        this.addLog(
          `${fallen.name} refuses to die! Defiant Breath activates!`,
          'narrative'
        );
      }
    }

    // Check Dustin's Guardian Spirit (can be implemented here)
  }

  public processStatusEffects(): void {
    // Process all status effects at turn end
    [...this.state.playerParty, ...this.state.enemies].forEach((combatant) => {
      if (!combatant.isAlive) return;

      combatant.statusEffects.forEach((status) => {
        this.applyStatusEffectTick(combatant, status);
      });

      // Decrement durations
      combatant.statusEffects = combatant.statusEffects
        .map((s) => ({ ...s, duration: s.duration - 1 }))
        .filter((s) => s.duration > 0);
    });
  }

  private applyStatusEffectTick(
    combatant: Character | Enemy,
    status: ActiveStatusEffect
  ): void {
    switch (status.type) {
      case StatusEffect.POISONED:
        combatant.currentHp = Math.max(0, combatant.currentHp - status.potency);
        this.addLog(`${combatant.name} takes ${status.potency} poison damage!`, 'damage');
        break;
      case StatusEffect.REGENERATING:
        const healing = Math.min(status.potency, combatant.maxHp - combatant.currentHp);
        combatant.currentHp += healing;
        this.addLog(`${combatant.name} regenerates ${healing} HP!`, 'heal');
        break;
      case StatusEffect.VEILROOT_WITHDRAWAL:
        combatant.currentHp = Math.max(0, combatant.currentHp - status.potency);
        this.addLog(
          `${combatant.name} suffers ${status.potency} withdrawal damage!`,
          'damage'
        );
        break;
    }
  }

  public nextTurn(): void {
    this.processStatusEffects();

    this.state.currentTurnIndex++;

    if (this.state.currentTurnIndex >= this.state.turnOrder.length) {
      // Round complete
      this.state.currentTurnIndex = 0;
      this.state.turnNumber++;
      this.addLog(`--- Turn ${this.state.turnNumber} ---`, 'narrative');
    }

    // Check victory/defeat conditions
    this.checkCombatEnd();

    // Update phase
    const current = this.state.turnOrder[this.state.currentTurnIndex];
    this.state.phase = current.isPlayer
      ? CombatPhase.PLAYER_TURN
      : CombatPhase.ENEMY_TURN;
  }

  private checkCombatEnd(): void {
    const playersAlive = this.state.playerParty.some((c) => c.isAlive);
    const enemiesAlive = this.state.enemies.some((e) => e.isAlive);

    if (!playersAlive) {
      this.state.phase = CombatPhase.DEFEAT;
      this.addLog('Defeat...', 'narrative');
    } else if (!enemiesAlive) {
      this.state.phase = CombatPhase.VICTORY;
      this.addLog('Victory!', 'narrative');
    }
  }

  private getCombatant(id: string): Character | Enemy | null {
    const char = this.state.playerParty.find((c) => c.id === id);
    if (char) return char;
    return this.state.enemies.find((e) => e.id === id) || null;
  }

  private addLog(message: string, type: CombatLogEntry['type']): void {
    this.state.combatLog.push({
      turn: this.state.turnNumber,
      message,
      type,
      timestamp: Date.now(),
    });
  }

  public enemyTakeTurn(enemyId: string): void {
    const enemy = this.state.enemies.find((e) => e.id === enemyId);
    if (!enemy || !enemy.isAlive) return;

    // Simple AI: target lowest HP player
    const aliveParty = this.state.playerParty.filter((c) => c.isAlive);
    if (aliveParty.length === 0) return;

    const target = aliveParty.reduce((lowest, current) =>
      current.currentHp < lowest.currentHp ? current : lowest
    );

    // Execute pattern-based action
    const actionId = enemy.actionPattern[enemy.currentPatternIndex];
    enemy.currentPatternIndex = (enemy.currentPatternIndex + 1) % enemy.actionPattern.length;

    // Simple damage attack for now
    const damage = 20 + enemy.stats.strength * 1.2;
    target.currentHp = Math.max(0, target.currentHp - Math.floor(damage));

    this.addLog(
      `${enemy.name} attacks ${target.name} for ${Math.floor(damage)} damage!`,
      'action'
    );

    if (target.currentHp === 0 && target.isAlive) {
      target.isAlive = false;
      this.addLog(`${target.name} has fallen!`, 'death');
      this.checkForRevives(target);
    }
  }
}
