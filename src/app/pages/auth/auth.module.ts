import { NgModule } from '@angular/core';

import { SharedModule } from '../../modules/shared.module';
import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth/auth.page';
import { SignInPage } from './sign-in/sign-in.page';
import { SignUpPage } from './sign-up/sign-up.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';

@NgModule({
  imports: [
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
