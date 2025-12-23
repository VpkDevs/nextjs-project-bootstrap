'use client';

import { TurnOrderEntry } from '@/types/combat';
import styles from './TurnOrder.module.css';

interface TurnOrderProps {
  turnOrder: TurnOrderEntry[];
  currentIndex: number;
}

export default function TurnOrder({ turnOrder, currentIndex }: TurnOrderProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Turn Order</h3>
      <div className={styles.entries}>
        {turnOrder.map((entry, index) => (
          <div
            key={`${entry.combatantId}-${index}`}
            className={`${styles.entry} ${
              index === currentIndex ? styles.current : ''
            } ${entry.isPlayer ? styles.player : styles.enemy}`}
          >
            <div className={styles.position}>{index + 1}</div>
            <div className={styles.info}>
              <div className={styles.name}>{entry.name}</div>
              <div className={styles.initiative}>
                Init: {Math.floor(entry.initiative)}
              </div>
            </div>
            {index === currentIndex && (
              <div className={styles.arrow}>▶</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
