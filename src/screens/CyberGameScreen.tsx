import React, { useEffect } from 'react';
import { GameLayout } from '../layouts';
import { TopHUD } from '../components/hud/TopHUD';
import { GameBoard } from '../components/board/GameBoard';
import { PowerUpTray } from '../components/hud/PowerUpTray';
import { VictoryModal } from '../components/modals/VictoryModal';
import { GameOverModal } from '../components/modals/GameOverModal';
import { PauseModal } from '../components/modals/PauseModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { useGameStore } from '../store/useGameStore';

export const CyberGameScreen: React.FC = () => {
  const { loadLevel, tickTimer, isTimerRunning } = useGameStore();

  // Initialize level 1 on mount
  useEffect(() => {
    loadLevel(1);
  }, [loadLevel]);

  // Active challenge timer countdown
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  return (
    <GameLayout
      header={<TopHUD />}
      footer={<PowerUpTray />}
      modals={
        <>
          <VictoryModal />
          <GameOverModal />
          <PauseModal />
          <SettingsModal />
        </>
      }
    >
      <GameBoard />
    </GameLayout>
  );
};
