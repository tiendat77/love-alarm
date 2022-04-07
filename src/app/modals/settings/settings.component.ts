import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import {
  AuthorizeService,
  WebViewService,
} from '../../services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsModal {

  constructor(
    public webview: WebViewService,
    private auth: AuthorizeService,

    private router: Router,
    private modalCtrl: ModalController,
  ) {}

  close() {
    this.modalCtrl.dismiss();
  }

  toggleTheme() {
    this.webview.toggleDarkTheme();
  }

  resetPassword() {
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/auth/reset-password');
  }

  signOut() {
    this.auth.signOut();
  }

}
