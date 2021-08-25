/** Angular */
import { Component } from '@angular/core';

/** Capacitor */
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/** Ionic */
import { Storage } from '@ionic/storage-angular';
import { MenuController, Platform } from '@ionic/angular';
import { AndroidFullScreen, AndroidSystemUiFlags } from '@ionic-native/android-full-screen/ngx';

/** Services */
import { UserService } from './services/user.service';
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
    private fullscreen: AndroidFullScreen,

    public user: UserService,
    private audio: AudioService,
    private splash: SplashScreenService,
  ) {
    this.initialize();
  }

  private initialize() {
    this.platform.ready().then(() => {
      this.welcome();
      this.splash.hide();
      SplashScreen.hide();
      StatusBar.setOverlaysWebView({overlay: true});
      StatusBar.setBackgroundColor({color: '#33000000'});
    });
  }

  private hideUI() {
    this.fullscreen.setSystemUiVisibility(
      AndroidSystemUiFlags.ImmersiveSticky |
      AndroidSystemUiFlags.LayoutStable |
      AndroidSystemUiFlags.LayoutHideNavigation |
      AndroidSystemUiFlags.LayoutFullscreen |
      AndroidSystemUiFlags.HideNavigation |
      AndroidSystemUiFlags.Fullscreen
    );
  }

  private welcome() {
    this.audio.preload('welcome', 'assets/sound/welcome.mp3')
      .then(() => {
        this.audio.play('welcome');
      });
  }

}
