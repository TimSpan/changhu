// src/screens/HomeScreen.tsx
import React, {useState} from 'react';

import {Button as NButton, Divider} from 'react-native-paper';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useAuthStore} from '@/stores/auth';
import DialogWithIcon from '@/components/DialogWithIcon';
import ConfirmDialog from '@/components/ConfirmDialog';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({navigation}: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const logout = useAuthStore(state => state.logout); // 必须在组件顶层调用
  const [visible, setVisible] = useState(false);
  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <View>
          <NButton
            style={{borderRadius: 0, marginTop: 5, marginBottom: 5}}
            mode="contained"
            onPress={() => {
              setVisible(true);
            }}>
            退出登录
          </NButton>
          <Divider />

          <Text
            style={styles.text}
            onPress={() =>
              navigation.getParent()?.navigate('Test', {params: 1111})
            }>
            测试页面
          </Text>
          <Divider />
          <Text
            style={styles.text}
            onPress={() =>
              navigation.navigate('ShowComponents', {params: 1111})
            }>
            组件展示
          </Text>
          <Divider />
          <Text
            style={styles.text}
            onPress={() => navigation.navigate('Camera', {setPhotoUri})}>
            拍照
          </Text>
          <Divider />
          <Text
            style={styles.text}
            onPress={() => navigation.navigate('Video', {setVideoUri})}>
            录像
          </Text>

          <Divider />
          <Text
            style={styles.text}
            onPress={() => navigation.navigate('ImagePreview')}>
            图片预览
          </Text>

          <Divider />
        </View>

        <ConfirmDialog
          visible={visible}
          title="提示"
          text="确定要退出登录么？"
          confirm={() => {
            setVisible(false);
            logout();
          }}
          close={() => {
            setVisible(false);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {flex: 1, backgroundColor: '#007bff'},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    justifyContent: 'space-around',
  },
  item: {
    width: '40%',
    height: 120,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
  },
  preview: {width: 60, height: 60, marginTop: 10, borderRadius: 8},

  scrollView: {
    marginHorizontal: 20,
  },

  text: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
  },
});
