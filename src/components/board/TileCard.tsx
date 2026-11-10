import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { TileData } from '../../types/game';
import { COLOR_MAP, GLOW_MAP, COLORS } from '../../constants/theme';
import { useGameStore } from '../../store/useGameStore';

interface TileCardProps {
  tile: TileData | null;
  row: number;
  col: number;
  size: number;
}

export const TileCard: React.FC<TileCardProps> = ({ tile, row, col, size }) => {
  const {
    moveTile,
    rotateTile,
    destroyTileAt,
    blasterActive,
    poweredTileIds,
    hapticsEnabled,
  } = useGameStore();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(1);

  const isPowered = tile ? poweredTileIds.includes(tile.id) : false;

  // Handle Swipe/Slide
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (!tile || tile.isLocked) return;
      translateX.value = e.translationX * 0.4;
      translateY.value = e.translationY * 0.4;
    })
    .onEnd((e) => {
      if (!tile || tile.isLocked) return;

      const threshold = 25;
      let targetRow = row;
      let targetCol = col;

      if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
        if (e.translationX > threshold) targetCol = col + 1;
        else if (e.translationX < -threshold) targetCol = col - 1;
      } else {
        if (e.translationY > threshold) targetRow = row + 1;
        else if (e.translationY < -threshold) targetRow = row - 1;
      }

      if (targetRow !== row || targetCol !== col) {
        if (hapticsEnabled) {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
        runOnJS(moveTile)(row, col, targetRow, targetCol);
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  // Handle Tap (Rotate conduit or Blast obstacle)
  const tapGesture = Gesture.Tap().onEnd(() => {
    if (!tile) return;

    if (blasterActive && tile.kind === 'OBSTACLE') {
      if (hapticsEnabled) {
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
      }
      runOnJS(destroyTileAt)(row, col);
    } else if (tile.kind === 'CONDUIT' && !tile.isLocked) {
      if (hapticsEnabled) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
      runOnJS(rotateTile)(row, col);
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  // Render empty slot
  if (!tile) {
    return (
      <View
        style={[
          styles.slotBase,
          { width: size - 4, height: size - 4, margin: 2 },
        ]}
      />
    );
  }

  const tileColor = tile.color ? COLOR_MAP[tile.color] : COLORS.cyan;
  const tileGlow = tile.color ? GLOW_MAP[tile.color] : COLORS.cyanGlow;

  // Render Directional arrows on conduit
  const renderDirections = () => {
    const arrows: string[] = [];
    if (tile.allowedDirections.includes('UP')) arrows.push('▲');
    if (tile.allowedDirections.includes('DOWN')) arrows.push('▼');
    if (tile.allowedDirections.includes('LEFT')) arrows.push('◄');
    if (tile.allowedDirections.includes('RIGHT')) arrows.push('►');

    return (
      <View style={styles.arrowContainer}>
        <Text style={[styles.arrowText, { color: tileColor }]}>
          {arrows.join(' ')}
        </Text>
      </View>
    );
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.tileBase,
          {
            width: size - 4,
            height: size - 4,
            margin: 2,
            borderColor: isPowered ? tileColor : '#223049',
          },
          isPowered && {
            shadowColor: tileColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 8,
          },
          animatedStyle,
        ]}
      >
        {/* 1. EMITTER */}
        {tile.kind === 'EMITTER' && (
          <View style={[styles.nodeContent, { borderColor: tileColor }]}>
            <View style={[styles.emitterCore, { backgroundColor: tileColor }]} />
            <Text style={[styles.kindLabel, { color: tileColor }]}>SOURCE</Text>
            {renderDirections()}
          </View>
        )}

        {/* 2. CAPACITOR (TARGET) */}
        {tile.kind === 'CAPACITOR' && (
          <View
            style={[
              styles.nodeContent,
              styles.capacitorNode,
              { borderColor: isPowered ? tileColor : '#334155' },
              isPowered && { backgroundColor: tileGlow },
            ]}
          >
            <Text style={[styles.capacitorIcon, { color: tileColor }]}>⚡</Text>
            <Text style={[styles.kindLabel, { color: tileColor }]}>
              {isPowered ? 'ACTIVE' : 'CORE'}
            </Text>
          </View>
        )}

        {/* 3. CONDUIT */}
        {tile.kind === 'CONDUIT' && (
          <View style={styles.conduitContent}>
            {tile.capacity ? (
              <Text
                style={[
                  styles.capacityText,
                  { color: isPowered ? tileColor : '#CBD5E1' },
                ]}
              >
                {tile.capacity}
              </Text>
            ) : null}
            {renderDirections()}
          </View>
        )}

        {/* 4. OBSTACLE */}
        {tile.kind === 'OBSTACLE' && (
          <View
            style={[
              styles.obstacleContent,
              blasterActive && styles.obstacleTargeted,
            ]}
          >
            <View style={styles.hazardStripe} />
            <Text style={styles.obstacleIcon}>✕</Text>
            <View style={styles.hazardStripe} />
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  slotBase: {
    backgroundColor: '#0F1624',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#192336',
  },
  tileBase: {
    backgroundColor: '#151F31',
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  nodeContent: {
    width: '88%',
    height: '88%',
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0F1A',
  },
  emitterCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginBottom: 4,
  },
  capacitorNode: {
    borderRadius: 12,
  },
  capacitorIcon: {
    fontSize: 22,
    fontWeight: '900',
  },
  kindLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  conduitContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  capacityText: {
    fontSize: 22,
    fontWeight: '900',
  },
  arrowContainer: {
    marginTop: 2,
  },
  arrowText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  obstacleContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E1B18',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#422006',
  },
  obstacleTargeted: {
    borderColor: '#F43F5E',
    borderWidth: 2,
  },
  obstacleIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D97706',
    marginVertical: 2,
  },
  hazardStripe: {
    width: '80%',
    height: 3,
    backgroundColor: '#D97706',
    borderRadius: 2,
  },
});

