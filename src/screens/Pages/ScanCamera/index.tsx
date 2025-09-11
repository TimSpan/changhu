import * as React from 'react';
import {useCallback, useRef, useState} from 'react';
import type {AlertButton} from 'react-native';
import {Alert, Animated, Dimensions, Easing, Linking, StyleSheet, View} from 'react-native';
import type {Code} from 'react-native-vision-camera';
import {useCameraDevice, useCodeScanner} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {CONTENT_SPACING, CONTROL_BUTTON_SIZE, SAFE_AREA_PADDING} from './Constants';
import {useIsForeground} from './useIsForeground';
import {StatusBarBlurBackground} from './StatusBarBlurBackground';
import {PressableOpacity} from 'react-native-pressable-opacity';
import Ionicons from '@react-native-vector-icons/ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackActions, useIsFocused} from '@react-navigation/core';
import {RootStackParamList} from '@/navigation/types';

const {width, height} = Dimensions.get('window');
const SCAN_WIDTH = width * 0.7; // 扫描线长度
const SCAN_SIZE = width * 0.7; // 扫描框大小

type Props = NativeStackScreenProps<RootStackParamList>;
export function CodeScannerPage({navigation}: Props): React.ReactElement {
  const animatedLine = useRef(new Animated.Value(0)).current;
  // 扫描线动画
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedLine, {
          toValue: height * 0.6, // 扫描范围
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedLine, {
          toValue: height * 0.2,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animatedLine]);
  // 1. Use a simple default back camera
  const device = useCameraDevice('back');

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  // 3. (Optional) enable a torch setting
  const [torch, setTorch] = useState(false);

  // 4. On code scanned, we show an aler to the user
  const isShowingAlert = useRef(false);
  const showCodeAlert = (value: string, onDismissed: () => void): void => {
    const buttons: AlertButton[] = [
      {
        text: 'Close',
        style: 'cancel',
        onPress: onDismissed,
      },
    ];
    if (value.startsWith('http')) {
      buttons.push({
        text: 'Open URL',
        onPress: () => {
          Linking.openURL(value);
          onDismissed();
        },
      });
    }
    Alert.alert('Scanned Code', value, buttons);
  };
  const onCodeScanned = useCallback((codes: Code[]) => {
    console.log(`Scanned ${codes.length} codes:`, codes);
    const value = codes[0]?.value;
    if (value == null) return;
    if (isShowingAlert.current) return;
    showCodeAlert(value, () => {
      isShowingAlert.current = false;
      navigation.navigate('PatrolDetails', {id: value, type: 1, isScan: true});
    });
    isShowingAlert.current = true;
  }, []);

  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: onCodeScanned,
    // onCodeScanned: codes => {
    //   console.log(`Scanned ${codes.length} codes!`, codes);
    // },
  });

  return (
    <View style={styles.container}>
      {device != null && (
        <>
          <Camera codeScanner={codeScanner} device={device} isActive={isActive} style={StyleSheet.absoluteFill} torch={torch ? 'on' : 'off'} enableZoomGesture={true} />
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [{translateY: animatedLine}],
              },
            ]}
          />
        </>
      )}

      <StatusBarBlurBackground />

      <View style={styles.rightButtonRow}>
        <PressableOpacity style={styles.button} onPress={() => navigation.dispatch(StackActions.pop(1))} disabledOpacity={0.4}>
          <Ionicons name={torch ? 'flash' : 'flash-off'} color='white' size={24} />
        </PressableOpacity>
      </View>

      {/* Back Button */}
      <PressableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <Ionicons name='chevron-back' color='white' size={35} />
      </PressableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  backButton: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },

  overlay: {
    position: 'absolute',
    top: '30%',
    left: (width - SCAN_SIZE) / 2,
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
  },

  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#00e676',
  },
  topLeft: {top: 0, left: 0, borderLeftWidth: 4, borderTopWidth: 4},
  topRight: {top: 0, right: 0, borderRightWidth: 4, borderTopWidth: 4},
  bottomLeft: {bottom: 0, left: 0, borderLeftWidth: 4, borderBottomWidth: 4},
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },

  scanLine: {
    position: 'absolute',
    top: 0,
    left: (width - SCAN_WIDTH) / 2,
    width: SCAN_WIDTH,
    height: 2,
    backgroundColor: '#00e676',
  },
});
