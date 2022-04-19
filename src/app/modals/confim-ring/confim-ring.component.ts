import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from '../../interfaces/user-profile';

@Component({
  selector: 'app-confim-ring-modal',
  templateUrl: './confim-ring.component.html',
  styleUrls: ['./confim-ring.component.scss'],
})
export class ConfirmRingModal {

  @Input() user: UserProfile;

  constructor(
    private modalCtrl: ModalController
  ) {}

  close() {
    this.modalCtrl.dismiss();
  }

}
