// 在 React Native 里：

// Modal 会独立于 React 的视图层级渲染（相当于一个单独的原生视图层），理论上它应该盖住所有内容。

// 但是如果你把 Modal 放在某些容器里（比如 SafeAreaView 或有 overflow: hidden 的父容器），可能会导致它看不到。

// Modal 在原生层面是一个“新的窗口”

// RN 的 Modal 并不是普通的 View，它会直接挂载到最顶层（原生的 window / rootView）。

// 理论上不管放在哪个位置，都会显示在最上面。
import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal, Text} from 'react-native';

interface LoadingOverlayProps {
  title?: string;
  visible: boolean;
  color?: string;
  size?: number | 'small' | 'large';
  transparent?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({title = '上传中...', visible, color = '#fff', size = 'large', transparent = false}) => {
  return (
    visible && (
      // 普通绝对定位遮罩、这样就不会依赖 Modal，始终在 RN 层级最高的位置。
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.container}>
          <View style={[styles.box, transparent && {backgroundColor: 'transparent'}]}>
            <Text style={{color: '#fff'}}>{title}</Text>
            <ActivityIndicator size={size} color={color} />
          </View>
        </View>
      </View>
    )
    // <Modal
    //   visible={visible}
    //   transparent
    //   animationType='fade'
    //   statusBarTranslucent
    //   presentationStyle='overFullScreen' // 🔑 保证全屏覆盖，避免被原生 view 压住
    //   hardwareAccelerated //提升层级兼容性
    // >
    //   <View style={styles.container}>
    //     <View style={[styles.box, transparent && {backgroundColor: 'transparent'}]}>
    //       <Text style={{color: '#fff'}}>{title}</Text>
    //       <ActivityIndicator size={size} color={color} />
    //     </View>
    //   </View>
    // </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // 半透明蒙层
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.6)', // 默认有一个黑色半透明底
  },
});

export default LoadingOverlay;
