import React, {useState} from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
type Props = {
  height?: number;
  value?: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  style?: object;
} & Omit<TextInputProps, 'onChangeText' | 'value' | 'placeholder'>;
// 继承 TextInputProps，避免丢失常用属性，同时排除掉我们自定义的

const CustomInput: React.FC<Props> = ({height = 40, value, onChangeText, placeholder, style, ...rest}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.container, {borderColor: focused ? '#2080F0' : '#000', minWidth: height}, style]}>
      <TextInput
        {...rest}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
        style={[styles.input, {height, flex: 1}]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    textAlignVertical: 'top', // 多行时文字从顶部开始
    fontSize: 20,
    padding: 0, // 去掉 TextInput 默认内边距
  },
});

export default CustomInput;
