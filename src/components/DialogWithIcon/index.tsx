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
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});
export default DialogWithIcon;
