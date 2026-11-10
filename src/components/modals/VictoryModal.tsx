import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../../store/useGameStore';
import { COLORS } from '../../constants/theme';

export const VictoryModal: React.FC = () => {
  const { isLevelComplete, stars, score, streak, nextLevel, restartLevel } =
    useGameStore();

  if (!isLevelComplete) return null;

  const handleNext = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    nextLevel();
  };

  const handleReplay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    restartLevel();
  };

  return (
    <Modal transparent animationType="fade" visible={isLevelComplete}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>CIRCUIT ONLINE!</Text>
          <Text style={styles.subtitle}>All Capacitors Fully Charged</Text>

          {/* Stars */}
          <View style={styles.starRow}>
            <Text style={[styles.star, stars >= 1 && styles.starActive]}>★</Text>
            <Text style={[styles.star, stars >= 2 && styles.starActive]}>★</Text>
            <Text style={[styles.star, stars >= 3 && styles.starActive]}>★</Text>
          </View>

          {/* Score Stats */}
          <View style={styles.statBox}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>TOTAL SCORE</Text>
              <Text style={styles.statVal}>{score.toLocaleString()}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>CURRENT STREAK</Text>
              <Text style={[styles.statVal, { color: '#10B981' }]}>x{streak}</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.secondaryButton} onPress={handleReplay}>
              <Text style={styles.secondaryText}>↺ Replay</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.primaryText}>Next Level ➔</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 15, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#0F1626',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#00F2FE',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#00F2FE',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 18,
  },
  star: {
    fontSize: 36,
    color: '#1E293B',
  },
  starActive: {
    color: '#F59E0B',
  },
  statBox: {
    width: '100%',
    backgroundColor: '#162033',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#253550',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#CBD5E1',
    fontWeight: '800',
    fontSize: 14,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: '#00F2FE',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: '#0A0E17',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

