import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeartsComponent } from './hearts/hearts.component';
import { ScanningComponent } from './scanning/scanning.component';

@NgModule({
  declarations: [
    HeartsComponent,
    ScanningComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeartsComponent,
    ScanningComponent
  ]
})
export class ComponentsModule { }
