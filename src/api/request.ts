import axios, {AxiosResponse} from 'axios';
import {useAuthStore} from '../stores/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {URL} from '@/common';
export const api = axios.create({
  baseURL: URL,
  timeout: 10000,
  timeoutErrorMessage: '请求超时......',
});

api.interceptors.request.use(
  async config => {
    config.headers.set('Client-Type', 'hand_device');
    const token = await AsyncStorage.getItem('token');
    const tokenName = await AsyncStorage.getItem('tokenName');
    if (token && tokenName) {
      config.headers.set(tokenName, token);
    }
    // Axios 拦截器不是 React 组件或 Hook 内部，它是普通 JS 函数，因此不能用 Hook。const { tokenName, token } = useAuthStore();解决办法：不要直接用 Hook\通过 AsyncStorage 或者 store 的 getState() 方法 访问状态
    // console.log('请求头:', config.headers);
    // console.log('请求参数:', config.params);
    // console.log('请求体:', config.data);
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  // response => response.data,
  async (response: AxiosResponse): Promise<any> => {
    const jsonResult: JsonResult<unknown> = response.data;
    if (jsonResult && jsonResult.code !== 200) {
      //todo 一些特定的错误需要重新登录
      if ([-1].includes(jsonResult.code) || [402].includes(jsonResult.code)) {
        useAuthStore.getState().logout();
      }
      Alert.alert(jsonResult.message);
      return Promise.reject(jsonResult);
    }
    return Promise.resolve(jsonResult);
  },
  error => {
    console.error('_________________________ ~ error:', error);

    // 这里能捕获各种错误：超时 / 网络错误 / 服务端错误
    if (error.code === 'ECONNABORTED') {
      Alert.alert('提示', '请求超时，请检查网络连接');
    } else if (error.message.includes('Network Error')) {
      Alert.alert('提示', '网络连接失败，请确认是否连上局域网');
    } else if (error.response) {
      Alert.alert('错误', `服务器返回错误：${error.response.status}`);
    } else {
      Alert.alert('错误', '未知错误，请稍后再试');
    }
    return Promise.reject(error);
  },
);
