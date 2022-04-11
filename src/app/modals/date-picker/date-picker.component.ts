import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-date-picker-modal',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerModal {

  date = new Date();

  constructor(
    private modalCtrl: ModalController
  ) {}

  apply() {
    this.modalCtrl.dismiss(this.date);
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
