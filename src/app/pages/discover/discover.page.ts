import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';

import {
  BLEService,
  CloudDataApiService,
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
    private readonly data: CloudDataApiService,
    private readonly loader: LoaderService,
    private readonly modals: ModalsService,
    private readonly webview: WebViewService,
    private readonly platform: PlatformService,
    private readonly router: Router,
    private readonly modalCtrl: ModalController,
    private readonly actionSheetCtrl: ActionSheetController,
  ) { }

  ngOnDestroy() {
    this.ble.stop();
    this.scanSubscription$?.unsubscribe();
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
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

  async startScan() {
    if (this.platform.isNative) {
      const isEnable = await this.ble.checkStatus();

      if (!isEnable) {
        return;
      }

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
      this.data.profile.listAll('id')
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
      const profiles: UserProfile[] = await this.data.profile.readMultiBasic(users);
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
