import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';

import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import * as htmlToImage from 'html-to-image';

import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class SharingService {

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

  shareLink(link = 'https://lovealarm.vercel.app/') {
    if (!this.isNative) {
      Clipboard.write({string: link});
      return this.toast.show('Copied link to clipboard!');
    }

    Share.share({
      title: 'Love Alarm',
      url: link,
      dialogTitle: 'Share',
    });
  }

}
