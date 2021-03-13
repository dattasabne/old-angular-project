import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  public loginStatus = false;
  public url:string = '/admin-dashboard';
  constructor() {}
 public isAuthenticated(): boolean {
    return this.loginStatus;
  }
}
