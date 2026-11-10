import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Line, Circle, BlurMask, vec } from '@shopify/react-native-skia';
import { LaserPath } from '../../types/game';
import { COLOR_MAP } from '../../constants/theme';

interface LaserSkiaOverlayProps {
  boardSize: number;
  gridSize: number;
  laserPaths: LaserPath[];
}

export const LaserSkiaOverlay: React.FC<LaserSkiaOverlayProps> = ({
  boardSize,
  gridSize,
  laserPaths,
}) => {
  const cellSize = boardSize / gridSize;

  return (
    <View style={[StyleSheet.absoluteFill, styles.pointerEventsNone]}>
      <Canvas style={{ width: boardSize, height: boardSize }}>
        {laserPaths.map((path) => {
          const x1 = path.fromCol * cellSize + cellSize / 2;
          const y1 = path.fromRow * cellSize + cellSize / 2;
          const x2 = path.toCol * cellSize + cellSize / 2;
          const y2 = path.toRow * cellSize + cellSize / 2;

          const colorHex = COLOR_MAP[path.color] || '#00F2FE';

          return (
            <React.Fragment key={path.id}>
              {/* Layer 1: Soft Outer Neon Bloom */}
              <Line
                p1={vec(x1, y1)}
                p2={vec(x2, y2)}
                color={colorHex}
                strokeWidth={10}
                style="stroke"
              >
                <BlurMask blur={8} style="solid" />
              </Line>

              {/* Layer 2: Vivid Color Beam */}
              <Line
                p1={vec(x1, y1)}
                p2={vec(x2, y2)}
                color={colorHex}
                strokeWidth={4}
                style="stroke"
              />

              {/* Layer 3: Hot White Laser Core */}
              <Line
                p1={vec(x1, y1)}
                p2={vec(x2, y2)}
                color="#FFFFFF"
                strokeWidth={2}
                style="stroke"
              />

              {/* Target Impact Spark Glow */}
              <Circle cx={x2} cy={y2} r={12} color={colorHex}>
                <BlurMask blur={6} style="solid" />
              </Circle>
              <Circle cx={x2} cy={y2} r={4} color="#FFFFFF" />
            </React.Fragment>
          );
        })}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  pointerEventsNone: {
    pointerEvents: 'none',
  },
});

