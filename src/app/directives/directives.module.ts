import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarDirective } from './avatar.directive';
import { RippleDirective } from './ripple.directive';
import { DebounceClickDirective } from './debounce-click.directive';
import { ScrollAnimateDirective } from './scroll-animate.directive';

const DIRECTIVES = [
  AvatarDirective,
  RippleDirective,
  DebounceClickDirective,
  ScrollAnimateDirective,
];

@NgModule({
  imports: [CommonModule],
  exports: [DIRECTIVES],
  declarations: [DIRECTIVES]
})
export class DirectivesModule { }
