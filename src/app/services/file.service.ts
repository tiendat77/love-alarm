import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { ToastService } from './toast.service';

import { saveAs } from 'file-saver';
import { StringHelper } from '../helpers/string.helper';

@Injectable({ providedIn: 'root' })
export class FileService {

  private isNative = false;

  constructor(
    private platform: Platform,
    private toast: ToastService,
  ) {
    this.platform.ready().then(() => {
      this.initialize();
    });
  }

  private initialize() {
    if (this.platform.is('hybrid')) {
      this.isNative = true;
    }
  }

  savePng(dataUrl: string, name: string) {
    if (this.isNative) {
      return this.savePngNative(dataUrl, name);
    }

    return this.savePngBrowser(dataUrl, name)
  }

  private savePngNative(dataUrl: string, name: string) {
    return Filesystem.writeFile({
      data: dataUrl,
      path: 'LaSoTuVi/' + name + '.png',
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