import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
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
    const permission = await Camera.requestPermissions();

    if (permission.camera !== 'granted') {
      return false;
    }

    await BarcodeScanner.prepare();
    return true;
  }

  async scan() {
    const success = await this.prepare();

    if (!success) {
      this.modalCtrl.dismiss(null);
      return;
    }

    // make background of WebView transparent
    await BarcodeScanner.hideBackground();

    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      const code = this.validate(result.content);
      this.modalCtrl.dismiss(code);
    }
  }

  private validate(code: string) {
    // com.dathuynh.lovealarm://profile/<user_id>
    if (!code) {
      return null;
    }

    if (code.indexOf('com.dathuynh.lovealarm://profile/') !== 0) {
      return null;
    }

    // return user_id
    return code.replace('com.dathuynh.lovealarm://profile/', '');
  }

  async stop() {
    await BarcodeScanner.showBackground();
    await BarcodeScanner.stopScan();
  }

  torch() {
    BarcodeScanner.toggleTorch();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
