import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  info: User = {
    id: 'qert789',
    name: 'Tiến Đạt Huỳnh',
    birthday: 868233600
  };

  constructor() { }

}
