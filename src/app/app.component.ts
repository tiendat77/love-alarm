/** Angular */
import { Component } from '@angular/core';

/** Capacitor */
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
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
      StatusBar.setOverlaysWebView({overlay: true});
      StatusBar.setBackgroundColor({color: '#33000000'});
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
