import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

import { PermissionsPage } from './permissions.page';
import { PermissionsPageRoutingModule } from './permissions-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    PermissionsPageRoutingModule
  ],
  declarations: [PermissionsPage]
})
export class PermissionsPageModule {}
