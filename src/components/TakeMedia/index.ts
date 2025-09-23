import {generateFileName, getPreSignedUrl, getPreSignedUrlFromKey} from '@/utils/upload';
import {launchCamera, MediaType} from 'react-native-image-picker';

/**
 * @type 媒体打开类型
 * @param parentDir 存储目录
 * @returns {Promise<{ objectKey: string, previewUrl: string }>}
 */
export async function takeMediaUpload(type: MediaType, parentDir: string): Promise<{objectKey: string; previewUrl: string}> {
  return new Promise((resolve, reject) => {
    launchCamera({mediaType: type, saveToPhotos: true}, async response => {
      // if (response.didCancel) return reject(new Error('用户取消'));
      // if (response.errorCode) return reject(new Error(response.errorMessage || '打开相机失败'));
      if (!response.assets?.[0]) return reject(new Error('未获取到照片或视频'));
      const asset = response.assets[0];
      const {uri, fileName, type} = asset;
      if (!uri) return reject(new Error('照片或视频 URI 不存在'));
      try {
        const uploadName = fileName || generateFileName(uri);
        const {objectKey, preSignedUrl} = await getPreSignedUrl(uploadName, parentDir);
        const res = await fetch(uri);
        const blob = await res.blob();
        await fetch(preSignedUrl, {
          method: 'PUT',
          body: blob,
          headers: {'Content-Type': type || 'application/octet-stream'},
        });
        const previewUrl = await getPreSignedUrlFromKey(objectKey);
        resolve({objectKey, previewUrl});
      } catch (err) {
        reject(err);
      }
    });
  });
}
