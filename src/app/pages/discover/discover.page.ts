import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';

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
    public ble: BLEService,
    private webview: WebViewService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
  ) { }

  ngOnInit() {
  }

  async scanWithQrCode() {
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'action-sheet',
      buttons: [
        {
          text: 'Scan QR Code',
          icon: 'la-scan-qrcode',
          handler: () => {
            this.scanQrCode();
          }
        },
        {
          text: 'My QR Code',
          icon: 'la-my-qrcode',
          handler: () => {
            this.myQrcode();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async scanQrCode() {
    this.webview.hideApp();

    const modal = await this.modalCtrl.create({
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

  async myQrcode() {
    const modal = await this.modalCtrl.create({
      component: MyQrCodeModal
    });

    modal.present();
  }

  async startScan() {
    this.ble.start();
  }

  async viewNearby() {
    const modal = await this.modalCtrl.create({
      component: ScanResultModal
    });

    modal.present();
  }

}
