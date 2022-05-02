import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confim-unring-modal',
  templateUrl: './confim-unring.component.html',
  styleUrls: ['./confim-unring.component.scss'],
})
export class ConfirmUnringModal {

  @Input() name: string;

  constructor(
    private modalCtrl: ModalController
  ) {}

  close() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    this.modalCtrl.dismiss(true);
  }

}
