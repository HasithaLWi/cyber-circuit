import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../../store/useGameStore';
import { COLORS } from '../../constants/theme';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setSettingsOpen,
    hapticsEnabled,
    soundEnabled,
    toggleHaptics,
    toggleSound,
  } = useGameStore();

  if (!isSettingsOpen) return null;

  const handleClose = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSettingsOpen(false);
  };

  return (
    <Modal transparent animationType="slide" visible={isSettingsOpen}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>CYBER SYSTEM</Text>
          <Text style={styles.subtitle}>Settings & Tactical Manual</Text>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Audio & Haptic Toggles */}
            <Text style={styles.sectionHeader}>HARDWARE CONFIG</Text>
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

            {/* How to Play Guide */}
            <Text style={styles.sectionHeader}>HOW TO PLAY</Text>

            <View style={styles.guideItem}>
              <Text style={styles.guideBadge}>1</Text>
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>Connect The Grid</Text>
                <Text style={styles.guideDesc}>
                  Route colored laser energy from <Text style={{ color: COLORS.cyan }}>SOURCE</Text> emitters into matching <Text style={{ color: COLORS.amber }}>CORE</Text> capacitors.
                </Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <Text style={styles.guideBadge}>2</Text>
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>Swipe To Slide</Text>
                <Text style={styles.guideDesc}>
                  Drag or swipe tiles to shift them into adjacent empty slots or swap positions with loose tiles.
                </Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <Text style={styles.guideBadge}>3</Text>
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>Tap To Rotate</Text>
                <Text style={styles.guideDesc}>
                  Tap any conduit tile to rotate its directional laser channels 90° clockwise.
                </Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <Text style={styles.guideBadge}>4</Text>
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>Power-Up Arsenal</Text>
                <Text style={styles.guideDesc}>
                  ⚡ <Text style={{ color: COLORS.cyan }}>Shuffle:</Text> Jumble movable tiles.{'\n'}
                  💥 <Text style={{ color: '#F43F5E' }}>Blaster:</Text> Tap Blaster, then tap any metal obstacle to destroy it.{'\n'}
                  ⏳ <Text style={{ color: COLORS.amber }}>Freeze:</Text> Gain +15 bonus seconds.{'\n'}
                  👁 <Text style={{ color: COLORS.emerald }}>Preview:</Text> Reveal tactical guidance.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>CLOSE MANUAL</Text>
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
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#0F1626',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#00F2FE',
    padding: 20,
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
    marginBottom: 16,
  },
  scrollArea: {
    width: '100%',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#00F2FE',
    letterSpacing: 1.5,
    marginVertical: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 10,
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
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#131B2B',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1F2C45',
  },
  guideBadge: {
    backgroundColor: '#00F2FE',
    color: '#0A0E17',
    fontWeight: '900',
    fontSize: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: 22,
    marginRight: 10,
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 2,
  },
  guideDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
  closeButton: {
    width: '100%',
    backgroundColor: '#00F2FE',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeText: {
    color: '#0A0E17',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});

