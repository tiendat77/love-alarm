import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import moment from 'moment';

import {
  CloudDatabaseService,
  LoaderService,
  ToastService,
  UserService
} from '../../services';
import { DatePickerModal } from '../date-picker/date-picker.component';
import { UserProfile } from '../../interfaces/user-profile';
import { TOPICS } from '../../configs/topic';

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
    city: new FormControl(null),
  });

  interests = {};
  joindate = null;

  constructor(
    public user: UserService,
    private toast: ToastService,
    private loader: LoaderService,
    private data: CloudDatabaseService,
    private modalCtrl: ModalController,
  ) {
    this.init();
  }

  private init() {
    this.profileForm.patchValue({
      email: this.user.profile.email,
      name: this.user.profile.name,
      bio: this.user.profile.bio,
      city: this.user.profile.city,
      birthday: this.string2Date(this.user.profile.birthday),
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
    const { email, name, birthday, bio, city } = this.profileForm.value;
    const interested = Object.keys(this.interests).filter(topic => this.interests[topic]);

    const profile: UserProfile = {
      ...this.user.profile,
      name,
      bio,
      city,
      interested,
      birthday: birthday ? birthday.toISOString() : null,
    };

    return profile;
  }

  update() {
    const profile = this.getProfileFormValue();

    if (!profile.name) {
      this.toast.show('Name is required');
      return;
    }

    this.loader.start();
    this.data.updateProfile(profile)
    .then(() => {
      this.loader.stop();
      this.user.setProfile(profile);
      this.toast.show('Profile updated');
      this.modalCtrl.dismiss();
    })
    .catch(error => {
      console.log(error);
      this.loader.stop();
      this.toast.show('Update failed, please try again later!');
    });
  }

  uploadPhoto() {
  }

  async openDatePicker() {
    const modal = await this.modalCtrl.create({
      component: DatePickerModal,
      componentProps: {
        date: this.profileForm.value.birthday || new Date(),
      }
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
