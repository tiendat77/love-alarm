import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { EditProfileModal, RingersModal } from '../../modals';

import {
  ModalsService,
  SupabaseService,
  UserService
} from '../../services';

import { TOPICS } from '../../configs/topic';
import { ObjectHelper } from '../../helpers/object.helper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  topics = ObjectHelper.transformArray2Object(TOPICS);

  constructor(
    public user: UserService,
    public supabase: SupabaseService,

    private modals: ModalsService,
    private modal: ModalController,
  ) { }

  settings() {
    this.modals.showSettings();
  }

  async ringers(tab = 'ringers') {
    const modal = await this.modal.create({
      component: RingersModal,
      componentProps: {
        tab,
        profile: this.user.profile,
      }
    });

    modal.present();
  }

  async profile() {
    const modal = await this.modal.create({
      component: EditProfileModal
    });

    modal.present();
  }

  async react(user, action) {

  }
}
