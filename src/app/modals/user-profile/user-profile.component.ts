import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ConfirmRingModal } from '../confim-ring/confim-ring.component';

import { TOPICS } from '../../configs/topic';
import { CloudDatabaseService, UserService } from '../../services';
import { UserProfile } from '../../interfaces/user-profile';
import { transformArray2Object } from '../../helpers/object.helper';

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileModal {

  @Input() profile: UserProfile;
  @Input() allowRing = false;

  topics = transformArray2Object(TOPICS);

  constructor(
    private readonly user: UserService,
    private readonly data: CloudDatabaseService,
    private readonly modalCtrl: ModalController
  ) {}

  async ring() {
    const modal = await this.modalCtrl.create({
      component: ConfirmRingModal,
      componentProps: { name: this.profile.name },
      cssClass: 'adaptable'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.user.ring(this.profile.id);
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
