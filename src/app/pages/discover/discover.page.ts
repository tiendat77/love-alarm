import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { MyQrCodeModal } from '../../modals';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  constructor(
    private modal: ModalController,
    private barcode: BarcodeScanner
  ) { }

  ngOnInit() {
  }

  scan() {
    this.barcode.scan({
      prompt: 'Place the code inside the frame'
    })
      .then(data => {
        console.log('Barcode data', data.text);
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  async qrcode() {
    const modal = await this.modal.create({
      component: MyQrCodeModal
    });

    modal.present();
  }

}
