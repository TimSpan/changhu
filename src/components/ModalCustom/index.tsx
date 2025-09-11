import React from 'react';
import {View, StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Button} from 'react-native-paper';

interface ModalCustomProps {
  title?: string;
  visible: boolean;
  color?: string;
  size?: number | 'small' | 'large';
  transparent?: boolean;
  close: () => void;
  confirm: () => void;
}
// const {width, height} = useWindowDimensions();
export const ModalCustom: React.FC<ModalCustomProps> = ({close, confirm, title = '上传中...', visible, color = '#fff', size = 'large', transparent = false}) => {
  return (
    visible && (
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.container}>
          <View style={[styles.box, transparent && {backgroundColor: 'transparent'}]}>
            <Button style={{width: 100, borderColor: '#2080F0'}} mode='outlined' onPress={close}>
              <Text style={{fontSize: 16, color: '#000'}}>取消</Text>
            </Button>
            <Button style={{width: 100, backgroundColor: '#2080F0'}} mode='contained' onPress={confirm}>
              <Text style={{fontSize: 16, color: '#fff'}}>确认</Text>
            </Button>
          </View>
        </View>
      </View>
    )
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
    // width: width,
    // height: height / 2,
    // backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.6)', // 默认有一个黑色半透明底
  },
});
