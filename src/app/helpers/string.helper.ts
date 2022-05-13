
export class StringHelper {
  static normalize(value: string) {
    if (!value) {
      return '';
    }

    return value.normalize('NFD')
      .replace(' ', '_')
      .replace(/[^A-Za-z0-9\_]/g, '');
  }

  static base64toBytes(base64Data, sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    return byteArrays;
  }
}
