/**
 *
 * @第一步 生成文件
 */

export const generateFileName = (path: string) => {
  const ext = path.substring(path.lastIndexOf('.'));
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
};
/**
 *
 * @第二步 获取预签名上传
 */

import {api} from '@/api/request';
export const getPreSignedUrl = async (fileName: string, parentDir?: string) => {
  const res = await api.get<{objectKey: string; preSignedUrl: string}>('/file/getUploadUrl', {fileName, parentDir});
  console.log('_________________________ ~ getPreSignedUrl ~ res:', res);

  if (!res.data) throw new Error('上传接口返回数据异常');
  const {objectKey, preSignedUrl} = res.data;
  return {objectKey, preSignedUrl};
};
/**
 *
 * @第二步 获取回显地址
 */

export const getPreSignedUrlFromKey = async (objectKey: string) => {
  const res = await api.get<string>('/file/getPreviewUrl', {objectKey});
  return res.data || '';
};
