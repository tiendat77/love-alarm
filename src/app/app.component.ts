/** Angular */
import { Component } from '@angular/core';

/** Capacitor */
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/** Ionic */
import { Storage } from '@ionic/storage-angular';
import { MenuController, Platform } from '@ionic/angular';

/** Services */
import { AudioService } from './services/audio.service';
import { SplashScreenService } from './services/splash-screen.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private storage: Storage,
    private platform: Platform,
    private menu: MenuController,
    private audio: AudioService,
    private splash: SplashScreenService,
  ) {
    this.initialize();
  }

  private initialize() {
    SplashScreen.hide();

    this.platform.ready().then(() => {
      this.welcome();
      this.splash.hide();
    });
  }

  private welcome() {
    this.audio.preload('welcome', 'assets/sound/welcome.mp3')
      .then(() => {
        this.audio.play('welcome');
      });
  }

}
