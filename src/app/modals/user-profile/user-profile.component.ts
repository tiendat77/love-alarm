import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { TOPICS } from '../../configs/topic';
import { UserProfile } from '../../interfaces/user-profile';
import { transformArray2Object } from '../../helpers/object.helper';

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileModal {

  @Input() user: UserProfile;

  topics = transformArray2Object(TOPICS);

  constructor(
    private modalCtrl: ModalController
  ) {}

  close() {
    this.modalCtrl.dismiss();
  }

}
