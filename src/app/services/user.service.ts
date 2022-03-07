import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {

  id: string | null = 'qert789';
  name: string | null = 'Tiến Đạt Huỳnh';
  avatar: string | null = 'https://avatars.githubusercontent.com/u/37741900?v=4';

  constructor() { }

  set(user: any) {
    this.id = user.id;
    this.name = user.name;
    this.avatar = user.avatar;
  }

  clear() {
    this.id = null;
    this.name = null;
    this.avatar = null;
  }

}
