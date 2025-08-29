import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Checkbox} from 'react-native-paper';
import Modal from 'react-native-modal';
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
  value?: Option | null; // 父组件传入的已选值
  onChange: (val: Option) => void; // 父组件回调
}) => {
  const [selected, setSelected] = useState<Option | null>(null);
  // 如果父组件 value 改了，子组件同步
  useEffect(() => {
    setSelected(value ?? null);
  }, [value]);
  const handleSelect = (val: Option) => {
    setSelected(val);
    onChange(val); // 把值传回父组件
  };
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      swipeDirection='down'
      onSwipeComplete={onClose}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{title} </Text>
        </View>
        <ScrollView style={styles.scroll}>
          {eventTypeList &&
            eventTypeList.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.option}
                activeOpacity={0.7}
                onPress={() => handleSelect(option)}>
                <Checkbox
                  status={
                    selected?.value === option.value ? 'checked' : 'unchecked'
                  }
                  onPress={() => handleSelect(option)}
                  color="#2080F0"
                  uncheckedColor="#ccc"
                  // 增大 Checkbox 尺寸
                  // @ts-ignore
                  style={{transform: [{scale: 1.5}]}}
                />
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
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
  },
  headerText: {
    fontSize: 18,
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
    marginLeft: 12,
  },
});

export default EventTypeBottomSheet;
