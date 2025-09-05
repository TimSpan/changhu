import * as React from 'react';
import {ScrollView, View, StyleSheet, Text} from 'react-native';
import {Button, Portal, Dialog, RadioButton, TouchableRipple} from 'react-native-paper';
type Props = {
  data: Option[];
  visible: boolean;
  close: () => void;
  confirm: (val?: string) => void;
};

const DialogWithRadioBtns = ({data, visible, close, confirm}: Props) => {
  const [checked, setChecked] = React.useState<string>();
  return (
    <Portal>
      <Dialog style={{backgroundColor: '#fff', borderRadius: 0}} onDismiss={close} visible={visible}>
        <Dialog.Title>请选择</Dialog.Title>
        <Dialog.ScrollArea style={styles.container}>
          <ScrollView>
            <View>
              {data.map(item => {
                return (
                  <TouchableRipple key={item.value} onPress={() => setChecked(item.value)}>
                    <View style={styles.row}>
                      <View pointerEvents='none'>
                        <RadioButton value={item.value} status={checked === item.value ? 'checked' : 'unchecked'} />
                      </View>
                      <Text style={styles.text}>{item.label}</Text>
                    </View>
                  </TouchableRipple>
                );
              })}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={close}>取消</Button>
          <Button onPress={() => confirm(checked)}>确认</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogWithRadioBtns;

const styles = StyleSheet.create({
  container: {
    maxHeight: 170,
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    paddingLeft: 8,
    fontSize: 22,
  },
});
