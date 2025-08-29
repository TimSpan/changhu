import * as React from 'react';
import {Text} from 'react-native';
import {Button, Portal, Dialog} from 'react-native-paper';

const ConfirmDialog = ({
  title,
  text,
  visible,
  close,
  confirm,
}: {
  title: string;
  text: string;
  visible: boolean;
  close?: () => void;
  confirm?: () => void;
}) => (
  <Portal>
    <Dialog
      style={{borderRadius: 0, backgroundColor: '#fff'}}
      onDismiss={close}
      visible={visible}
      dismissable={false}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text>{text}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={close}>取消</Button>
        <Button onPress={confirm}>确认</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default ConfirmDialog;
