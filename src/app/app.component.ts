/** Angular */
import { Component } from '@angular/core';

/** Capacitor */
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/** Ionic */
import { Storage } from '@ionic/storage-angular';
import { MenuController, Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

/** Services */
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
    private audio: NativeAudio,
    private splash: SplashScreenService
  ) {
    this.initialize();
  }

  private initialize() {
    SplashScreen.hide();

    this.platform.ready().then(() => {
      this.welcome();
      this.splash.hide(3);
    });
  }

  private welcome() {
    this.audio.preloadSimple('welcome','/assets/sound/welcome.mp3');
    this.audio.play('welcome').then(() => console.log('done'));
  }

}
