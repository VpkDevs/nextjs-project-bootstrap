'use client';

import { Character } from '@/types/combat';
import styles from './CharacterPanel.module.css';

interface CharacterPanelProps {
  character: Character;
  isCurrentTurn: boolean;
  isTargetable: boolean;
  onSelect: () => void;
}

export default function CharacterPanel({
  character,
  isCurrentTurn,
  isTargetable,
  onSelect,
}: CharacterPanelProps) {
  const hpPercent = (character.currentHp / character.maxHp) * 100;
  const manaPercent = (character.currentMana / character.maxMana) * 100;

  return (
    <div
      className={`${styles.panel} ${isCurrentTurn ? styles.current : ''} ${
        !character.isAlive ? styles.dead : ''
      } ${isTargetable ? styles.targetable : ''}`}
      onClick={isTargetable ? onSelect : undefined}
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{character.name}</h3>
        <span className={styles.level}>Lv.{character.level}</span>
      </div>

      <div className={styles.role}>{character.role.replace('_', ' ').toUpperCase()}</div>

      <div className={styles.bars}>
        <div className={styles.barContainer}>
          <div className={styles.barLabel}>
            <span>HP</span>
            <span>
              {character.currentHp}/{character.maxHp}
            </span>
          </div>
          <div className={styles.bar}>
            <div
              className={styles.hpFill}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        <div className={styles.barContainer}>
          <div className={styles.barLabel}>
            <span>MP</span>
            <span>
              {character.currentMana}/{character.maxMana}
            </span>
          </div>
          <div className={styles.bar}>
            <div
              className={styles.manaFill}
              style={{ width: `${manaPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>STR</span>
          <span className={styles.statValue}>{character.stats.strength}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>ARC</span>
          <span className={styles.statValue}>{character.stats.arcana}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>DEX</span>
          <span className={styles.statValue}>{character.stats.dexterity}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>FTH</span>
          <span className={styles.statValue}>{character.stats.faith}</span>
        </div>
      </div>

      {character.statusEffects.length > 0 && (
        <div className={styles.statusEffects}>
          {character.statusEffects.map((effect, idx) => (
            <span key={idx} className={styles.statusEffect}>
              {effect.type} ({effect.duration})
            </span>
          ))}
        </div>
      )}

      {isCurrentTurn && (
        <div className={styles.turnIndicator}>YOUR TURN</div>
      )}
    </div>
  );
}
