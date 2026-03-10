'use client';

import { Character, Action } from '@/types/combat';
import styles from './ActionBar.module.css';

interface ActionBarProps {
  character: Character;
  abilities: Action[];
  selectedAction: Action | null;
  onActionSelect: (action: Action) => void;
}

export default function ActionBar({
  character,
  abilities,
  selectedAction,
  onActionSelect,
}: ActionBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Actions - {character.name}</h3>
        <div className={styles.manaDisplay}>
          Mana: {character.currentMana}/{character.maxMana}
        </div>
      </div>

      <div className={styles.actions}>
        {abilities.map((action) => {
          const canAfford = character.currentMana >= action.manaCost;
          const isSelected = selectedAction?.id === action.id;
          const isOnCooldown = action.currentCooldown > 0;

          return (
            <button
              key={action.id}
              className={`${styles.actionButton} ${
                isSelected ? styles.selected : ''
              }`}
              onClick={() => onActionSelect(action)}
              disabled={!canAfford || isOnCooldown}
            >
              <div className={styles.actionName}>{action.name}</div>
              <div className={styles.actionCost}>
                {action.manaCost > 0 ? `${action.manaCost} MP` : 'Free'}
              </div>
              <div className={styles.actionDesc}>{action.description}</div>
              {isOnCooldown && (
                <div className={styles.cooldown}>
                  Cooldown: {action.currentCooldown}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedAction && (
        <div className={styles.selectedInfo}>
          <strong>Selected:</strong> {selectedAction.name} - Select a target
        </div>
      )}
    </div>
  );
}
