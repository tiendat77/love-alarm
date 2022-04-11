import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { CloudDatabaseService, UserService } from '../../services';
import { UserProfile } from '../../interfaces/user-profile';
import { TOPICS } from '../../configs/topic';

import { DatePickerModal } from '../date-picker/date-picker.component';

import moment from 'moment';

function reshape(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileModal {

  readonly topics = reshape(TOPICS, 4);

  profileForm = new FormGroup({
    email: new FormControl(null, Validators.required),
    name: new FormControl(null, Validators.required),
    birthday: new FormControl(null),
    bio: new FormControl(null),
  });

  interests = {};
  joindate = null;

  constructor(
    public user: UserService,
    private data: CloudDatabaseService,
    private modalCtrl: ModalController,
  ) {
    this.init();
  }

  private init() {
    this.profileForm.patchValue({
      email: this.user.profile.email,
      name: this.user.profile.name,
      birthday: this.string2Date(this.user.profile.birthday),
      bio: this.user.profile.bio,
    });

    this.user.profile.interested.forEach(topic => {
      this.interests[topic] = true;
    });

    this.joindate = this.string2Date(this.user.profile.joindate);
  }

  private string2Date(date: string) {
    if (!date) {
      return null;
    }

    return moment(date).toDate();
  }

  private getProfileFormValue() {
    const { email, name, birthday, bio } = this.profileForm.value;
    const interested = Object.keys(this.interests).filter(topic => this.interests[topic]);

    const profile: UserProfile = {
      ...this.user.profile,
      name,
      bio,
      birthday: birthday ? birthday.toISOString() : null,
      interested,
    };

    return profile;
  }

  update() {
    // TODO: update user info
    console.log(this.getProfileFormValue());
  }

  uploadPhoto() {
  }

  async openDatePicker() {
    const modal = await this.modalCtrl.create({
      component: DatePickerModal,
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.profileForm.patchValue({
        birthday: data,
      });
    }
  }

  selectTopic(topic: string) {
    this.interests[topic] = !(!!this.interests[topic]);
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
