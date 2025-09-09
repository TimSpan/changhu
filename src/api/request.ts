import axios, {AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse} from 'axios';
import {URL} from '@/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
const axiosConfig: AxiosRequestConfig = {
  baseURL: URL,
  timeout: 10000,
  timeoutErrorMessage: '请求超时......',
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config);
    //1.添加请求拦截
    this.service.interceptors.request.use(
      async config => {
        config.headers.set('Client-Type', 'hand_device');
        const tokenInfoJson = (await AsyncStorage.getItem('tokenInfo')) as string;
        const {
          state: {tokenInfo},
        } = JSON.parse(tokenInfoJson);
        console.log('🍎 ~ RequestHttp ~ constructor ~ tokenInfo:', tokenInfo);

        if (tokenInfo) {
          config.headers.set(tokenInfo.tokenInfo?.tokenName, tokenInfo.tokenInfo?.tokenValue);
        }
        return config;
      },
      async (error: AxiosError): Promise<string> => {
        return Promise.reject(error);
      },
    );
    //2.添加响应拦截
    this.service.interceptors.response.use(
      async (response: AxiosResponse): Promise<any> => {
        const jsonResult: JsonResult<unknown> = response.data;
        if (jsonResult && jsonResult.code !== 200) {
          if ([-1].includes(jsonResult.code) || [402].includes(jsonResult.code)) {
            //清除登录信息
            //跳转登录页
            Alert.alert(jsonResult.message);
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('tokenName');
            await AsyncStorage.removeItem('myproject');
          }

          return Promise.reject(jsonResult);
        }
        return Promise.resolve(jsonResult);
      },
      async (error: AxiosError): Promise<string> => {
        console.log('_________________________ ~ error:', error);
        if (error.code === 'ECONNABORTED') {
          Alert.alert('网络错误类型：', '请求超时，请检查网络连接');
        } else if (error.message.includes('AxiosError: Network Error')) {
          Alert.alert('网络错误类型：', '网络连接失败，请检查网络环境');
        } else if (error.response) {
          console.log(error.response);

          Alert.alert('网络错误类型：', `服务器返回错误：${error.response.status}`);
        } else {
          Alert.alert('网络错误类型：', '未知错误，请稍后再试');
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   *  常用请求方法封装
   */
  get<T>(url: string, params?: object, _object: AxiosRequestConfig = {}): Promise<JsonResult<T>> {
    return this.service.get(url, {params, ..._object});
  }

  post<T>(url: string, params?: object | object[], _object: AxiosRequestConfig = {}): Promise<JsonResult<T>> {
    return this.service.post(url, params, _object);
  }

  put<T>(url: string, params?: object | object[], _object: AxiosRequestConfig = {}): Promise<JsonResult<T>> {
    return this.service.put(url, params, _object);
  }

  delete<T>(url: string, params?: object, _object: AxiosRequestConfig = {}): Promise<JsonResult<T>> {
    return this.service.delete(url, {params, ..._object});
  }

  download(url: string, params?: object, _object: AxiosRequestConfig = {}): Promise<BlobPart> {
    return this.service.post(url, params, {..._object, responseType: 'blob'});
  }
}

export const api = new RequestHttp(axiosConfig);
