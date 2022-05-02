import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgePipe } from './age.pipe';
import { AbbreviatePipe } from './abbreviate.pipe';

const PIPES = [
  AgePipe,
  AbbreviatePipe,
];

@NgModule({
  imports: [CommonModule],
  exports: [PIPES],
  declarations: [PIPES]
})
export class PipesModule { }
