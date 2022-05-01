import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CloudDatabaseService } from './cloud-database.service';
import { WebViewService } from './webview.service';

import { UserProfileModal } from '../modals';
import { UserProfile } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ModalsService {

  constructor(
    private readonly data: CloudDatabaseService,
    private readonly webview: WebViewService,
    private readonly modalCtrl: ModalController,
  ) { }

  async showUserProfile(id: string) {
    try {
      this.webview.hideStatusBarOverlay();

      const profile: UserProfile = await this.data.getSingleUserProfile(id);

      const modal = await this.modalCtrl.create({
        component: UserProfileModal,
        componentProps: {
          profile,
          allowRing: true
        }
      });

      await modal.present();

    } catch (error) {
      console.error(error);
    }
  }

}