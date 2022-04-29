import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { UserProfile } from '../../interfaces/user-profile';
import { ConfirmRingModal } from '../confim-ring/confim-ring.component';
import { UserProfileModal } from '../user-profile/user-profile.component';

const MOCK_PROFILE: UserProfile = {
  id: '',
  name: 'Lee Ji-eun',
  email: 'jieunlee@gmail.com',
  bio: 'Beauty Queen',
  city: 'Seoul',
  picture: 'https://i.pinimg.com/564x/08/b9/7c/08b97c85e5794cda9da13fdc70577e5e.jpg',
};

@Component({
  selector: 'app-scan-result',
  templateUrl: './scan-result.component.html',
  styleUrls: ['./scan-result.component.scss'],
})
export class ScanResultModal {

  @Input() profiles: UserProfile[] = [];

  activeProfile: UserProfile;

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    if (this.profiles.length === 0) {
      setTimeout(() => {
        this.close();
      }, 750);

    } else {
      this.activeProfile = this.profiles[0];
    }
  }

  select(profile: UserProfile) {
    this.activeProfile = profile;
  }

  async ring(profile: UserProfile) {
    const modal = await this.modalCtrl.create({
      component: ConfirmRingModal,
      componentProps: { name: profile.name },
      cssClass: 'adaptable'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      // TODO: ring her/him alarm
    }
  }

  async viewProfile(profile?: UserProfile) {
    const modal = await this.modalCtrl.create({
      component: UserProfileModal,
      componentProps: { profile }
    });

    await modal.present();
  }

  fetchProfileImageError(event) {
    const gender = this.activeProfile.gender;

    let image = 'profile-others';

    if (gender === 'male') {
      image = 'profile-male';
    }

    if (gender === 'female') {
      image = 'profile-female';
    }

    event.target.src = `assets/images/${image}.svg`;
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
