import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarDirective } from './avatar.directive';
import { RippleDirective } from './ripple.directive';
import { DebounceClickDirective } from './debounce-click.directive';

const DIRECTIVES = [
  AvatarDirective,
  RippleDirective,
  DebounceClickDirective
];

@NgModule({
  imports: [CommonModule],
  exports: [DIRECTIVES],
  declarations: [DIRECTIVES]
})
export class DirectivesModule { }
