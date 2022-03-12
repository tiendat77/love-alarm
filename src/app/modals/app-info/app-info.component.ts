import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FEEDBACK_LINK } from '../../configs/feedback';
import { environment } from '../../../environments/environment';

import { PrivacyPolicyModal } from '../privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-app-info',
  templateUrl: './app-info.component.html',
  styleUrls: ['./app-info.component.scss'],
})
export class AppInfoModal {

  version = environment.VERSION;
  mailto = FEEDBACK_LINK;

  constructor(
    private modalCtrl: ModalController
  ) {}

  close() {
    this.modalCtrl.dismiss();
  }

  async policy() {
    const modal = await this.modalCtrl.create({
      component: PrivacyPolicyModal
    });

    modal.present();
  }

}
