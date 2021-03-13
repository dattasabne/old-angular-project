import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { AdminAuthService } from './admin-auth.service';

@Injectable({
  providedIn:'root'
})
export class AdminAuthGuard implements CanActivate{

  constructor( private adminAuthService: AdminAuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
    if(this.adminAuthService.isAuthenticated()) {
      return true;
    }
    this.adminAuthService.url = state.url;
    this.adminAuthService.loginStatus = false;
    this.router.navigate(['/admin-login']);
    return false;
  }
}
