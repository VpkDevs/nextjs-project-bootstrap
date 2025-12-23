'use client';

import { useState, useEffect } from 'react';
import { CombatEngine } from '@/lib/combat-engine';
import { playerParty, juliaAbilities, patrickAbilities, dustinAbilities, vincentAbilities } from '@/lib/characters';
import { encounters } from '@/lib/enemies';
import { Character, Enemy, CombatPhase, Action } from '@/types/combat';
import CombatUI from '@/components/CombatUI';

export default function Home() {
  const [engine, setEngine] = useState<CombatEngine | null>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  useEffect(() => {
    // Initialize combat with a sample encounter
    const newEngine = new CombatEngine(playerParty, encounters.mid_game);
    setEngine(newEngine);
    
    // If combat starts with enemy turn, trigger it
    setTimeout(() => {
      const state = newEngine.getState();
      if (state.phase === CombatPhase.ENEMY_TURN) {
        processEnemyTurns(newEngine);
      }
    }, 100);
  }, []);

  const processEnemyTurns = (currentEngine: CombatEngine) => {
    const state = currentEngine.getState();
    const currentCombatant = currentEngine.getCurrentCombatant() as Enemy;
    
    if (currentCombatant && state.phase === CombatPhase.ENEMY_TURN) {
      setTimeout(() => {
        currentEngine.enemyTakeTurn(currentCombatant.id);
        currentEngine.nextTurn();
        
        const newState = currentEngine.getState();
        setEngine(Object.assign(Object.create(Object.getPrototypeOf(currentEngine)), currentEngine));
        
        if (newState.phase === CombatPhase.ENEMY_TURN) {
          processEnemyTurns(currentEngine);
        }
      }, 1000);
    }
  };

  const handleActionSelect = (action: Action) => {
    setSelectedAction(action);
  };

  const handleTargetSelect = (targetId: string) => {
    if (!engine || !selectedAction) return;

    const state = engine.getState();
    const currentCombatant = engine.getCurrentCombatant();
    
    if (!currentCombatant) return;

    const success = engine.executeAction(
      currentCombatant.id,
      selectedAction,
      targetId
    );

    if (success) {
      setSelectedAction(null);
      setSelectedTarget(null);
      
      // Process turn
      setTimeout(() => {
        engine.nextTurn();
        
        // Force re-render
        setEngine(Object.assign(Object.create(Object.getPrototypeOf(engine)), engine));
        
        // If it's enemy turn, auto-execute
        const newState = engine.getState();
        if (newState.phase === CombatPhase.ENEMY_TURN) {
          handleEnemyTurn();
        }
      }, 500);
    }
  };

  const handleEnemyTurn = () => {
    if (!engine) return;
    processEnemyTurns(engine);
  };

  const getAbilitiesForCharacter = (char: Character): Action[] => {
    switch (char.id) {
      case 'julia': return juliaAbilities;
      case 'patrick': return patrickAbilities;
      case 'dustin': return dustinAbilities;
      case 'vincent': return vincentAbilities;
      default: return [];
    }
  };

  if (!engine) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '24px',
        color: '#9d4edd'
      }}>
        Initializing Combat System...
      </div>
    );
  }

  const state = engine.getState();
  const currentCombatant = engine.getCurrentCombatant();

  return (
    <main>
      <CombatUI
        combatState={state}
        currentCombatant={currentCombatant}
        selectedAction={selectedAction}
        onActionSelect={handleActionSelect}
        onTargetSelect={handleTargetSelect}
        getAbilities={getAbilitiesForCharacter}
      />
    </main>
  );
}
