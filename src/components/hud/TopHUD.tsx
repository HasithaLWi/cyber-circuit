import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { COLORS } from "../../constants/theme";
import { useGameStore } from "../../store/useGameStore";

interface TopHUDProps {
  onPause?: () => void;
  onSettings?: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({ onPause, onSettings }) => {
  const {
    score,
    level,
    movesLeft,
    maxMoves,
    streak,
    stars,
    timeRemaining,
    restartLevel,
    setPaused,
    setSettingsOpen,
  } = useGameStore();

  const handleSettings = () => {
    if (onSettings) onSettings();
    else setSettingsOpen(true);
  };

  const handlePause = () => {
    if (onPause) onPause();
    else setPaused(true);
  };

  const movesRatio = Math.max(0, Math.min(1, movesLeft / (maxMoves || 1)));

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* Top Utility Row */}
      <View style={styles.utilityRow}>
        <View style={styles.utilityLeft}>
          <Pressable style={styles.iconButton} onPress={handleSettings}>
            <Text style={styles.iconText}>⚙</Text>
            <Text style={styles.iconLabel}>Settings</Text>
          </Pressable>
          <Pressable style={styles.iconButton} onPress={restartLevel}>
            <Text style={styles.iconText}>↺</Text>
            <Text style={styles.iconLabel}>Reset</Text>
          </Pressable>
        </View>

        <View style={styles.timerBadge}>
          <Text style={styles.timerSub}>Active Challenge</Text>
          <Text style={styles.timerVal}>{formatTimer(timeRemaining)}</Text>
        </View>

        <View style={styles.utilityRight}>
          <Pressable style={styles.iconButton} onPress={handlePause}>
            <Text style={styles.iconText}>❚❚</Text>
            <Text style={styles.iconLabel}>Pause</Text>
          </Pressable>
        </View>
      </View>

      {/* Main Score & Level Centerpiece */}
      <View style={styles.scoreRow}>
        <View>
          <Text style={styles.label}>SCORE:</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
        </View>

        {/* Center Stars & Level */}
        <View style={styles.centerBadgeContainer}>
          <View style={styles.starRow}>
            <Text style={[styles.star, stars >= 1 && styles.starActive]}>
              ★
            </Text>
            <Text style={[styles.star, stars >= 2 && styles.starActive]}>
              ★
            </Text>
            <Text style={[styles.star, stars >= 3 && styles.starActive]}>
              ★
            </Text>
          </View>
          <Text style={styles.levelText}>LEVEL {level}</Text>
        </View>

        <View style={styles.streakBadge}>
          <Text style={styles.streakLabel}>STREAK</Text>
          <Text style={styles.streakValue}>x{streak}</Text>
        </View>
      </View>

      {/* Moves Bar */}
      <View style={styles.movesContainer}>
        <View style={styles.movesTextRow}>
          <Text style={styles.movesLabel}>
            MOVES: <Text style={styles.movesHighlight}>{movesLeft}</Text> /{" "}
            {maxMoves}
          </Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[styles.progressBarFill, { width: `${movesRatio * 100}%` }]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "94%",
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 6,
  },
  utilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  utilityLeft: {
    flexDirection: "row",
    gap: 12,
  },
  utilityRight: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#111726",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  iconText: {
    fontSize: 16,
    color: "#00F2FE",
  },
  iconLabel: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "700",
    marginTop: 1,
  },
  timerBadge: {
    alignItems: "center",
    backgroundColor: "#2A111C",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4A1D2F",
  },
  timerSub: {
    fontSize: 9,
    color: "#F43F5E",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  timerVal: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 1.2,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  centerBadgeContainer: {
    alignItems: "center",
  },
  starRow: {
    flexDirection: "row",
    gap: 4,
  },
  star: {
    fontSize: 18,
    color: "#334155",
  },
  starActive: {
    color: "#F59E0B",
  },
  levelText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#00F2FE",
    letterSpacing: 1,
    marginTop: 2,
  },
  streakBadge: {
    alignItems: "flex-end",
  },
  streakLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 1,
  },
  streakValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#10B981",
  },
  movesContainer: {
    marginTop: 8,
  },
  movesTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  movesLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94A3B8",
  },
  movesHighlight: {
    color: "#00F2FE",
    fontWeight: "900",
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#1E293B",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#00F2FE",
    borderRadius: 3,
  },
});
