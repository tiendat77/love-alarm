import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { SupabaseService } from '../services/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly supabase: SupabaseService,
  ) {}

  canActivate(): boolean {
    const isSignedIn = !!this.supabase.session?.user;

    if (!isSignedIn) {
      this.router.navigate(['/auth']);
    }

    return isSignedIn;
  }
}
