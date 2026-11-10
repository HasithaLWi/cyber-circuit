import { TileData, Direction, ColorCode, LaserPath } from '../types/game';

export function getOppositeDirection(dir: Direction): Direction {
  switch (dir) {
    case 'UP':
      return 'DOWN';
    case 'DOWN':
      return 'UP';
    case 'LEFT':
      return 'RIGHT';
    case 'RIGHT':
      return 'LEFT';
  }
}

export function getNextCoordinates(
  row: number,
  col: number,
  dir: Direction
): { nextRow: number; nextCol: number } {
  switch (dir) {
    case 'UP':
      return { nextRow: row - 1, nextCol: col };
    case 'DOWN':
      return { nextRow: row + 1, nextCol: col };
    case 'LEFT':
      return { nextRow: row, nextCol: col - 1 };
    case 'RIGHT':
      return { nextRow: row, nextCol: col + 1 };
  }
}

export interface CircuitResult {
  poweredTileIds: Set<string>;
  laserPaths: LaserPath[];
  isLevelComplete: boolean;
}

export function evaluateCircuit(
  grid: (TileData | null)[][],
  gridSize: number = 5
): CircuitResult {
  const poweredTileIds = new Set<string>();
  const laserPaths: LaserPath[] = [];

  // Find all emitters and capacitors
  const emitters: TileData[] = [];
  const capacitors: TileData[] = [];

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const tile = grid[r][c];
      if (!tile) continue;
      if (tile.kind === 'EMITTER') {
        emitters.push(tile);
      } else if (tile.kind === 'CAPACITOR') {
        capacitors.push(tile);
      }
    }
  }

  // Queue item for BFS traversal
  interface BeamSegment {
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
    dir: Direction;
    color: ColorCode;
  }

  const queue: BeamSegment[] = [];

  // Seed BFS with emitter beams
  emitters.forEach((emitter) => {
    poweredTileIds.add(emitter.id);
    if (!emitter.color) return;

    emitter.allowedDirections.forEach((dir) => {
      const { nextRow, nextCol } = getNextCoordinates(emitter.row, emitter.col, dir);
      queue.push({
        fromRow: emitter.row,
        fromCol: emitter.col,
        toRow: nextRow,
        toCol: nextCol,
        dir,
        color: emitter.color!,
      });
    });
  });

  const visitedBeams = new Set<string>();

  while (queue.length > 0) {
    const beam = queue.shift()!;
    const beamKey = `${beam.fromRow},${beam.fromCol}->${beam.toRow},${beam.toCol}-${beam.color}`;
    if (visitedBeams.has(beamKey)) continue;
    visitedBeams.add(beamKey);

    // Bounds check
    if (
      beam.toRow < 0 ||
      beam.toRow >= gridSize ||
      beam.toCol < 0 ||
      beam.toCol >= gridSize
    ) {
      continue;
    }

    const targetTile = grid[beam.toRow][beam.toCol];
    if (!targetTile || targetTile.kind === 'EMPTY' || targetTile.kind === 'OBSTACLE') {
      continue;
    }

    // Check if targetTile accepts entry from this direction
    const entryDir = getOppositeDirection(beam.dir);
    const canAccept =
      targetTile.allowedDirections.includes(entryDir) ||
      targetTile.kind === 'CAPACITOR';

    // Check color matching (matching color or untyped conduit)
    const colorMatches = !targetTile.color || targetTile.color === beam.color;

    if (canAccept && colorMatches) {
      poweredTileIds.add(targetTile.id);

      laserPaths.push({
        id: `laser-${beam.fromRow}_${beam.fromCol}-${beam.toRow}_${beam.toCol}`,
        fromRow: beam.fromRow,
        fromCol: beam.fromCol,
        toRow: beam.toRow,
        toCol: beam.toCol,
        color: beam.color,
      });

      // If it's a conduit, route laser through its other exit directions
      if (targetTile.kind === 'CONDUIT') {
        targetTile.allowedDirections.forEach((exitDir) => {
          if (exitDir !== entryDir) {
            const { nextRow, nextCol } = getNextCoordinates(
              targetTile.row,
              targetTile.col,
              exitDir
            );
            queue.push({
              fromRow: targetTile.row,
              fromCol: targetTile.col,
              toRow: nextRow,
              toCol: nextCol,
              dir: exitDir,
              color: beam.color,
            });
          }
        });
      }
    }
  }

  // Check if all capacitors are powered
  const isLevelComplete =
    capacitors.length > 0 &&
    capacitors.every((cap) => poweredTileIds.has(cap.id));

  return {
    poweredTileIds,
    laserPaths,
    isLevelComplete,
  };
}

