import { NgModule } from '@angular/core';

/* Angular Modules */
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Ionic Modules */
import { IonicModule } from '@ionic/angular';

/* Modals */
import { AppInfoModal } from './app-info/app-info.component';
import { PrivacyPolicyModal } from './privacy-policy/privacy-policy.component';

const MODALS = [
  AppInfoModal,
  PrivacyPolicyModal
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
  ],
  declarations: [
    MODALS
  ],
  exports: [
    MODALS
  ],
})
export class ModalsModule {}
