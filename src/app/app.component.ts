/** Angular */
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

/** Capacitor */
import { Device } from '@capacitor/device';
import { SplashScreen } from '@capacitor/splash-screen';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { AlertController, ModalController, Platform } from '@ionic/angular';

/* Services */
import {
  AudioService,
  FileService,
  LanguageService,
  LoaderService,
  SplashScreenService,
  StorageService,
  SupabaseService,
  ToastService,
  UserService,
} from './services';

import { SOUND_WELCOME } from './services/audio.service';
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
    private splash: SplashScreenService,
    private storage: StorageService,
    private supabase: SupabaseService,
    private toast: ToastService,

    public user: UserService,
  ) {
    this.supabase.init();
    this.platform.ready().then(() => {
      this.initialize();
    });
  }

  private initialize() {
    this.welcome();

    if (this.platform.is('hybrid')) {
      SplashScreen.hide();
    }

    Device.getInfo().then((value) => {
      console.log('Device Info: ', value);
    });

    this.splash.hide(environment.production ? 3 : 1);
    this.storage.init();

    this.fuckIonic();
  }

  private welcome() {
    this.audio.prepare().then(() => this.audio.play(SOUND_WELCOME));
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
      console.log(event);
      // com.dathuynh.lovealarm://login-callback#access_token
      this.zone.run(() => {
        this.router.navigate(['/']);

        const slug = event.url.split('/')[2];
        if (slug.indexOf('login-callback') !== -1) {
          this.supabase.auth.getSessionFromUrl();
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
