// message 👉 显示的文字，比如“保存成功”。
// duration 👉 显示多久（默认 2000 毫秒，也就是 2 秒）。
// onClose 👉 Toast 消失时要做的事（比如通知父组件隐藏）。
// opacity 👉 用来控制透明度的动画值（useRef 保证在整个组件生命周期内只有一个数值对象）。

import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
export const Toast = ({ message, duration = 2000, onClose }: any) => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // 进入时动画：从 0 透明 -> 1 不透明
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    // 设置定时器，duration 毫秒后执行“淡出动画”
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onClose?.()); // 动画结束后执行 onClose（父组件会把 Toast 移除）
    }, duration);
    return () => clearTimeout(timer); // 组件卸载时清理定时器
  }, []);

  return (
    // Animated.View 👉 和 View 类似，但支持动画属性（这里是透明度）。
    <Animated.View style={[styles.toast, { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute', // 固定在屏幕上，不会随布局变化
    bottom: 100, // 距离底部 100 像素
    left: '50%', // 居中
    transform: [{ translateX: -75 }], // 向左平移一半宽度（150/2）
    width: 150,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)', // 半透明黑色背景
    borderRadius: 8,
    alignItems: 'center',
  },
  text: { color: '#fff' }, // 白色文字
});
