import * as React from 'react';
import {Dimensions, ScrollView, StyleSheet} from 'react-native';
import {Button, Portal, Dialog, Text} from 'react-native-paper';

type Props = {
  title?: string;
  visible: boolean;
  close: () => void;
  confirm?: () => void;
  children?: React.ReactNode; // 接收自定义内容
};

export const DialogWithCustom: React.FC<Props> = ({title = '保安信息', visible, close, confirm, children}) => (
  <Portal>
    <Dialog visible={visible} style={{maxHeight: 0.6 * Dimensions.get('window').height, backgroundColor: '#fff', borderRadius: 0}}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.ScrollArea style={styles.smallPadding}>
        <ScrollView contentContainerStyle={styles.biggerPadding}>{children}</ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Button style={{width: 100, borderColor: '#2080F0'}} mode='outlined' onPress={close}>
          <Text style={{fontSize: 16, color: '#000'}}>取消</Text>
        </Button>
        <Button style={{width: 100, backgroundColor: '#2080F0'}} mode='contained' onPress={confirm}>
          <Text style={{fontSize: 16, color: '#fff'}}>确认</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

const styles = StyleSheet.create({
  smallPadding: {
    paddingHorizontal: 0,
  },
  biggerPadding: {
    paddingHorizontal: 24,
  },
});
