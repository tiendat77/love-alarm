import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { BLEService, WebViewService } from '../../services';
import {
  MyQrCodeModal,
  ScanQrCodeModal,
  ScanResultModal
} from '../../modals';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  constructor(
    private modal: ModalController,
    private ble: BLEService,
    private webview: WebViewService,
  ) { }

  ngOnInit() {
  }

  async scan() {
    this.webview.hideApp();

    const modal = await this.modal.create({
      component: ScanQrCodeModal,
      cssClass: 'transparent-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.webview.showApp();

    if (data) {
      // TODO: do stuff here
      alert('QR Code: ' + data);
    }
  }

  async qrcode() {
    const modal = await this.modal.create({
      component: MyQrCodeModal
    });

    modal.present();
  }

  async viewNearby() {
    const modal = await this.modal.create({
      component: ScanResultModal
    });

    modal.present();
  }

}
