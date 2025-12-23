'use client';

import { CombatState, Character, Enemy, CombatPhase, Action } from '@/types/combat';
import styles from './CombatUI.module.css';
import CharacterPanel from './CharacterPanel';
import EnemyPanel from './EnemyPanel';
import ActionBar from './ActionBar';
import TurnOrder from './TurnOrder';
import CombatLog from './CombatLog';

interface CombatUIProps {
  combatState: CombatState;
  currentCombatant: Character | Enemy | null;
  selectedAction: Action | null;
  onActionSelect: (action: Action) => void;
  onTargetSelect: (targetId: string) => void;
  getAbilities: (char: Character) => Action[];
}

export default function CombatUI({
  combatState,
  currentCombatant,
  selectedAction,
  onActionSelect,
  onTargetSelect,
  getAbilities,
}: CombatUIProps) {
  const isPlayerTurn = combatState.phase === CombatPhase.PLAYER_TURN;
  const isVictory = combatState.phase === CombatPhase.VICTORY;
  const isDefeat = combatState.phase === CombatPhase.DEFEAT;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>SHADOWLIGHT: A CLERIC'S REDEMPTION</h1>
        <div className={styles.subtitle}>Turn {combatState.turnNumber}</div>
      </header>

      <div className={styles.combatArea}>
        {/* Turn Order Display */}
        <div className={styles.turnOrderSection}>
          <TurnOrder
            turnOrder={combatState.turnOrder}
            currentIndex={combatState.currentTurnIndex}
          />
        </div>

        {/* Enemy Section */}
        <div className={styles.enemySection}>
          <h2 className={styles.sectionTitle}>Enemies</h2>
          <div className={styles.enemyGrid}>
            {combatState.enemies.map((enemy) => (
              <EnemyPanel
                key={enemy.id}
                enemy={enemy}
                isTargetable={isPlayerTurn && selectedAction !== null}
                onSelect={() => onTargetSelect(enemy.id)}
              />
            ))}
          </div>
        </div>

        {/* Player Party Section */}
        <div className={styles.partySection}>
          <h2 className={styles.sectionTitle}>Party</h2>
          <div className={styles.partyGrid}>
            {combatState.playerParty.map((char) => (
              <CharacterPanel
                key={char.id}
                character={char}
                isCurrentTurn={
                  currentCombatant?.id === char.id && isPlayerTurn
                }
                isTargetable={
                  isPlayerTurn &&
                  selectedAction !== null &&
                  (selectedAction.targetType === 'ally' ||
                    selectedAction.targetType === 'self')
                }
                onSelect={() => onTargetSelect(char.id)}
              />
            ))}
          </div>
        </div>

        {/* Action Bar */}
        {isPlayerTurn && currentCombatant && 'role' in currentCombatant && (
          <div className={styles.actionSection}>
            <ActionBar
              character={currentCombatant as Character}
              abilities={getAbilities(currentCombatant as Character)}
              selectedAction={selectedAction}
              onActionSelect={onActionSelect}
            />
          </div>
        )}

        {/* Combat Log */}
        <div className={styles.logSection}>
          <CombatLog entries={combatState.combatLog} />
        </div>
      </div>

      {/* Victory/Defeat Overlay */}
      {(isVictory || isDefeat) && (
        <div className={styles.overlay}>
          <div className={styles.outcomeCard}>
            <h2 className={isVictory ? styles.victory : styles.defeat}>
              {isVictory ? 'VICTORY!' : 'DEFEAT...'}
            </h2>
            <p className={styles.outcomeText}>
              {isVictory
                ? 'The battle is won, but at what cost to Julia\'s soul?'
                : 'The darkness claims another victim...'}
            </p>
            <button
              className={styles.restartButton}
              onClick={() => window.location.reload()}
            >
              New Battle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
