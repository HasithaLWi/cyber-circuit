import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { TileCard } from './TileCard';
import { LaserSkiaOverlay } from './LaserSkiaOverlay';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width * 0.92, 400);

export const GameBoard: React.FC = () => {
  const { grid, gridSize, laserPaths } = useGameStore();
  const cellSize = BOARD_SIZE / gridSize;

  return (
    <View style={[styles.outerFrame, { width: BOARD_SIZE + 12, height: BOARD_SIZE + 12 }]}>
      <View style={[styles.boardContainer, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
        {/* The 5x5 Grid Rows & Columns */}
        {grid.map((rowItems, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {rowItems.map((tile, colIndex) => (
              <TileCard
                key={tile ? tile.id : `slot-${rowIndex}-${colIndex}`}
                tile={tile}
                row={rowIndex}
                col={colIndex}
                size={cellSize}
              />
            ))}
          </View>
        ))}

        {/* Laser & Particle FX Skia Overlay */}
        <LaserSkiaOverlay
          boardSize={BOARD_SIZE}
          gridSize={gridSize}
          laserPaths={laserPaths}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerFrame: {
    backgroundColor: '#0A0F1A',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#1E2D4A',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  boardContainer: {
    backgroundColor: '#0A0E17',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});

