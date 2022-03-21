import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import QRCode from 'qrcode';

import { UserService } from '../../services';

@Component({
  selector: 'app-my-qr-code',
  templateUrl: './my-qr-code.component.html',
  styleUrls: ['./my-qr-code.component.scss'],
})
export class MyQrCodeModal {

  qrcode: string;

  constructor(
    private modalCtrl: ModalController,

    public readonly user: UserService,
  ) {
    this.init();
  }

  private init() {
    const code = 'lovealarm://' + this.user.id;
    QRCode.toDataURL(code, {
      type: 'image/webp',
      width: 300,
      margin: 0,
    })
    .then(url => {
      this.qrcode = url;
    })
    .catch(err => {
      console.error(err);
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
