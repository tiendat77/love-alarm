/** Angular */
import { Component } from '@angular/core';

/** Capacitor */
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/** Ionic */
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage-angular';
import { MenuController, Platform } from '@ionic/angular';

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
  ) {
    this.welcome();
    this.initialize();
  }

  private initialize() {
    this.platform.ready().then(() => {
      SplashScreen.hide();
    });
  }

  private welcome() {
    NativeAudio.preloadSimple('welcome','/assets/sound/welcome.mp3');
    NativeAudio.play('welcome');
  }

}
