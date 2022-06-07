import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bluetooth-is-off',
  templateUrl: './bluetooth-is-off.component.html',
  styleUrls: ['./bluetooth-is-off.component.scss'],
})
export class BluetoothIsOffModal {

  constructor(
    private modalCtrl: ModalController
  ) {}

  close() {
    this.modalCtrl.dismiss(false);
  }

  enable() {
    this.modalCtrl.dismiss(true);
  }

}
