import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../../store/useGameStore';
import { COLORS } from '../../constants/theme';

export const PauseModal: React.FC = () => {
  const {
    isPaused,
    level,
    movesLeft,
    setPaused,
    restartLevel,
    hapticsEnabled,
    soundEnabled,
    toggleHaptics,
    toggleSound,
  } = useGameStore();

  if (!isPaused) return null;

  const handleResume = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPaused(false);
  };

  const handleRestart = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    restartLevel();
    setPaused(false);
  };

  return (
    <Modal transparent animationType="fade" visible={isPaused}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>SYSTEM PAUSED</Text>
          <Text style={styles.subtitle}>Level {level} • {movesLeft} Moves Left</Text>

          {/* Quick Toggles */}
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggleBtn, soundEnabled && styles.toggleActive]}
              onPress={toggleSound}
            >
              <Text style={styles.toggleIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
              <Text style={styles.toggleLabel}>Audio {soundEnabled ? 'ON' : 'OFF'}</Text>
            </Pressable>

            <Pressable
              style={[styles.toggleBtn, hapticsEnabled && styles.toggleActive]}
              onPress={toggleHaptics}
            >
              <Text style={styles.toggleIcon}>{hapticsEnabled ? '📳' : '📴'}</Text>
              <Text style={styles.toggleLabel}>Haptics {hapticsEnabled ? 'ON' : 'OFF'}</Text>
            </Pressable>
          </View>

          {/* Primary Buttons */}
          <Pressable style={styles.resumeButton} onPress={handleResume}>
            <Text style={styles.resumeText}>▶ RESUME MATRIX</Text>
          </Pressable>

          <Pressable style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartText}>↺ Restart Level</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 15, 0.88)',
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
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#00F2FE',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#162033',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#253550',
  },
  toggleActive: {
    borderColor: '#00F2FE',
  },
  toggleIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  toggleLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  resumeButton: {
    width: '100%',
    backgroundColor: '#00F2FE',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  resumeText: {
    color: '#0A0E17',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
  restartButton: {
    width: '100%',
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  restartText: {
    color: '#94A3B8',
    fontWeight: '800',
    fontSize: 13,
  },
});

