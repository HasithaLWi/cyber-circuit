import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/theme';

export type SafeEdge = 'top' | 'bottom' | 'left' | 'right';

export interface SafeScreenViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  edges?: SafeEdge[];
  statusBarStyle?: 'light' | 'dark' | 'auto';
  disableStatusBar?: boolean;
}

/**
 * SafeScreenView:
 * Handles device cutouts, dynamic islands, home gesture bars,
 * and Android navigation bars across all screen sizes and orientations.
 */
export const SafeScreenView: React.FC<SafeScreenViewProps> = ({
  children,
  style,
  contentContainerStyle,
  backgroundColor = COLORS.void,
  edges = ['top', 'bottom', 'left', 'right'],
  statusBarStyle = 'light',
  disableStatusBar = false,
}) => {
  const insets: EdgeInsets = useSafeAreaInsets();

  const containerPadding = {
    paddingTop: edges.includes('top') ? Math.max(insets.top, 12) : 0,
    paddingBottom: edges.includes('bottom') ? Math.max(insets.bottom, 12) : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View style={[styles.root, { backgroundColor }, style]}>
      {!disableStatusBar && <StatusBar style={statusBarStyle} />}
      <View style={[styles.content, containerPadding, contentContainerStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

