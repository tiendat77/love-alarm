import { Component } from '@angular/core';

import { SupabaseService, UserService } from '../../services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  constructor(
    public user: UserService,
    private supabase: SupabaseService,
  ) {}

  themes() {
  }

  settings() {
  }

  signOut() {
    this.supabase.auth.signOut();
  }

}
