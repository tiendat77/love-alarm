import { NgModule } from '@angular/core';

/* Angular Modules */
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Ionic Modules */
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';

import { SwiperModule } from 'swiper/angular';

/* Modals */
import { AppInfoModal } from './app-info/app-info.component';
import { ChangePasswordModal } from './change-password/change-password.component';
import { ConfirmRingModal } from './confim-ring/confim-ring.component';
import { DatePickerModal } from './date-picker/date-picker.component';
import { PrivacyPolicyModal } from './privacy-policy/privacy-policy.component';
import { RingersModal } from './ringers/ringers.component';
import { SettingsModal } from './settings/settings.component';
import { ThemesModal } from './themes/themes.component';
import { MyQrCodeModal } from './my-qr-code/my-qr-code.component';
import { ScanResultModal } from './scan-result/scan-result.component';
import { ScanQrCodeModal } from './scan-qr-code/scan-qr-code.component';
import { EditProfileModal } from './edit-profile/edit-profile.component';
import { UserProfileModal } from './user-profile/user-profile.component';

const MODALS = [
  AppInfoModal,
  ChangePasswordModal,
  ConfirmRingModal,
  DatePickerModal,
  EditProfileModal,
  PrivacyPolicyModal,
  RingersModal,
  ScanQrCodeModal,
  ScanResultModal,
  SettingsModal,
  ThemesModal,
  MyQrCodeModal,
  UserProfileModal,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    SwiperModule,
    ComponentsModule,
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
