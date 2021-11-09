import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from '../../services/user.service';
import QrCodeWithLogo from 'qrcode-with-logos';

@Component({
  selector: 'app-profile-qr-code',
  templateUrl: './profile-qr-code.component.html',
  styleUrls: ['./profile-qr-code.component.scss'],
})
export class ProfileQrCodeComponent implements AfterViewInit {

  @ViewChild('qrcode') qrcode: ElementRef;

  constructor(
    private user: UserService,
    private toast: ToastService,
    private modalCtrl: ModalController,
  ) { }

  ngAfterViewInit() {
    new QrCodeWithLogo({
      image: this.qrcode.nativeElement,
      content: 'http://lovealarm/u/' +  this.user.info.id,
      width: 500,
      download: false,
      logo: {
        src: this.user.info.avatar
      }
    }).toImage();
  }

  save() {
    const image: string = this.qrcode.nativeElement?.src;

    Filesystem.writeFile({
      data: image,
      path: 'LoveAlarm/love_alarm_' + this.user.info.id + '.png',
      recursive: true,
      directory: Directory.ExternalStorage,
    }).then(() => {
      this.toast.show('Saved your QR Code');
    }).catch(() => {
      this.toast.show('Error occurred while saving your QR Code');
    });
  }

  share() {
    Share.share({
      title: 'My LoveAlarm code',
      url: 'http://lovealarm/u/' +  this.user.info.id,
      dialogTitle: 'Share my code',
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
