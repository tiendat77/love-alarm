import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import QRCodeStyling from 'qr-code-styling';

import {
  SharingService,
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
    private modalCtrl: ModalController,

    public readonly user: UserService,
    public readonly sharing: SharingService,
  ) { }

  ngAfterViewInit() {
    this.init();
  }

  private init() {
    const code = 'lovealarm://' + this.user.profile.id;
    this.qrcode = this.generate(code);
    this.qrcode.append(this.canvas?.nativeElement);
  }

  generate(data: string) {
    try {
      const qrcode = new QRCodeStyling({
        width: 280,
        height: 280,
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
    const name = this.user.profile.name + '-qrcode.png';
    this.qrcode.getRawData().then((blob) => {
      this.sharing.shareImage(name, blob);
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
