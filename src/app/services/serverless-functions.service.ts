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
    return this.post('user/ring', user);
  }

  unring(user: any) {
    return this.post('user/unring', user);
  }

  message(user: any, message: string) {
    return this.post('user/message', { id: user.id, message });
  }

  private post(api: string, body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`,
    });

    return this.http.post(
      `${this.serverlessUrl}/${api}`,
      body,
      {headers}
    );
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