import { create } from 'zustand';
import { TileData, LaserPath, PowerUpCounts, Direction } from '../types/game';
import { LEVELS } from '../constants/levels';
import { evaluateCircuit } from '../engine/circuitEngine';

interface GameState {
  level: number;
  gridSize: number;
  grid: (TileData | null)[][];
  movesLeft: number;
  maxMoves: number;
  score: number;
  streak: number;
  stars: number;
  timeRemaining: number;
  isTimerRunning: boolean;
  isPaused: boolean;
  isSettingsOpen: boolean;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  isLevelComplete: boolean;
  isGameOver: boolean;
  laserPaths: LaserPath[];
  poweredTileIds: string[];
  powerUps: PowerUpCounts;
  blasterActive: boolean;

  // Actions
  loadLevel: (levelNum: number) => void;
  moveTile: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean;
  rotateTile: (row: number, col: number) => void;
  destroyTileAt: (row: number, col: number) => void;
  activatePowerUp: (type: keyof PowerUpCounts) => void;
  tickTimer: () => void;
  restartLevel: () => void;
  nextLevel: () => void;
  setPaused: (paused: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  toggleHaptics: () => void;
  toggleSound: () => void;
}

const rotateDirectionClockwise = (dir: Direction): Direction => {
  switch (dir) {
    case 'UP': return 'RIGHT';
    case 'RIGHT': return 'DOWN';
    case 'DOWN': return 'LEFT';
    case 'LEFT': return 'UP';
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  level: 1,
  gridSize: 5,
  grid: Array.from({ length: 5 }, () => Array(5).fill(null)),
  movesLeft: 10,
  maxMoves: 10,
  score: 0,
  streak: 1,
  stars: 0,
  timeRemaining: 120,
  isTimerRunning: true,
  isPaused: false,
  isSettingsOpen: false,
  hapticsEnabled: true,
  soundEnabled: true,
  isLevelComplete: false,
  isGameOver: false,
  laserPaths: [],
  poweredTileIds: [],
  powerUps: {
    shuffle: 3,
    blaster: 2,
    freeze: 3,
    preview: 3,
  },
  blasterActive: false,

  loadLevel: (levelNum: number) => {
    const levelDef = LEVELS.find((l) => l.levelNumber === levelNum) || LEVELS[0];
    const size = levelDef.gridSize;
    const newGrid: (TileData | null)[][] = Array.from({ length: size }, () =>
      Array(size).fill(null)
    );

    levelDef.tiles.forEach((t, index) => {
      newGrid[t.row][t.col] = {
        id: `tile-${levelNum}-${index}-${t.row}-${t.col}`,
        row: t.row,
        col: t.col,
        kind: t.kind,
        color: t.color,
        capacity: t.capacity,
        allowedDirections: [...t.allowedDirections],
        isActive: false,
        isLocked: t.isLocked ?? false,
      };
    });

    const evalResult = evaluateCircuit(newGrid, size);

    set({
      level: levelDef.levelNumber,
      gridSize: size,
      grid: newGrid,
      movesLeft: levelDef.maxMoves,
      maxMoves: levelDef.maxMoves,
      timeRemaining: levelDef.timeLimitSeconds ?? 120,
      isTimerRunning: true,
      isPaused: false,
      isLevelComplete: false, // Ensure game starts in active play state
      isGameOver: false,
      laserPaths: evalResult.laserPaths,
      poweredTileIds: Array.from(evalResult.poweredTileIds),
      blasterActive: false,
    });
  },

  moveTile: (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const { grid, gridSize, movesLeft, isLevelComplete, isGameOver, isPaused, streak, score } = get();
    if (isLevelComplete || isGameOver || isPaused || movesLeft <= 0) return false;

    // Bounds check
    if (toRow < 0 || toRow >= gridSize || toCol < 0 || toCol >= gridSize) return false;

    const source = grid[fromRow][fromCol];
    if (!source || source.isLocked) return false;

    const target = grid[toRow][toCol];

    // Create shallow copy of grid matrix
    const newGrid = grid.map((r) => [...r]);

    if (target === null) {
      // Move to empty slot
      newGrid[toRow][toCol] = { ...source, row: toRow, col: toCol };
      newGrid[fromRow][fromCol] = null;
    } else if (!target.isLocked) {
      // Swap with adjacent movable tile
      newGrid[toRow][toCol] = { ...source, row: toRow, col: toCol };
      newGrid[fromRow][fromCol] = { ...target, row: fromRow, col: fromCol };
    } else {
      return false;
    }

    const newMoves = movesLeft - 1;
    const evalResult = evaluateCircuit(newGrid, gridSize);

    let newScore = score;
    let newStreak = streak;
    let stars = 0;

    if (evalResult.isLevelComplete) {
      // Calculate reward: Remaining moves * streak bonus
      const bonus = newMoves * 250 * streak;
      newScore += 1000 + bonus;
      newStreak += 1;

      // Stars based on remaining moves
      if (newMoves >= 5) stars = 3;
      else if (newMoves >= 2) stars = 2;
      else stars = 1;
    }

    const gameOver = !evalResult.isLevelComplete && newMoves <= 0;

    set({
      grid: newGrid,
      movesLeft: newMoves,
      isLevelComplete: evalResult.isLevelComplete,
      isGameOver: gameOver,
      laserPaths: evalResult.laserPaths,
      poweredTileIds: Array.from(evalResult.poweredTileIds),
      score: newScore,
      streak: evalResult.isLevelComplete ? newStreak : streak,
      stars: evalResult.isLevelComplete ? stars : get().stars,
    });

    return true;
  },

  rotateTile: (row: number, col: number) => {
    const { grid, gridSize, movesLeft, isLevelComplete, isGameOver, isPaused, blasterActive } = get();
    if (isLevelComplete || isGameOver || isPaused || movesLeft <= 0 || blasterActive) return;

    const tile = grid[row][col];
    if (!tile || tile.isLocked || tile.kind !== 'CONDUIT') return;

    const newGrid = grid.map((r) => [...r]);
    const rotatedDirections = tile.allowedDirections.map(rotateDirectionClockwise);

    newGrid[row][col] = {
      ...tile,
      allowedDirections: rotatedDirections,
    };

    const newMoves = movesLeft - 1;
    const evalResult = evaluateCircuit(newGrid, gridSize);

    set({
      grid: newGrid,
      movesLeft: newMoves,
      isLevelComplete: evalResult.isLevelComplete,
      isGameOver: !evalResult.isLevelComplete && newMoves <= 0,
      laserPaths: evalResult.laserPaths,
      poweredTileIds: Array.from(evalResult.poweredTileIds),
    });
  },

  destroyTileAt: (row: number, col: number) => {
    const { grid, gridSize, blasterActive, powerUps } = get();
    if (!blasterActive) return;

    const tile = grid[row][col];
    if (!tile || tile.kind !== 'OBSTACLE') return;

    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = null;

    const evalResult = evaluateCircuit(newGrid, gridSize);

    set({
      grid: newGrid,
      blasterActive: false,
      powerUps: { ...powerUps, blaster: Math.max(0, powerUps.blaster - 1) },
      laserPaths: evalResult.laserPaths,
      poweredTileIds: Array.from(evalResult.poweredTileIds),
    });
  },

  activatePowerUp: (type: keyof PowerUpCounts) => {
    const { powerUps, grid, gridSize, timeRemaining, isPaused } = get();
    if (isPaused || powerUps[type] <= 0) return;

    if (type === 'shuffle') {
      // Gather all movable tiles
      const movableTiles: TileData[] = [];
      const movablePositions: { r: number; c: number }[] = [];

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const tile = grid[r][c];
          if (tile && !tile.isLocked) {
            movableTiles.push(tile);
            movablePositions.push({ r, c });
          }
        }
      }

      // Shuffle positions
      const shuffledPositions = [...movablePositions].sort(() => Math.random() - 0.5);
      const newGrid = grid.map((row) => [...row]);

      shuffledPositions.forEach((pos, index) => {
        const tile = movableTiles[index];
        newGrid[pos.r][pos.c] = { ...tile, row: pos.r, col: pos.c };
      });

      const evalResult = evaluateCircuit(newGrid, gridSize);
      set({
        grid: newGrid,
        powerUps: { ...powerUps, shuffle: powerUps.shuffle - 1 },
        laserPaths: evalResult.laserPaths,
        poweredTileIds: Array.from(evalResult.poweredTileIds),
      });
    } else if (type === 'blaster') {
      set({ blasterActive: true });
    } else if (type === 'freeze') {
      set({
        timeRemaining: timeRemaining + 15,
        powerUps: { ...powerUps, freeze: powerUps.freeze - 1 },
      });
    } else if (type === 'preview') {
      set({
        powerUps: { ...powerUps, preview: powerUps.preview - 1 },
      });
    }
  },

  tickTimer: () => {
    const { timeRemaining, isTimerRunning, isPaused, isLevelComplete, isGameOver } = get();
    if (!isTimerRunning || isPaused || isLevelComplete || isGameOver) return;

    if (timeRemaining <= 1) {
      set({ timeRemaining: 0, isGameOver: true, isTimerRunning: false });
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  restartLevel: () => {
    const { level, loadLevel } = get();
    loadLevel(level);
  },

  nextLevel: () => {
    const { level, loadLevel } = get();
    const nextLvl = level + 1;
    loadLevel(nextLvl <= LEVELS.length ? nextLvl : 1);
  },

  setPaused: (paused: boolean) => set({ isPaused: paused }),
  setSettingsOpen: (open: boolean) => set({ isSettingsOpen: open }),
  toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));

