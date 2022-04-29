import { NgModule } from '@angular/core';

/* Angular Modules */
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HammerModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Ionic Modules */
import { IonicModule } from '@ionic/angular';

/* Modules */
import { ModalsModule } from '../modals/modals.module';
import { PipesModule } from '../pipes/pipes.module';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  imports: [],
  exports: [
    CommonModule,
    RouterModule,
    HammerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    IonicModule,

    ModalsModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
  ],
})
export class SharedModule {}
