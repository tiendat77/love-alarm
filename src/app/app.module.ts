import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

/* Ionic */
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';

/* Modules */
import { TranslateModule } from '@ngx-translate/core';
import { TranslateProvider } from './configs/translate';
import { SharedModule } from './modules/shared.module';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    SharedModule,
    ComponentsModule,
    AppRoutingModule,

    IonicStorageModule.forRoot({
      driverOrder: [
        Drivers.IndexedDB,
        Drivers.LocalStorage
      ]
    }),

    IonicModule.forRoot({
      mode: 'ios',
      _forceStatusbarPadding: true
    }),

    TranslateModule.forRoot({loader: TranslateProvider}),

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    BLE,
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
export class AppModule { }
