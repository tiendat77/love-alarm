import { ChangeDetectorRef, Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { StorageService } from '../../services';
import { STORAGE_KEY } from '../../configs/storage-key';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
})
export class LanguagesModal {

  language: string;

  constructor(
    private storage: StorageService,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    this.language = (await this.storage.get(STORAGE_KEY.LANGUAGE)) || 'en';
    this.cdr.detectChanges();
  }

  select(language: string) {
    if (!language) {
      return;
    }

    this.storage.set(STORAGE_KEY.LANGUAGE, language);
    this.modalCtrl.dismiss(language);
  }

}
