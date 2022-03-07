import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';

import { Language } from '../interfaces/language';
import { STORAGE_KEY } from '../configs/storage-key';

export const SUPPORTED_LANGUAGES: Language[] = [
  { value: 'en', display: 'English' },
  { value: 'vi', display: 'Vietnamese' }
];

@Injectable({ providedIn: 'root' })
export class LanguageService {

  currentLanguage = new BehaviorSubject<Language>({ value: 'vi', display: 'Vietnamese' });

  constructor(
    private storage: StorageService,
    private translate: TranslateService,
  ) { }

  initialize() {
    this.translate.setDefaultLang('vi');

    this.storage.get(STORAGE_KEY.LANGUAGE).then(lang => {
      if (lang) {
        const selectedLanguage = SUPPORTED_LANGUAGES.filter(d => d.value === lang)[0];
        this.currentLanguage.next(selectedLanguage);
        this.translate.use(lang);
      } else {
        this.changeLanguage({ value: 'vi', display: 'Vietnamese' });
      }
    });
  }

  public changeLanguage(lang: Language) {
    this.translate.use(lang.value);
    this.storage.set(STORAGE_KEY.LANGUAGE, lang.value);
    this.currentLanguage.next(lang);
  }

}