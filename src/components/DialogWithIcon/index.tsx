import * as React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Button, Portal, Dialog, Provider} from 'react-native-paper';
const DialogWithIcon = ({title, text, visible, close, confirm}: {title: string; text: string; visible: boolean; close?: () => void; confirm?: () => void}) => {
  return (
    <Portal>
      <Dialog onDismiss={close} visible={visible}>
        <Dialog.Icon icon='alert' />
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
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
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});
export default DialogWithIcon;
