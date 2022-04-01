import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { EditProfileModal, RingersModal } from '../../modals';

import {
  SupabaseService,
  UserService
} from '../../services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  constructor(
    public user: UserService,
    public supabase: SupabaseService,

    private modal: ModalController,
  ) { }

  async ringers() {
    const modal = await this.modal.create({
      component: RingersModal
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
