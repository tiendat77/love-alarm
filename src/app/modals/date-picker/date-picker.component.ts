import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-date-picker-modal',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerModal {

  @Input() date = new Date();

  constructor(
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController
  ) {}

  apply() {
    this.modalCtrl.dismiss(this.date);
  }

  // fix change detection on mobile devices
  onDateChanged() {
    this.cdr.detectChanges();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
