'use client';

import { CombatLogEntry } from '@/types/combat';
import styles from './CombatLog.module.css';
import { useEffect, useRef } from 'react';

interface CombatLogProps {
  entries: CombatLogEntry[];
}

export default function CombatLog({ entries }: CombatLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const getLogClass = (type: CombatLogEntry['type']) => {
    switch (type) {
      case 'action':
        return styles.action;
      case 'damage':
        return styles.damage;
      case 'heal':
        return styles.heal;
      case 'status':
        return styles.status;
      case 'death':
        return styles.death;
      case 'narrative':
        return styles.narrative;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Combat Log</h3>
      <div className={styles.logEntries}>
        {entries.map((entry, index) => (
          <div
            key={`${entry.timestamp}-${index}`}
            className={`${styles.entry} ${getLogClass(entry.type)}`}
          >
            <span className={styles.turn}>[T{entry.turn}]</span>
            <span className={styles.message}>{entry.message}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
