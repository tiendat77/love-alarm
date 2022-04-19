import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { UserProfile } from '../../interfaces/user-profile';
import { ConfirmRingModal } from '../confim-ring/confim-ring.component';
import { UserProfileModal } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-scan-result',
  templateUrl: './scan-result.component.html',
  styleUrls: ['./scan-result.component.scss'],
})
export class ScanResultModal {

  constructor(
    private modalCtrl: ModalController
  ) {}

  async ring(user?: UserProfile) {
    const modal = await this.modalCtrl.create({
      component: ConfirmRingModal,
      componentProps: { user },
      cssClass: 'adaptable'
    });

    await modal.present();
  }

  async viewProfile(user?: UserProfile) {
    const modal = await this.modalCtrl.create({
      component: UserProfileModal,
      componentProps: { user }
    });

    await modal.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
