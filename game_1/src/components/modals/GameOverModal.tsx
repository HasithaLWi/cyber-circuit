import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../../store/useGameStore';

export const GameOverModal: React.FC = () => {
  const { isGameOver, isLevelComplete, restartLevel } = useGameStore();

  if (!isGameOver || isLevelComplete) return null;

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    restartLevel();
  };

  return (
    <Modal transparent animationType="fade" visible={isGameOver && !isLevelComplete}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>CIRCUIT OVERLOAD</Text>
          <Text style={styles.subtitle}>You ran out of energy steps!</Text>

          <View style={styles.iconContainer}>
            <Text style={styles.failIcon}>⚡</Text>
          </View>

          <Pressable style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>↺ Try Again</Text>
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
    backgroundColor: '#160F16',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F43F5E',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F43F5E',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  iconContainer: {
    marginVertical: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2A111A',
    borderWidth: 1.5,
    borderColor: '#F43F5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  failIcon: {
    fontSize: 32,
    color: '#F43F5E',
  },
  retryButton: {
    width: '100%',
    backgroundColor: '#F43F5E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

