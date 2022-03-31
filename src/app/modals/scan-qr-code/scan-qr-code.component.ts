import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-scan-qr-code',
  templateUrl: './scan-qr-code.component.html',
  styleUrls: ['./scan-qr-code.component.scss'],
})
export class ScanQrCodeModal {

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.scan();
  }

  ngOnDestroy() {
    this.stop();
  }

  async prepare() {
    await BarcodeScanner.prepare();
    const permission = await BarcodeScanner.checkPermission({ force: true });

    if (permission.denied) {
      this.modalCtrl.dismiss(null);
    }
  }

  async scan() {
    await this.prepare();

    // make background of WebView transparent
    await BarcodeScanner.hideBackground();

    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      this.modalCtrl.dismiss(result.content);
    }
  }

  async stop() {
    await BarcodeScanner.showBackground();
    await BarcodeScanner.stopScan();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
