import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {BlurView, BlurViewProps} from 'expo-blur';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

const FALLBACK_COLOR = 'rgba(140, 140, 140, 0.3)';

const StatusBarBlurBackgroundImpl = ({style, ...props}: BlurViewProps): React.ReactElement | null => {
  if (Platform.OS !== 'ios') return null;

  return (
    <BlurView
      style={[styles.statusBarBackground, style]}
      intensity={50} // 替代 blurAmount
      tint='light' // 替代 blurType
      {...props}
    />
  );
};

export const StatusBarBlurBackground = React.memo(StatusBarBlurBackgroundImpl);

const styles = StyleSheet.create({
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StaticSafeAreaInsets.safeAreaInsetsTop,
    backgroundColor: FALLBACK_COLOR, // 用来做透明度回退
  },
});
