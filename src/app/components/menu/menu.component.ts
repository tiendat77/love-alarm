import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import {
  UserService,
  SupabaseService,
} from '../../services';

import {
  AppInfoModal,
} from '../../modals';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  constructor(
    private modalCtrl: ModalController,

    public user: UserService,
    private supabase: SupabaseService,
  ) {}

  themes() {
  }

  settings() {
  }

  share() {
  }

  async info() {
    const modal = await this.modalCtrl.create({
      component: AppInfoModal
    });

    modal.present();
  }

  signOut() {
    this.supabase.auth.signOut();
  }

}
