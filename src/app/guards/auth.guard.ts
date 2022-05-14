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
    const isSignedIn = !!this.currentSession() || !!this.supabase.session?.user;

    if (!isSignedIn) {
      this.router.navigate(['/auth']);
    }

    return isSignedIn;
  }

  private currentSession() {
    const _session = localStorage.getItem('supabase.auth.token');
    const session = JSON.parse(_session);
    return session?.currentSession || null;
  }

}
