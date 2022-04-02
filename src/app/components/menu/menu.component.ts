import { Component } from '@angular/core';
import { ModalController, MenuController } from '@ionic/angular';

import {
  UserService,
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
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,

    public user: UserService,
    public sharing: SharingService,
  ) {}

  private closeMenuDrawer() {
    this.menuCtrl.close();
  }

  async themes() {
    this.closeMenuDrawer();

    const modal = await this.modalCtrl.create({
      component: ThemesModal
    });

    modal.present();
  }

  async settings() {
    this.closeMenuDrawer();

    const modal = await this.modalCtrl.create({
      component: SettingsModal
    });

    modal.present();
  }

  share() {
    this.closeMenuDrawer();
    this.sharing.shareLink();
  }

  async info() {
    this.closeMenuDrawer();

    const modal = await this.modalCtrl.create({
      component: AppInfoModal
    });

    modal.present();
  }

}
