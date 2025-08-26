import { JSEncrypt } from 'jsencrypt';

const rsa = new JSEncrypt();
// rsa.setPublicKey(__APP_ENV.VITE_APP_JS_ENCRYPT_PUBLIC_KEY)
rsa.setPublicKey(
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpu1C3JHZ+Ng/eVVCZtwKsOZv9RktpAL13pKy4FoRHyNv2t8TPV2AMzLzfEzlWx001nBxyVxEMR2N9jAcqFLHv7r16ciOzbtzB9dky2G+bc9jIs4/EdVK5bAZcPRh5Jrb78sC9PHyR4AeceDyCIKHLUbWBJB4NTZE0s1Wh5kMynQIDAQAB',
);

export const encryptStr = (text: string): string => {
  const r = rsa.encrypt(text);
  if (!r) {
    throw '加密失败';
  }
  return r;
};
