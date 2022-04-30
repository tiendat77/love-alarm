import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { EditProfileModal, RingersModal } from '../../modals';

import {
  SupabaseService,
  UserService
} from '../../services';

import { TOPICS } from '../../configs/topic';
import { transformArray2Object } from '../../helpers/object.helper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  topics = transformArray2Object(TOPICS);

  constructor(
    public user: UserService,
    public supabase: SupabaseService,

    private modal: ModalController,
  ) { }

  async ringers() {
    const modal = await this.modal.create({
      component: RingersModal,
      componentProps: { profile: this.user.profile }
    });

    modal.present();
  }

  async profile() {
    const modal = await this.modal.create({
      component: EditProfileModal
    });

    modal.present();
  }
}
