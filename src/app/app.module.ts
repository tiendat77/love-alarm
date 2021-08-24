import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from './common/common.module';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ComponentsModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
  ],
  providers: [
    NativeAudio,
    BarcodeScanner,
    AndroidFullScreen,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: []
})
export class AppModule {}
