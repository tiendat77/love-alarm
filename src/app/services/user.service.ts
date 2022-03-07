import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {

  id: string | null;
  name: string | null;
  email: string | null;
  avatar: string | null;

  constructor() { }

  set(id: string, meta: any) {
    if (!id || !meta) {
      return;
    }

    this.id = id;
    this.email = meta.email;
    this.name = meta.name || meta.full_name;
    this.avatar = meta.avatar_url || meta.picture;
  }

  clear() {
    this.id = null;
    this.name = null;
    this.email = null;
    this.avatar = null;
  }

}
