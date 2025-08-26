import { Button, StyleSheet, View } from 'react-native';
import { Modal } from 'react-native-paper';
import { ImagePreview as ImagePreviewComponents } from '@/components/ImagePreview';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';
export default function ImagePreview({ route, navigation }: any) {
  const [visible, setVisible] = useState(false);
  const hideModal = () => setVisible(false);
  const containerStyle = { flex: 1 };
  return (
    <GestureHandlerRootView>
      <Modal
        style={styles.z}
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <ImagePreviewComponents />
      </Modal>
      <Button
        title="点击预览"
        onPress={() => {
          setVisible(true);
        }}
      ></Button>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  z: { zIndex: 10000 },
});
