import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';

import {
  CloudDataApiService,
  CloudStorageService,
  LoaderService,
  ToastService,
  UserService
} from '../../services';
import { GenderPickerModal } from '../gender-picker/gender-picker.component';
import { DatePickerModal } from '../date-picker/date-picker.component';
import { UserProfile } from '../../interfaces/user-profile';
import { GENDERS } from '../../configs/genders';
import { TOPICS } from '../../configs/topic';

import { ImageProcess } from '../../helpers/image.helper';
import { NanoIdHelper } from '../../helpers/nanoid.helper';
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
  readonly genders = GENDERS;

  profileForm = new FormGroup({
    email: new FormControl(null, Validators.required),
    name: new FormControl(null, Validators.required),
    gender: new FormControl(null),
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
    private data: CloudDataApiService,
    private storage: CloudStorageService,
    private modalCtrl: ModalController,
  ) {
    this.init();
  }

  private init() {
    this.profileForm.patchValue({
      email: this.user.profile.email,
      name: this.user.profile.name,
      gender: this.user.profile.gender,
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
    const { email, name, gender, birthday, bio, city } = this.profileForm.value;
    const interested = Object.keys(this.interests).filter(topic => this.interests[topic]);

    const profile: UserProfile = {
      ...this.user.profile,
      name,
      gender,
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
    this.data.profile.update(profile)
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

  async uploadPhoto() {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
      });

      const resized = await new ImageProcess(photo.dataUrl).resize(600, 600);

      const name = `${NanoIdHelper.nanoid()}_${Date.now()}`;
      const file = await fetch(resized)
        .then((res) => res.blob())
        .then( (blob) => new File([blob], name, { type: `image/${photo.format}`}));

      this.loader.start();

      // upload to storage
      const path = `${this.user.profile.id}/${name}.${photo.format}`;

      try {
        await this.storage.uploadAvatar(path, file);
      } catch (error) {
        console.error(error);
        this.toast.show('Upload failed, please try again later!');
      }

      const old_avatar = this.user.profile.picture;
      const new_avatar = await this.storage.getAvatarUrl(path);

      // update profile
      await this.data.profile.update({
        ...this.user.profile,
        picture: new_avatar,
      });

      this.user.setProfile({
        ...this.user.profile,
        picture: new_avatar,
      });

      // delete old avatar
      if (old_avatar) {
        const old_path = `${this.user.profile.id}/${old_avatar.split('/').pop()}`;
        await this.storage.deleteAvatar(old_path);
      }

    } catch (error) {
      console.error('[Upload photo] ', error);
    } finally {
      this.loader.stop();
    }
  }

  async openGenderPicker() {
    const modal = await this.modalCtrl.create({
      component: GenderPickerModal,
      componentProps: {
        gender: this.profileForm.value.gender,
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.profileForm.patchValue({
        gender: data,
      });
    }
  }

  async openBirthdayPicker() {
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
