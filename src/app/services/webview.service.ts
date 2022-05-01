import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { StatusBar, Style } from '@capacitor/status-bar';

import { StorageService } from './storage.service';
import { PlatformService } from './platform.service';
import { STORAGE_KEY } from '../configs/storage-key';

@Injectable({providedIn: 'root'})
export class WebViewService {

  isDarkTheme = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly meta: Meta,
    private readonly storage: StorageService,
    private readonly platform: PlatformService,
  ) { }

  async init() {
    this.configStatusBar();
    this.isDarkTheme = !!(await this.storage.get(STORAGE_KEY.DARK_THEME));
    this.setTheme(this.isDarkTheme);
  }

  hideApp() {
    const element = this.document.getElementsByTagName('app-container')[0] as HTMLElement;
    if (element) {
      element.style.display = 'none';
    }
  }

  showApp() {
    const element = this.document.getElementsByTagName('app-container')[0] as HTMLElement;
    if (element) {
      element.style.display = null;
    }
  }

  private setTheme(dark: boolean = this.isDarkTheme) {
    if (dark) {
      this.document.body.classList.add('dark-theme');
    } else {
      this.document.body.classList.remove('dark-theme');
    }
  }

  toggleDarkTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.setTheme(this.isDarkTheme);
  }

  private configStatusBar() {
    if (this.platform.isNative) {
      StatusBar.setStyle({style: Style.Dark});
    }
  }

  hideStatusBarOverlay() {
    this.platform.isNative
      ? StatusBar.setOverlaysWebView({overlay: false})
      : this.meta.updateTag({name: 'theme-color',content: '#ffffff'});
  }

  showStatusBarOverlay() {
    this.platform.isNative
        ? StatusBar.setOverlaysWebView({overlay: true})
        : this.meta.updateTag({name: 'theme-color',content: '#f8b6f7'});
  }

}
