import {PublicKey} from '@/common';
import {JSEncrypt} from 'jsencrypt';
const rsa = new JSEncrypt();
rsa.setPublicKey(PublicKey);
export const encryptStr = (text: string): string => {
  const r = rsa.encrypt(text);
  if (!r) {
    throw '加密失败';
  }
  return r;
};
