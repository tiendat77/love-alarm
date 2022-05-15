import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { DirectivesModule } from '../directives/directives.module';

import { CardMatchingComponent } from './card-matching/card-matching.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DatePickerWheelComponent } from './date-picker-wheel/date-picker-wheel.component';
import { GenderComponent } from './gender/gender.component';
import { MenuComponent } from './menu/menu.component';
import { ContainerComponent } from './container/container.component';
import { NavigationComponent } from './navigation/navigation.component';

const COMPONENTS = [
  CardMatchingComponent,
  DatePickerComponent,
  DatePickerWheelComponent,
  GenderComponent,
  MenuComponent,
  ContainerComponent,
  NavigationComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,

    DirectivesModule,
  ],
  exports: [
    COMPONENTS
  ],
  declarations: [
    COMPONENTS
  ],
})
export class ComponentsModule { }
