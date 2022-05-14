import { Injectable } from '@angular/core';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { PlatformService } from './platform.service';

import { saveAs } from 'file-saver';
import { StringHelper } from '../helpers/string.helper';

@Injectable({ providedIn: 'root' })
export class FileService {

  constructor(
    private readonly platform: PlatformService
  ) {}

  savePng(dataUrl: string, name: string) {
    if (this.platform.isNative) {
      return this.savePngNative(dataUrl, name);
    }

    return this.savePngBrowser(dataUrl, name)
  }

  private savePngNative(dataUrl: string, name: string) {
    return Filesystem.writeFile({
      data: dataUrl,
      path: 'LoveAlarm/' + name + '.png',
      recursive: true,
      directory: Directory.Documents,
    });
  }

  private savePngBrowser(dataUrl: string, name: string) {
    try {
      const bytes = StringHelper.base64toBytes(dataUrl.replace(/^data:image\/(png|jpg);base64,/, ''));
      const blob = new Blob(bytes, {type: 'image/png'});
      saveAs(blob, name + '.png');

      return Promise.resolve({success: true});

    } catch (error) {
      return Promise.reject(error);
    }
  }

}