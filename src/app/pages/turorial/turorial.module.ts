import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TurorialPage } from './turorial.page';
import { TurorialPageRoutingModule } from './turorial-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TurorialPageRoutingModule
  ],
  declarations: [TurorialPage]
})
export class TurorialPageModule {}
