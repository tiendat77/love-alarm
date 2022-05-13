import { saveAs } from 'file-saver';

export class FileHelper {
  /**
   *
   * @param name: with extension. Ex: 'my-qrcode.png'
   * @param type: 'image/png' | 'image/jpeg' | ...
   */
  static saveFile(name: string, blob: Blob, type: string) {
    const file = new File([blob], name, {type});
    saveAs(file);
  }

  static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }
}
