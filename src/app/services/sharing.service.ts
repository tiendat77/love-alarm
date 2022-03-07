import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';

import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Filesystem, Directory } from '@capacitor/filesystem';

import { FileService } from './file.service';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';

import { of } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

import * as htmlToImage from 'html-to-image';

@Injectable({ providedIn: 'root' })
export class SharingService {

  private isNative = false;

  constructor(
    private platform: Platform,
    private file: FileService,
    private toast: ToastService,
    private loader: LoaderService,
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

  private cache(dataUrl: string, name: string) {
    return Filesystem.writeFile({
      data: dataUrl,
      path: name + '.png',
      recursive: true,
      directory: Directory.Cache,
    });
  }

  private getCache(name: string) {
    return Filesystem.getUri({
      path: name + '.png',
      directory: Directory.Cache,
    });
  }

  shareImage(element: HTMLElement, name: string) {
    if (!this.isNative) {
      this.toast.show('Chưa hỗ trợ trên nền tảng của bạn!');
      return Promise.resolve();
    }

    const transform = element.style.transform;
    const imageName = `la_so_${name}`;

    return of(element).pipe(
      tap(() => {
        this.loader.start('Đang xử lý');
      }),
      switchMap(() => {
        element.style.transform = '';
        return htmlToImage.toPng(element);
      }),
      switchMap((dataUrl) => {
        element.style.transform = transform;
        return this.cache(dataUrl, imageName);
      }),
      switchMap(() => {
        return this.getCache(imageName)
      }),
      tap((result) => {
        this.loader.stop();

        Share.share({
          title: 'Lá số tử vi',
          url: result.uri,
          dialogTitle: 'Share',
        });
      }),
      catchError((error: any) => {
        element.style.transform = transform;
        this.toast.show('Có lỗi xảy ra!');
        this.loader.stop();
        console.error(error);
        return of();
      })
    ).toPromise();
  }

  shareLink(link = 'https://lasotuvi.vercel.app/') {
    if (!this.isNative) {
      Clipboard.write({string: link});
      return this.toast.show('Đã sao chép mã giới thiệu');
    }

    Share.share({
      title: 'Lá số tử vi',
      url: link,
      dialogTitle: 'Share',
    });
  }

  download(element: HTMLElement, name: string) {
    const transform = element.style.transform;
    const imageName = `la_so_${name}`;

    return of(element).pipe(
      tap(() => {
        this.loader.start('Đang xử lý');
      }),
      switchMap(() => {
        element.style.transform = '';
        return htmlToImage.toPng(element);
      }),
      switchMap((dataUrl) => {
        element.style.transform = transform;
        return this.file.savePng(dataUrl, imageName);
      }),
      tap(() => {
        this.loader.stop();
        this.toast.show('Tải xuống thành công!');
      }),
      catchError((error: any) => {
        element.style.transform = transform;
        this.toast.show('Có lỗi xảy ra!');
        this.loader.stop();
        console.error(error);
        return of();
      })
    ).toPromise();
  }

}
