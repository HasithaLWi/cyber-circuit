export type ColorCode = 'cyan' | 'magenta' | 'amber';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type TileKind =
  | 'EMPTY'
  | 'EMITTER'       // Generates laser beam
  | 'CONDUIT'       // Routes laser (arrows, turns, lines)
  | 'CAPACITOR'     // Target core node
  | 'OBSTACLE';     // Non-conductive metal hazard plate

export interface LaserPath {
  id: string;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  color: ColorCode;
}

export interface TileData {
  id: string;
  row: number;
  col: number;
  kind: TileKind;
  color?: ColorCode;
  capacity?: number;               // Number displayed (e.g., 2, 3, 4)
  allowedDirections: Direction[];  // Connection endpoints
  isActive: boolean;               // Currently powered by laser
  isLocked?: boolean;              // Cannot be moved/swapped
}

export interface PowerUpCounts {
  shuffle: number;
  blaster: number;
  freeze: number;
  preview: number;
}

export interface LevelDefinition {
  levelNumber: number;
  maxMoves: number;
  gridSize: number; // typically 5
  timeLimitSeconds?: number;
  tiles: {
    row: number;
    col: number;
    kind: TileKind;
    color?: ColorCode;
    capacity?: number;
    allowedDirections: Direction[];
    isLocked?: boolean;
  }[];
}

