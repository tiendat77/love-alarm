/** Angular */
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

/** Capacitor */
import { SplashScreen } from '@capacitor/splash-screen';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { AlertController, ModalController, Platform } from '@ionic/angular';

/* Services */
import {
  AudioService,
  BLEService,
  FileService,
  LanguageService,
  LoaderService,
  NotificationService,
  SplashScreenService,
  StorageService,
  SupabaseService,
  ToastService,
  UserService,
  WebViewService,
} from './services';

import { SOUNDS } from './services/audio.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private zone: NgZone,
    private router: Router,
    private platform: Platform,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,

    // Services
    private audio: AudioService,
    private file: FileService,
    private language: LanguageService,
    private loader: LoaderService,
    private notification: NotificationService,
    private splash: SplashScreenService,
    private storage: StorageService,
    private supabase: SupabaseService,
    private toast: ToastService,
    private ble: BLEService,
    private webview: WebViewService,
    private user: UserService,
  ) {
    this.storage.init();
    this.webview.init();
    this.supabase.init();
    this.notification.init();

    this.platform.ready().then(() => {
      this.initialize();
    });
  }

  private async initialize() {
    if (this.platform.is('hybrid')) {
      SplashScreen.hide();
    }

    this.welcome();
    this.fuckIonic();
    this.splash.hide();
  }

  private async welcome() {
    await this.audio.prepare();
    await this.audio.play(SOUNDS.welcome);
  }

  private fuckIonic() {
    // Auto scroll to selected item in list
    window.addEventListener('ionAlertDidPresent', e => {
      const selected = (e.target as HTMLElement).querySelector('[aria-checked="true"]');
      selected && selected.scrollIntoView();
    });

    // Catch back button event
    this.platform.backButton.subscribeWithPriority(5, () => {
      this.exit();
    });

    App.addListener('backButton', () => {
      this.modalCtrl.dismiss();
    });

    // Deep link
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(async () => {
        // com.dathuynh.lovealarm://login-callback/#access_token
        const slug = event.url.split('/')[2];

        if (slug.indexOf('login-callback') !== -1) {
          this.splash.show();

          const params = new URL(event.url).hash;
          const access_token = params.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
          const refresh_token = params.match(/\&(?:refresh_token)\=([\S\s]*?)\&/)[1];
          await this.supabase.auth.setAuth(access_token, refresh_token);

          this.router.navigate(['/']);
          this.splash.hide(1);
        }
        // If no match, do nothing - let regular routing logic take over
      });
    });
  }

  private async exit() {
    const alert = await this.alertCtrl.create({
      header: 'Exit Love Alarm?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Exit',
          handler: () => {
            App.exitApp();
          }
        }
      ]
    });

    await alert.present();
  }

}
