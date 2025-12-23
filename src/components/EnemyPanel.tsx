'use client';

import { Enemy } from '@/types/combat';
import styles from './EnemyPanel.module.css';

interface EnemyPanelProps {
  enemy: Enemy;
  isTargetable: boolean;
  onSelect: () => void;
}

export default function EnemyPanel({
  enemy,
  isTargetable,
  onSelect,
}: EnemyPanelProps) {
  const hpPercent = (enemy.currentHp / enemy.maxHp) * 100;

  return (
    <div
      className={`${styles.panel} ${!enemy.isAlive ? styles.dead : ''} ${
        isTargetable ? styles.targetable : ''
      }`}
      onClick={isTargetable ? onSelect : undefined}
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{enemy.name}</h3>
        <span className={styles.level}>Lv.{enemy.level}</span>
      </div>

      <div className={styles.type}>{enemy.type.toUpperCase()}</div>

      <div className={styles.barContainer}>
        <div className={styles.barLabel}>
          <span>HP</span>
          <span>
            {enemy.currentHp}/{enemy.maxHp}
          </span>
        </div>
        <div className={styles.bar}>
          <div
            className={styles.hpFill}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      <div className={styles.threatMeter}>
        <span className={styles.threatLabel}>Threat:</span>
        <div className={styles.threatBar}>
          <div
            className={styles.threatFill}
            style={{ width: `${enemy.threatLevel}%` }}
          />
        </div>
      </div>

      {enemy.statusEffects.length > 0 && (
        <div className={styles.statusEffects}>
          {enemy.statusEffects.map((effect, idx) => (
            <span key={idx} className={styles.statusEffect}>
              {effect.type} ({effect.duration})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
