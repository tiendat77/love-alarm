import { Injectable } from '@angular/core';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { PlatformService } from './platform.service';

import { FileHelper } from '../helpers/file.helper';

@Injectable({ providedIn: 'root' })
export class FileService {

  constructor(
    private readonly platform: PlatformService
  ) {}

  async savePng(name: string, imageBlob: Blob) {
    if (!this.platform.isNative) {
      return FileHelper.saveFile(`${name}.png`, imageBlob, 'image/png');
    }

    const dataUrl = await FileHelper.blobToBase64(imageBlob);

    return Filesystem.writeFile({
      data: dataUrl,
      path: `LoveAlarm/${name}.png`,
      recursive: true,
      directory: Directory.Documents
    });
  }

}