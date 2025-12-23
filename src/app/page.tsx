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
  }, []);

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
        
        // If it's enemy turn, auto-execute
        const newState = engine.getState();
        if (newState.phase === CombatPhase.ENEMY_TURN) {
          handleEnemyTurn();
        }
        
        setEngine(new CombatEngine(
          newState.playerParty,
          newState.enemies
        ));
      }, 500);
    }
  };

  const handleEnemyTurn = () => {
    if (!engine) return;

    const state = engine.getState();
    const currentCombatant = engine.getCurrentCombatant() as Enemy;
    
    if (currentCombatant) {
      setTimeout(() => {
        engine.enemyTakeTurn(currentCombatant.id);
        engine.nextTurn();
        
        const newState = engine.getState();
        if (newState.phase === CombatPhase.ENEMY_TURN) {
          handleEnemyTurn();
        } else {
          setEngine(new CombatEngine(
            newState.playerParty,
            newState.enemies
          ));
        }
      }, 1000);
    }
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
