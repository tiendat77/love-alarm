import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import {
  CloudDatabaseService,
  ModalsService,
  ToastService,
  UserService
} from '../../services';

import { TOPICS } from '../../configs/topic';
import { UserProfile } from '../../interfaces/user-profile';
import { ObjectHelper } from '../../helpers/object.helper';

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileModal {

  @Input() profile: UserProfile;
  @Input() id: string;
  @Input() isRung = false;

  topics = ObjectHelper.transformArray2Object(TOPICS);

  constructor(
    private readonly user: UserService,
    private readonly data: CloudDatabaseService,
    private readonly modals: ModalsService,
    private readonly toast: ToastService,
    private readonly modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.init();
  }

  private async init() {
    if (!this.id && !this.profile) {
      console.error('No profile or id provided');
      return;
    }

    const profile = await this.data.readProfile(this.id);

    if (!profile) {
      this.toast.show('Error happened');
      this.close();
    }

    this.profile = profile;
  }

  async ring() {
    const confirmed = await this.modals.showConfirmRing(this.profile);

    if (!confirmed) {
      return;
    }

    this.user.ring(this.profile.id).then(() => {
      this.isRung = false;
      setTimeout(() => this.reload(), 1000);
    });
  }

  async unring() {
    const confirmed = await this.modals.showConfirmUnring(this.profile);

    if (!confirmed) {
      return;
    }

    this.user.unring(this.profile.id).then(() => {
      this.isRung = false;
      setTimeout(() => this.reload(), 1000);
    });
  }

  private reload() {
    return this.data.readProfile(this.profile.id).then(profile => {
      if (!profile) {
        return;
      }

      this.profile = profile;
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
