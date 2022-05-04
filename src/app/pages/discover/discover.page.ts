import { Component } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';

import {
  BLEService,
  CloudDatabaseService,
  LoaderService,
  ModalsService,
  PlatformService,
  WebViewService
} from '../../services';

import {
  MyQrCodeModal,
  ScanQrCodeModal,
  ScanResultModal
} from '../../modals';

import { UserProfile } from '../../interfaces';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage {

  private scanSubscription$;

  constructor(
    public readonly ble: BLEService,
    private readonly data: CloudDatabaseService,
    private readonly loader: LoaderService,
    private readonly modals: ModalsService,
    private readonly webview: WebViewService,
    private readonly platform: PlatformService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
  ) { }

  ngOnDestroy() {
    this.ble.stop();
    this.scanSubscription$?.unsubscribe();
  }

  settings() {
    this.modals.showSettings();
  }

  async scanWithQrCode() {
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'action-sheet',
      buttons: [
        {
          text: 'Scan QR Code',
          handler: () => {
            this.scanQrCode();
          }
        },
        {
          text: 'My QR Code',
          handler: () => {
            this.myQrcode();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async scanQrCode() {
    this.webview.hideApp();

    const modal = await this.modalCtrl.create({
      component: ScanQrCodeModal,
      cssClass: 'transparent-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.webview.showApp();

    if (data) {
      this.modals.showUserProfile(data);
    }
  }

  async myQrcode() {
    const modal = await this.modalCtrl.create({
      component: MyQrCodeModal
    });

    modal.present();
  }

  startScan() {
    if (this.platform.isNative) {
      this.scanSubscription$ = this.ble.scan().subscribe(profiles => {
        console.log('scan complete', profiles);
        if (!profiles || !profiles.length) {
          return;
        }

        this.showNearbyUsers(profiles);
      });

    // list user profiles from database if not on mobile
    } else {
      this.ble.isScanning = true;
      this.data.listProfiles('id')
        .then(profiles => {
          if (!profiles || !profiles.length) {
            return;
          }

          this.ble.isScanning = false;
          this.showNearbyUsers(profiles.map(profile => profile.id));
        })
        .catch(error => {
          console.error(error);
          this.ble.isScanning = false;
        });
    }
  }

  private async showNearbyUsers(users: string[]) {
    if (!users || !users.length) {
      return;
    }

    try {
      this.loader.start();
      const profiles: UserProfile[] = await this.data.getMultiUserProfile(users);
      this.loader.stop();

      const modal = await this.modalCtrl.create({
        component: ScanResultModal,
        componentProps: {
          profiles
        }
      });

      modal.present();

    } catch (error) {
      console.error(error);
      this.loader.stop();
    }
  }

}
