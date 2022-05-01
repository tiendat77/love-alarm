import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServerlessService {

  private serverlessUrl: string;
  private token: string;

  constructor(
    private http: HttpClient
  ) { }

  init() {
    this.serverlessUrl = environment.serverlessUrl;
  }

  ring(user: any) {
    return this.http.post(`${this.serverlessUrl}/user/ring`, user, {
      headers: this.getHttpHeaders(),
    });
  }

  unring(user: any) {
    return this.http.post(`${this.serverlessUrl}/user/unring`, user, {
      headers: this.getHttpHeaders(),
    });
  }

  private getHttpHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`,
    });
  }

  private getToken() {
    const _session = localStorage.getItem('supabase.auth.token');

    if (!_session) {
      return null;
    }

    const session = JSON.parse(_session);
    return session?.currentSession?.access_token || null;
  }

}