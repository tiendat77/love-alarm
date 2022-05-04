import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ModalsService, UserService } from '../../services';
import { UserProfile } from '../../interfaces/user-profile';

@Component({
  selector: 'app-scan-result',
  templateUrl: './scan-result.component.html',
  styleUrls: ['./scan-result.component.scss'],
})
export class ScanResultModal {

  @Input() profiles: UserProfile[] = [];

  activeProfile: UserProfile;

  constructor(
    private readonly user: UserService,
    private readonly modals: ModalsService,
    private readonly modalCtrl: ModalController
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
    const confirmed = await this.modals.showConfirmRing(profile);

    if (!confirmed) {
      return;
    }

    this.user.ring(profile.id);
  }

  async viewProfile(profile?: UserProfile) {
    await this.modals.showUserProfile(profile.id);
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
