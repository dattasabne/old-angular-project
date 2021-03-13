import { isEmptyData, defaultAlertModel, dialogInfo } from '../app-models/app-constant';
import { Injectable } from '@angular/core';
import { KoshAuthentication } from '../app-models/app.datamodel';


@Injectable({
  providedIn: 'root'
})
export class OrganizationLogedIn{
  private loginData: KoshAuthentication | null | undefined ;
  public constructor(){}

  public setLoginData(loginData: KoshAuthentication): void {
    this.loginData = loginData;
  }
}
