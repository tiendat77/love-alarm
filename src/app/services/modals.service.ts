import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { UserService } from './user.service';
import { UserProfile } from '../interfaces';

import {
  ConfirmRingModal,
  ConfirmUnringModal,
  SettingsModal,
  UserProfileModal
} from '../modals';

@Injectable({ providedIn: 'root' })
export class ModalsService {

  constructor(
    private readonly user: UserService,
    private readonly modalCtrl: ModalController,
  ) { }

  async showUserProfile(id: string) {
    const isRung = !!this.user.profile?.ringings?.includes(id);

    const modal = await this.modalCtrl.create({
      component: UserProfileModal,
      componentProps: {
        id,
        isRung
      }
    });

    await modal.present();
  }

  async showConfirmRing(profile: UserProfile) {
    const modal = await this.modalCtrl.create({
      component: ConfirmRingModal,
      componentProps: { name: profile.name },
      cssClass: 'adaptable'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    return Promise.resolve(data);
  }

  async showConfirmUnring(profile: UserProfile) {
    const modal = await this.modalCtrl.create({
      component: ConfirmUnringModal,
      componentProps: { name: profile.name},
      cssClass: 'adaptable'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    return Promise.resolve(data);
  }

  async showSettings() {
    const modal = await this.modalCtrl.create({
      component: SettingsModal
    });

    modal.present();
  }

}