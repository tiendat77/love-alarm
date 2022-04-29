import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgePipe } from './age.pipe';

const PIPES = [
  AgePipe,
];

@NgModule({
  imports: [CommonModule],
  exports: [PIPES],
  declarations: [PIPES]
})
export class PipesModule { }
