import { Component, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';

export type WheelType = 'day' | 'month' | 'year';

@Component({
  selector: 'app-date-picker-wheel',
  templateUrl: './date-picker-wheel.component.html',
  styleUrls: ['./date-picker-wheel.component.scss'],
})
export class DatePickerWheelComponent {

  @Input() value = 2; // index of activated options
  @Input() options = [];
  @Input() type: WheelType = 'day';
  @Output() scrolled = new EventEmitter();

  private position: number = -50;
  private previousY: number;
  private offset: number = 5;
  private dragging: boolean;

  private mouseUpFn;
  private mouseMoveFn;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    const position = -(this.value - 1) * 50;

    if (!this.dragging && this.position !== position) {
      this.position = position;
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    this.mouseMoveFn = (event) => {
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      this.offset = clientY - this.previousY;

      const maxPosition = -this.options.length * 50;
      const position = this.position + this.offset;

      this.position = Math.max(maxPosition, Math.min(50, position));
      this.previousY = event.touches ? event.touches[0].clientY : event.clientY;
      this.cdr.detectChanges();
    }

    this.mouseUpFn = (event) => {
      const maxPosition = -(this.options.length - 1) * 50;
      const rounderPosition = Math.round((this.position + this.offset * 5) / 50) * 50;
      const finalPosition = Math.max(maxPosition, Math.min(0, rounderPosition));

      this.dragging = false;
      this.position = finalPosition;
      this.cdr.detectChanges();

      this.removeEvents();
      this.scrolled.emit(-finalPosition / 50);
    }
  }

  onMouseDown(event) {
    this.previousY = event.touches ? event.touches[0].clientY : event.clientY;
    this.dragging = true;
    this.addEvents();
  }

  getTransition() {
    return `transform ${Math.abs(this.offset) / 100 + 0.1}s`;
  }

  getTransform() {
    return `translateY(${this.position}px)`;
  }

  trackByFn(index: number, item: any) {
    return index;
  }

  private addEvents() {
    document.addEventListener('mouseup', this.mouseUpFn);
    document.addEventListener('mousemove', this.mouseMoveFn);
    document.addEventListener('touchend', this.mouseUpFn);
    document.addEventListener('touchmove', this.mouseMoveFn);
  }

  private removeEvents() {
    document.removeEventListener('mouseup', this.mouseUpFn);
    document.removeEventListener('mousemove', this.mouseMoveFn);
    document.removeEventListener('touchend', this.mouseUpFn);
    document.removeEventListener('touchmove', this.mouseMoveFn);
  }

}
