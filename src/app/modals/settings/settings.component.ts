import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import {
  AuthorizeService,
  StorageService,
  WebViewService,
} from '../../services';

import { LanguagesModal } from '../languages/languages.component';
import { ChangePasswordModal } from '../change-password/change-password.component';

import { STORAGE_KEY } from '../../configs/storage-key';
import { LANGUAGES_MAP } from '../../configs/languages';

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

    private router: Router,
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

  toggleTheme() {
    this.webview.toggleDarkTheme();
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
