import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import {
  UserService,
  SupabaseService,
  SharingService,
} from '../../services';

import {
  AppInfoModal,
  SettingsModal,
  ThemesModal,
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
    public sharing: SharingService,
    private supabase: SupabaseService,
  ) {}

  async themes() {
    const modal = await this.modalCtrl.create({
      component: ThemesModal
    });

    modal.present();
  }

  async settings() {
    const modal = await this.modalCtrl.create({
      component: SettingsModal
    });

    modal.present();
  }

  share() {
    this.sharing.shareLink();
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
