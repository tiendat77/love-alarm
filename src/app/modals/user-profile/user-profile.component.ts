import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from '../../interfaces/user-profile';

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileModal {

  @Input() user: UserProfile;

  constructor(
    private modalCtrl: ModalController
  ) {}

  close() {
    this.modalCtrl.dismiss();
  }

}
