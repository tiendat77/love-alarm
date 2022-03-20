import { NgModule } from '@angular/core';

/* Angular Modules */
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Ionic Modules */
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '../directives/directives.module';

/* Modals */
import { AppInfoModal } from './app-info/app-info.component';
import { PrivacyPolicyModal } from './privacy-policy/privacy-policy.component';
import { RingersModal } from './ringers/ringers.component';
import { SettingsModal } from './settings/settings.component';
import { ThemesModal } from './themes/themes.component';
import { MyQrCodeModal } from './my-qr-code/my-qr-code.component';

const MODALS = [
  AppInfoModal,
  PrivacyPolicyModal,
  RingersModal,
  SettingsModal,
  ThemesModal,
  MyQrCodeModal,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    DirectivesModule,
  ],
  declarations: [
    MODALS
  ],
  exports: [
    MODALS
  ],
})
export class ModalsModule {}
