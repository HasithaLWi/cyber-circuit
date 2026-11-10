import { LevelDefinition } from '../types/game';

export const LEVELS: LevelDefinition[] = [
  // =========================================================================
  // Level 1: "First Spark" (Tutorial: Slide conduit UP to bridge the circuit)
  // =========================================================================
  {
    levelNumber: 1,
    maxMoves: 10,
    gridSize: 5,
    timeLimitSeconds: 120,
    tiles: [
      // Emitter on the left (Row 1, Col 1), shooting RIGHT
      {
        row: 1,
        col: 1,
        kind: 'EMITTER',
        color: 'cyan',
        allowedDirections: ['RIGHT'],
        isLocked: true,
      },
      // Target Capacitor on the right (Row 1, Col 3), accepting from LEFT
      {
        row: 1,
        col: 3,
        kind: 'CAPACITOR',
        color: 'cyan',
        allowedDirections: ['LEFT'],
        isLocked: true,
      },
      // Movable Cyan Conduit placed below at (2, 2)
      // Solution: Swipe UP into (1, 2) to complete the horizontal laser bridge!
      {
        row: 2,
        col: 2,
        kind: 'CONDUIT',
        color: 'cyan',
        capacity: 2,
        allowedDirections: ['LEFT', 'RIGHT'],
      },
      // Decoy tile at (3, 2)
      {
        row: 3,
        col: 2,
        kind: 'CONDUIT',
        color: 'cyan',
        capacity: 3,
        allowedDirections: ['UP', 'DOWN'],
      },
      {
        row: 2,
        col: 4,
        kind: 'OBSTACLE',
        allowedDirections: [],
        isLocked: false,
      },
    ],
  },

  // =========================================================================
  // Level 2: "Corner Vector" (Tutorial: Tap to Rotate Conduit 90°)
  // =========================================================================
  {
    levelNumber: 2,
    maxMoves: 12,
    gridSize: 5,
    timeLimitSeconds: 90,
    tiles: [
      // Magenta Emitter at (1, 1), shooting DOWN
      {
        row: 1,
        col: 1,
        kind: 'EMITTER',
        color: 'magenta',
        allowedDirections: ['DOWN'],
        isLocked: true,
      },
      // Target Capacitor at (2, 2), accepting from LEFT
      {
        row: 2,
        col: 2,
        kind: 'CAPACITOR',
        color: 'magenta',
        allowedDirections: ['LEFT'],
        isLocked: true,
      },
      // Corner conduit placed right at intersection (2, 1)
      // Currently pointing ['DOWN', 'LEFT']
      // Solution: TAP it twice to rotate to ['UP', 'RIGHT'] to connect (1, 1) -> (2, 1) -> (2, 2)!
      {
        row: 2,
        col: 1,
        kind: 'CONDUIT',
        color: 'magenta',
        capacity: 3,
        allowedDirections: ['DOWN', 'LEFT'],
      },
      // Movable extra conduit at (3, 1)
      {
        row: 3,
        col: 1,
        kind: 'CONDUIT',
        color: 'magenta',
        capacity: 2,
        allowedDirections: ['UP', 'DOWN'],
      },
      // Obstacle at (1, 3)
      {
        row: 1,
        col: 3,
        kind: 'OBSTACLE',
        allowedDirections: [],
        isLocked: false,
      },
    ],
  },

  // =========================================================================
  // Level 3: "S-Curve Circuit" (Slide + Rotate around an obstacle)
  // =========================================================================
  {
    levelNumber: 3,
    maxMoves: 15,
    gridSize: 5,
    timeLimitSeconds: 90,
    tiles: [
      // Cyan Emitter at (1, 0), shooting RIGHT
      {
        row: 1,
        col: 0,
        kind: 'EMITTER',
        color: 'cyan',
        allowedDirections: ['RIGHT'],
        isLocked: true,
      },
      // Obstacle directly blocking (1, 2)
      {
        row: 1,
        col: 2,
        kind: 'OBSTACLE',
        allowedDirections: [],
        isLocked: false,
      },
      // Target Capacitor at (2, 2), accepting from LEFT
      {
        row: 2,
        col: 2,
        kind: 'CAPACITOR',
        color: 'cyan',
        allowedDirections: ['LEFT'],
        isLocked: true,
      },
      // First corner conduit at (1, 1) - starts with ['UP', 'RIGHT'], tap twice to rotate to ['LEFT', 'DOWN']
      {
        row: 1,
        col: 1,
        kind: 'CONDUIT',
        color: 'cyan',
        capacity: 3,
        allowedDirections: ['UP', 'RIGHT'],
      },
      // Second corner conduit at (3, 1) - starts with ['UP', 'RIGHT'], swipe UP to (2, 1)
      {
        row: 3,
        col: 1,
        kind: 'CONDUIT',
        color: 'cyan',
        capacity: 2,
        allowedDirections: ['UP', 'RIGHT'],
      },
    ],
  },

  // =========================================================================
  // Level 4: "Dual Matrix" (Two Simultaneous Laser Circuits: Cyan & Amber)
  // =========================================================================
  {
    levelNumber: 4,
    maxMoves: 20,
    gridSize: 5,
    timeLimitSeconds: 90,
    tiles: [
      // --- Cyan Stream (Top Row) ---
      {
        row: 0,
        col: 1,
        kind: 'EMITTER',
        color: 'cyan',
        allowedDirections: ['RIGHT'],
        isLocked: true,
      },
      {
        row: 0,
        col: 3,
        kind: 'CAPACITOR',
        color: 'cyan',
        allowedDirections: ['LEFT'],
        isLocked: true,
      },
      // Cyan bridge tile at (1, 2) - swipe UP to (0, 2)
      {
        row: 1,
        col: 2,
        kind: 'CONDUIT',
        color: 'cyan',
        capacity: 2,
        allowedDirections: ['LEFT', 'RIGHT'],
      },

      // --- Amber Stream (Bottom Row) ---
      {
        row: 2,
        col: 1,
        kind: 'EMITTER',
        color: 'amber',
        allowedDirections: ['RIGHT'],
        isLocked: true,
      },
      {
        row: 2,
        col: 3,
        kind: 'CAPACITOR',
        color: 'amber',
        allowedDirections: ['LEFT'],
        isLocked: true,
      },
      // Amber bridge tile at (3, 2) - swipe UP to (2, 2)
      {
        row: 3,
        col: 2,
        kind: 'CONDUIT',
        color: 'amber',
        capacity: 2,
        allowedDirections: ['LEFT', 'RIGHT'],
      },

      // Hazard Obstacles
      {
        row: 1,
        col: 1,
        kind: 'OBSTACLE',
        allowedDirections: [],
        isLocked: false,
      },
      {
        row: 3,
        col: 3,
        kind: 'OBSTACLE',
        allowedDirections: [],
        isLocked: false,
      },
    ],
  },

  // =========================================================================
  // Level 5: "The Cyber Core" (Mathematically Verified Dual Routing)
  // =========================================================================
  {
    levelNumber: 5,
    maxMoves: 25,
    gridSize: 5,
    timeLimitSeconds: 90,
    tiles: [
      // --- Cyan Stream (Top-Left) ---
      // Emitter at (0, 0), shoots RIGHT
      {
        row: 0,
        col: 0,
        kind: 'EMITTER',
        color: 'cyan',
        allowedDirections: ['RIGHT'],
        isLocked: true,
      },
      // Corner conduit at (0, 1) - starts as ['UP', 'RIGHT'], tap twice to become ['DOWN', 'LEFT']
      {
        row: 0,
        col: 1,
        kind: 'CONDUIT',
        color: 'cyan',
        capacity: 4,
        allowedDirections: ['UP', 'RIGHT'],
      },
      // Cyan Target Capacitor at (1, 1), accepts UP
      {
        row: 1,
        col: 1,
        kind: 'CAPACITOR',
        color: 'cyan',
        allowedDirections: ['UP'],
        isLocked: true,
      },

      // --- Amber Stream (Bottom-Right) ---
      // Amber Emitter at (3, 4), shoots LEFT
      {
        row: 3,
        col: 4,
        kind: 'EMITTER',
        color: 'amber',
        allowedDirections: ['LEFT'],
        isLocked: true,
      },
      // Corner conduit 1 at (3, 3) - starts as ['LEFT', 'DOWN'], tap twice to become ['RIGHT', 'UP']
      {
        row: 3,
        col: 3,
        kind: 'CONDUIT',
        color: 'amber',
        capacity: 3,
        allowedDirections: ['LEFT', 'DOWN'],
      },
      // Corner conduit 2 at (2, 3) - starts as ['UP', 'RIGHT'], tap twice to become ['DOWN', 'LEFT']
      {
        row: 2,
        col: 3,
        kind: 'CONDUIT',
        color: 'amber',
        capacity: 2,
        allowedDirections: ['UP', 'RIGHT'],
      },
      // Amber Target Capacitor at (2, 2), accepts RIGHT
      {
        row: 2,
        col: 2,
        kind: 'CAPACITOR',
        color: 'amber',
        allowedDirections: ['RIGHT'],
        isLocked: true,
      },

      // Hazard Obstacles (Placed out of the way)
      {
        row: 3,
        col: 1,
        kind: 'OBSTACLE',
        allowedDirections: [],
        isLocked: false,
      },
      {
        row: 0,
        col: 4,
        kind: 'OBSTACLE',
        allowedDirections: [],
        isLocked: false,
      },
    ],
  },

  // =========================================================================
  // Level 6: "Laser Splitter" (1 Emitter -> T-Junction -> 2 Capacitors)
  // =========================================================================
  {
    levelNumber: 6,
    maxMoves: 15,
    gridSize: 5,
    timeLimitSeconds: 90,
    tiles: [
      // Magenta Emitter at (2, 0), shoots RIGHT
      {
        row: 2,
        col: 0,
        kind: 'EMITTER',
        color: 'magenta',
        allowedDirections: ['RIGHT'],
        isLocked: true,
      },
      // T-Junction Conduit at (2, 1) - routes laser to BOTH (1, 1) and (3, 1)!
      // Starts as ['LEFT', 'RIGHT', 'UP'], tap 3 times to become ['LEFT', 'UP', 'DOWN']
      {
        row: 2,
        col: 1,
        kind: 'CONDUIT',
        color: 'magenta',
        capacity: 4,
        allowedDirections: ['LEFT', 'RIGHT', 'UP'],
      },
      // Top Capacitor at (1, 1), accepts DOWN
      {
        row: 1,
        col: 1,
        kind: 'CAPACITOR',
        color: 'magenta',
        allowedDirections: ['DOWN'],
        isLocked: true,
      },
      // Bottom Capacitor at (3, 1), accepts UP
      {
        row: 3,
        col: 1,
        kind: 'CAPACITOR',
        color: 'magenta',
        allowedDirections: ['UP'],
        isLocked: true,
      },
      // Obstacle at (2, 2)
      {
        row: 2,
        col: 2,
        kind: 'OBSTACLE',
        allowedDirections: [],
        isLocked: false,
      },
    ],
  },
];
