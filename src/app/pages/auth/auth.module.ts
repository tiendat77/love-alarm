import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../modules/shared.module';
import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth/auth.page';
import { SignInPage } from './sign-in/sign-in.page';
import { SignUpPage } from './sign-up/sign-up.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    SharedModule,
    AuthPageRoutingModule
  ],
  declarations: [
    AuthPage,
    SignInPage,
    SignUpPage,
    ResetPasswordPage,
    ForgotPasswordPage,
  ]
})
export class AuthPageModule {}
