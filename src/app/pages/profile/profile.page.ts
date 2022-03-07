import { Component } from '@angular/core';

import { SupabaseService, UserService } from '../../services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  constructor(
    public user: UserService,
    public supabase: SupabaseService,
  ) { }

}
