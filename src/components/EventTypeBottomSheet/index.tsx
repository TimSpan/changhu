import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Modal as RNModal} from 'react-native';
import {Fontisto} from '@react-native-vector-icons/fontisto';
import {AntDesign} from '@react-native-vector-icons/ant-design';
const {height} = Dimensions.get('window');
const EventTypeBottomSheet = ({
  title,
  visible,
  eventTypeList,
  value,
  onChange,
  onClose,
}: {
  title: string;
  visible: boolean;
  onClose: () => void;
  eventTypeList: {label: string; value: string}[];
  value?: Option | null;
  onChange: (val: Option) => void;
}) => {
  const [selected, setSelected] = useState<Option | null>(null);

  useEffect(() => {
    setSelected(value ?? null);
  }, [value]);

  const handleSelect = (val: Option) => {
    setSelected(val);
    onChange(val);
  };

  // 小列表（几十条以内）：直接用 useMemo 就够了。
  // 大列表（几百条以上）：推荐拆成 OptionItem + React.memo，避免每次 selected 改变渲染整个列表。
  const renderedOptions = useMemo(() => {
    return eventTypeList.map(option => (
      <TouchableOpacity key={option.value} style={styles.option} activeOpacity={0.7} onPress={() => handleSelect(option)}>
        <View style={{width: 50}}>
          <Fontisto
            onPress={() => handleSelect(option)}
            name={selected?.value === option.value ? 'checkbox-active' : 'checkbox-passive'}
            color={selected?.value === option.value ? '#2080F0' : '#ccc'}
            size={22}
          />
        </View>
        <Text style={styles.optionText}>{option.label}</Text>
      </TouchableOpacity>
    ));
  }, [eventTypeList, selected]);
  return (
    <RNModal
      animationType='slide'
      transparent
      visible={visible}
      onRequestClose={onClose} // Android 返回键
    >
      {/* 点击遮罩关闭 */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* 底部弹出内容 */}
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{title}</Text>
          <AntDesign onPress={onClose} name={'close'} size={30} color={'#000'}></AntDesign>
        </View>
        <ScrollView style={styles.scroll}>{renderedOptions}</ScrollView>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    maxHeight: height * 0.7,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scroll: {
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 26,
  },
});

export default EventTypeBottomSheet;
