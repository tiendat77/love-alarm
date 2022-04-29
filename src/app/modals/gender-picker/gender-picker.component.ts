import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gender-picker-modal',
  templateUrl: './gender-picker.component.html',
  styleUrls: ['./gender-picker.component.scss'],
})
export class GenderPickerModal {

  @Input() gender: string;

  constructor(
    private modalCtrl: ModalController
  ) {}

  select(gender: string) {
    if (!gender) {
      return;
    }

    this.gender = gender;
  }

  apply() {
    this.modalCtrl.dismiss(this.gender);
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
