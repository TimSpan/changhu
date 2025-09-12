import * as React from 'react';
import {Text} from 'react-native';
import {Button, Portal, Dialog} from 'react-native-paper';

const ConfirmDialog = ({onlyConfirm, title, text, visible, close, confirm}: {onlyConfirm: boolean; title: string; text: string; visible: boolean; close?: () => void; confirm?: () => void}) => (
  <Portal>
    <Dialog style={{borderRadius: 0, backgroundColor: '#fff'}} onDismiss={close} visible={visible} dismissable={false}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text style={{fontSize: 18}}>{text}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        {!onlyConfirm && (
          <Button style={{width: 100, borderColor: '#2080F0'}} mode='outlined' onPress={close}>
            <Text style={{fontSize: 18, color: '#000'}}>取消</Text>
          </Button>
        )}
        <Button style={{width: 100, backgroundColor: '#2080F0'}} mode='contained' onPress={confirm}>
          <Text style={{fontSize: 18, color: '#fff'}}>确认</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default ConfirmDialog;
