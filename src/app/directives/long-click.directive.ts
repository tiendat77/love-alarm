import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';

import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { delay, repeat, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[longClick]',
})
export class LongClickDirective implements AfterViewInit, OnDestroy {

  @Input() longClickDuration = 1000;
  @Output() longClick = new EventEmitter();

  private mouseDown$: Observable<MouseEvent>;
  private mouseUp$: Observable<MouseEvent>;
  private touchStart$: Observable<any>;
  private touchEnd$: Observable<any>;
  private sub$: Subscription;

  constructor(
    private elementRef: ElementRef
  ) {}

  ngAfterViewInit(): void {
    this.mouseDown$ = fromEvent(this.elementRef.nativeElement, 'mousedown');
    this.mouseUp$ = fromEvent(this.elementRef.nativeElement, 'mouseup');
    this.touchStart$ = fromEvent(this.elementRef.nativeElement, 'touchstart');
    this.touchEnd$ = fromEvent(this.elementRef.nativeElement, 'touchend');

    this.sub$ = merge(this.mouseDown$, this.touchStart$).pipe(
      delay(this.longClickDuration),
      takeUntil(
        merge(this.mouseUp$, this.touchEnd$)
      ),
      repeat(),
    ).subscribe(val => this.longClick.emit());
  }

  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }

}
