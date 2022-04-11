import { Component, EventEmitter, Input, Output } from '@angular/core';

const FROM_YEAR = new Date().getFullYear() - 100;

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {

  days = new Array(30).fill(1).map((value, index) => value + index);
  years = new Array(101).fill(FROM_YEAR).map((value, index) => value + index);
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  _day: number;
  _month: number;
  _year: number;

  @Input() value = new Date();
  @Output() valueChange = new EventEmitter<Date>();

  constructor() { }

  ngOnChanges(changes) {
    if (changes?.value) {
      this._day = this.value.getDate();
      this._month = this.value.getMonth() + 1;
      this._year = this.value.getFullYear() - FROM_YEAR + 1;
    }
  }

  update(type: string, index: number) {
    if (type === 'day') {
      this._day = this.days[index];
      return this.onDateChanged();
    }

    if (type === 'month') {
      this._month = index + 1;
      this.days = this.regenDays();
      this._day = this.maxDayInMonth();
      return this.onDateChanged();
    }

    if (type === 'year') {
      this._year = index + 1;
      this.days = this.regenDays();
      this._day = this.maxDayInMonth();
      return this.onDateChanged();
    }
  }

  private maxDayInMonth() {
    const year = this._year + FROM_YEAR;
    const month = this._month;
    const maxDayInMonth = new Date(year, month, 0).getDate();
    return Math.min(this._day, maxDayInMonth);
  }

  private regenDays() {
    const year = this._year + FROM_YEAR;
    const month = this._month;
    const start = new Date(year, month, 0).getDate();
    return new Array(start).fill(1).map((value, index) => value + index);
  }

  private onDateChanged() {
    const year = this._year + FROM_YEAR - 1;
    const month = this._month - 1;
    const day = this._day;

    this.valueChange.emit(
      new Date(year, month, day)
    );
  }

}
