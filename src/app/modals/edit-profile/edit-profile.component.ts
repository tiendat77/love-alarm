import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { UserService } from '../../services';

import { TOPICS } from '../../configs/topic';

function reshape(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

@Component({
  selector: 'app-modal',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileModal {

  userForm = new FormGroup({
    email: new FormControl(this.user.email, Validators.required),
    name: new FormControl(this.user.name, Validators.required),
    bio: new FormControl(this.user.bio),
  });

  interests = {};

  topics = reshape(TOPICS, 4);

  constructor(
    private modalCtrl: ModalController,

    public user: UserService,
  ) {}

  update() {
    // TODO: update user info
    console.log(this.userForm.value);
  }

  uploadPhoto() {
  }

  selectTopic(topic: string) {
    this.interests[topic] = !(!!this.interests[topic]);
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
