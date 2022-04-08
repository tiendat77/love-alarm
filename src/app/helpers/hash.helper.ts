import * as CryptoJS from 'crypto-js';

export function md5(text: string) {
  return CryptoJS.MD5(text).toString();
}

export default {
  md5
}
