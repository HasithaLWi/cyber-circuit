import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../../store/useGameStore';
import { COLORS } from '../../constants/theme';

export const PowerUpTray: React.FC = () => {
  const { powerUps, blasterActive, activatePowerUp } = useGameStore();

  const handlePress = (type: keyof typeof powerUps) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    activatePowerUp(type);
  };

  return (
    <View style={styles.container}>
      {/* 1. Shuffle */}
      <Pressable
        style={[styles.button, powerUps.shuffle <= 0 && styles.disabledButton]}
        disabled={powerUps.shuffle <= 0}
        onPress={() => handlePress('shuffle')}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{powerUps.shuffle}</Text>
        </View>
        <Text style={styles.icon}>⚡</Text>
        <Text style={styles.label}>Shuffle</Text>
      </Pressable>

      {/* 2. Blaster */}
      <Pressable
        style={[
          styles.button,
          blasterActive && styles.activeButton,
          powerUps.blaster <= 0 && styles.disabledButton,
        ]}
        disabled={powerUps.blaster <= 0}
        onPress={() => handlePress('blaster')}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{powerUps.blaster}</Text>
        </View>
        <Text style={[styles.icon, blasterActive && styles.activeIcon]}>💥</Text>
        <Text style={[styles.label, blasterActive && styles.activeLabel]}>
          {blasterActive ? 'Targeting' : 'Blaster'}
        </Text>
      </Pressable>

      {/* 3. Time Freeze */}
      <Pressable
        style={[styles.button, powerUps.freeze <= 0 && styles.disabledButton]}
        disabled={powerUps.freeze <= 0}
        onPress={() => handlePress('freeze')}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{powerUps.freeze}</Text>
        </View>
        <Text style={styles.icon}>⏳</Text>
        <Text style={styles.label}>Freeze</Text>
      </Pressable>

      {/* 4. Preview / Hint */}
      <Pressable
        style={[styles.button, powerUps.preview <= 0 && styles.disabledButton]}
        disabled={powerUps.preview <= 0}
        onPress={() => handlePress('preview')}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{powerUps.preview}</Text>
        </View>
        <Text style={styles.icon}>👁</Text>
        <Text style={styles.label}>Preview</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F1624',
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#162032',
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#26354D',
    position: 'relative',
  },
  activeButton: {
    borderColor: '#F43F5E',
    backgroundColor: '#381622',
  },
  disabledButton: {
    opacity: 0.4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 6,
    backgroundColor: '#0B0F19',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00F2FE',
  },
  icon: {
    fontSize: 20,
    color: '#00F2FE',
    marginBottom: 3,
  },
  activeIcon: {
    color: '#F43F5E',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  activeLabel: {
    color: '#F43F5E',
  },
});

