import * as CryptoJS from 'crypto-js';

export class HashHelper {
  static md5(text: string) {
    return CryptoJS.MD5(text).toString();
  }
}
