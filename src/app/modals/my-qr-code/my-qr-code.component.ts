import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import QRCodeStyling from 'qr-code-styling';

import {
  FileService,
  SharingService,
  ToastService,
  UserService
} from '../../services';

@Component({
  selector: 'app-my-qr-code',
  templateUrl: './my-qr-code.component.html',
  styleUrls: ['./my-qr-code.component.scss'],
})
export class MyQrCodeModal {

  qrcode: QRCodeStyling;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly toast: ToastService,
    private readonly file: FileService,

    public readonly user: UserService,
    public readonly sharing: SharingService,
  ) { }

  ngAfterViewInit() {
    this.init();
  }

  private init() {
    // create deep link
    const code = 'com.dathuynh.lovealarm://profile/' + this.user.profile.id;
    this.qrcode = this.generate(code);
    this.qrcode.append(this.canvas?.nativeElement);
  }

  generate(data: string, size: number = 280) {
    try {
      const qrcode = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: data,
        image: '/assets/images/love-alarm-logo.svg',
        imageOptions: {
          margin: 10,
          crossOrigin: 'anonymous'
        },
        dotsOptions: {
          type: 'dots',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          type: 'dot',
        },
      });

      return qrcode;

    } catch (e) {
      console.error('Error generating QR code:', e);
      return null;
    }
  }

  share() {
    const name = this.user.profile?.name?.replace(/[ \W\d]/g, '') || 'lovealarm';
    this.qrcode.getRawData().then((blob) => {
      this.sharing.shareImage(name + '-qrcode.png', blob);
    });
  }

  async download() {
    const name = this.user.profile?.name?.replace(/[ \W\d]/g, '') || 'lovealarm';
    const code = 'com.dathuynh.lovealarm://profile/' + this.user.profile.id;

    try {
      const blob = await this.generate(code, 800).getRawData();
      const result = await this.file.savePng(name + '-qrcode', blob);
      this.toast.show('QR code saved!', 'success');

    } catch (error) {
      this.toast.show('Error saving QR code!', 'error');
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
