import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NotFoundPage } from './not-found.page';
import { NotFoundPageRoutingModule } from './not-found-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotFoundPageRoutingModule
  ],
  declarations: [NotFoundPage]
})
export class NotFoundPageModule {}
