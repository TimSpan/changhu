import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal, Text} from 'react-native';

interface LoadingOverlayProps {
  title?: string;
  visible: boolean;
  color?: string;
  size?: number | 'small' | 'large';
  transparent?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  title = '上传中...',
  visible,
  color = '#fff',
  size = 'large',
  transparent = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent>
      <View style={styles.container}>
        <View
          style={[styles.box, transparent && {backgroundColor: 'transparent'}]}>
          <Text style={{color: '#fff'}}>{title}</Text>
          <ActivityIndicator size={size} color={color} />
        </View>
      </View>
    </Modal>
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
