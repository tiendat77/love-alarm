import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { STORAGE_KEY } from '../configs/storage-key';

export type Scheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private _scheme: Scheme = 'light';

  get scheme(): Scheme {
    return this._scheme;
  }

  set scheme(scheme: Scheme) {
    this._scheme = scheme;
    this.setScheme(scheme);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  init() {
    const scheme = localStorage.getItem(STORAGE_KEY.SCHEME);
    if (scheme === 'light' || scheme === 'dark') {
      this.scheme = scheme as Scheme;
    } else {
      this.scheme = 'light';
    }
  }

  toggle() {
    this.scheme = this.scheme === 'light' ? 'dark' : 'light';
  }

  isDark(): boolean {
    return this.scheme === 'dark';
  }

  private setScheme(scheme: Scheme) {
    this.document.body.classList.remove('light-theme', 'dark-theme');
    this.document.body.classList.add(`${scheme}-theme`);
    localStorage.setItem(STORAGE_KEY.SCHEME, scheme);
  }

}