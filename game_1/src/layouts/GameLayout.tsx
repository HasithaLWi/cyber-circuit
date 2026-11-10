import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { SafeScreenView, SafeEdge } from './SafeScreenView';
import { COLORS } from '../constants/theme';

export interface GameLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  modals?: React.ReactNode;
  edges?: SafeEdge[];
  backgroundColor?: string;
  boardWrapperStyle?: StyleProp<ViewStyle>;
}

/**
 * GameLayout:
 * 3-tier vertical game layout with fixed top HUD header,
 * centered responsive playing field, and bottom power-up / action tray.
 */
export const GameLayout: React.FC<GameLayoutProps> = ({
  header,
  children,
  footer,
  modals,
  edges = ['top', 'bottom', 'left', 'right'],
  backgroundColor = COLORS.void,
  boardWrapperStyle,
}) => {
  return (
    <SafeScreenView edges={edges} backgroundColor={backgroundColor}>
      <View style={styles.container}>
        {/* Top Section (HUD / Scores / Level Indicator) */}
        {header && <View style={styles.headerArea}>{header}</View>}

        {/* Center Playing Field (Game Grid / Laser Overlay) */}
        <View style={[styles.mainBoardArea, boardWrapperStyle]}>
          {children}
        </View>

        {/* Bottom Section (Power-Up Tray / Actions) */}
        {footer && <View style={styles.footerArea}>{footer}</View>}

        {/* Overlay Modals (Victory, Game Over, Pause) */}
        {modals}
      </View>
    </SafeScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  headerArea: {
    width: '100%',
    zIndex: 10,
  },
  mainBoardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 5,
  },
  footerArea: {
    width: '100%',
    zIndex: 10,
  },
});

