import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import {
  CloudDatabaseService,
  ModalsService,
  UserService
} from '../../services';

import { TOPICS } from '../../configs/topic';
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
  @Input() isRung = false;

  topics = transformArray2Object(TOPICS);

  constructor(
    private readonly user: UserService,
    private readonly data: CloudDatabaseService,
    private readonly modals: ModalsService,
    private readonly modalCtrl: ModalController
  ) {}

  async ring() {
    const confirmed = await this.modals.showConfirmRing(this.profile);

    if (confirmed) {
      await this.user.ring(this.profile.id);
      await this.reload();
    }
  }

  async unring() {
    const confirmed = await this.modals.showConfirmUnring(this.profile);

    if (confirmed) {
      await this.user.unring(this.profile.id);
      this.isRung = false;
      this.reload();
    }
  }

  private reload() {
    return this.data.getSingleUserProfile(this.profile.id)
      .then(profile => {
        this.profile = profile;
      })
      .catch(error => {
        console.error(error);
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
