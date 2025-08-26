import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: 'http://175.6.124.250/api',
  timeout: 10000,
  timeoutErrorMessage: '请求超时......',
});

api.interceptors.request.use(
  async config => {
    config.headers.set('Client-Type', 'management');
    const token = await AsyncStorage.getItem('token');
    const tokenName = await AsyncStorage.getItem('tokenName');
    // console.log('_________________________ ~ token:', token);
    // console.log('_________________________ ~ tokenName:', tokenName);
    if (token && tokenName) {
      config.headers.set(tokenName, token);
    }

    // Axios 拦截器不是 React 组件或 Hook 内部，它是普通 JS 函数，因此不能用 Hook。
    // const { tokenName, token } = useAuthStore();
    // 解决办法：
    // 不要直接用 Hook
    // 通过 AsyncStorage 或者 store 的 getState() 方法 访问状态

    // console.log('请求地址:', config.url);
    console.log('请求头:', config.headers);
    // console.log('请求参数:', config.params);
    // console.log('请求体:', config.data);
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === -1 || error.response?.status === 402) {
      useAuthStore.getState().logout();
      // 可选：导航到登录页面
    }
    return Promise.reject(error);
    // console.error('API Error:', error);
    // return Promise.reject(error);
  },
);
