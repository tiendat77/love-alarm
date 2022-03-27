import { Injectable } from '@angular/core';

import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Directory, Filesystem } from '@capacitor/filesystem';

import { ToastService } from './toast.service';
import { PlatformService } from './platform.service';

import { blobToBase64, saveFile } from '../helpers';

@Injectable({ providedIn: 'root' })
export class SharingService {

  constructor(
    private platform: PlatformService,
    private toast: ToastService,
  ) {}

  async shareImage(name: string, imageBlob: Blob) {
    if (!this.platform.isNative) {
      return saveFile(name, imageBlob, 'image/png');
    }

    const imageBase64 = await blobToBase64(imageBlob);

    return Filesystem.writeFile({
      path: name,
      data: imageBase64,
      directory: Directory.Cache
    })
    .then(() => {
      return Filesystem.getUri({
        directory: Directory.Cache,
        path: name
      });
    })
    .then((result) => {
      console.log(name);
      console.log(result);
      return Share.share({
        dialogTitle: 'Share',
        title: 'Love Alarm',
        url: result.uri,
      });
    });
  }

  shareLink(link = 'https://lovealarm.vercel.app/') {
    if (!this.platform.isNative) {
      Clipboard.write({string: link});
      return this.toast.show('Copied link to clipboard!');
    }

    Share.share({
      dialogTitle: 'Share',
      title: 'Love Alarm',
      url: link,
    });
  }

}
