import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { STORAGE_KEY } from '../../configs/storage-key';
import { LANGUAGES_MAP } from '../../configs/languages';

import {
  AuthorizeService,
  SharingService,
  StorageService,
  WebViewService,
} from '../../services';

import { AppInfoModal } from '../app-info/app-info.component';
import { ChangePasswordModal } from '../change-password/change-password.component';
import { LanguagesModal } from '../languages/languages.component';
import { PrivacyPolicyModal } from '../privacy-policy/privacy-policy.component';
import { ThemesModal } from '../themes/themes.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsModal {

  language: string;
  languageMap = LANGUAGES_MAP;

  constructor(
    public webview: WebViewService,
    private auth: AuthorizeService,
    private storage: StorageService,
    private sharing: SharingService,

    private modalCtrl: ModalController,
  ) {
    this.init();
  }

  async init() {
    this.language = (await this.storage.get(STORAGE_KEY.LANGUAGE)) || 'en';
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async selectLanguage() {
    const modal = await this.modalCtrl.create({
      component: LanguagesModal,
      cssClass: 'adaptable'
    });

    modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.language = data;
    }
  }

  toggleDarkTheme() {
    this.webview.toggleDarkTheme();
  }

  async themes() {
    const modal = await this.modalCtrl.create({
      component: ThemesModal
    });

    modal.present();
  }

  async share() {
    await this.sharing.shareLink();
  }

  async policy() {
    const modal = await this.modalCtrl.create({
      component: PrivacyPolicyModal
    });

    modal.present();
  }

  async info() {
    const modal = await this.modalCtrl.create({
      component: AppInfoModal
    });

    modal.present();
  }

  async resetPassword() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordModal
    });

    modal.present();
  }

  signOut() {
    this.modalCtrl.dismiss();
    this.auth.signOut();
  }

}
