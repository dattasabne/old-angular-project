
import { HttpResponseModel, KoshAuthentication } from './../app-models/app.datamodel';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestParam } from '../app-models/RequestParam';
import { javaServerHost, organizationAuthBaseurl, organizationAuthUrl, httpHeaderPlain, organizationAuthbylink } from '../app-models/http.constant';
@Injectable({
  providedIn: 'root'
})
export class AppHttpService{
  constructor(private httpClient: HttpClient) {}
  public organizationAuthentication(data: RequestParam): Observable<HttpResponse<HttpResponseModel<KoshAuthentication>>>{
    const url = javaServerHost .concat(organizationAuthBaseurl + organizationAuthUrl);
    const header: HttpHeaders = httpHeaderPlain();
    return this.httpClient.post<HttpResponseModel<KoshAuthentication>>(url, data, {headers: header, observe: 'response'});
  }
  public organizationAuthenticationByLink(data: RequestParam): Observable<HttpResponse<HttpResponseModel<KoshAuthentication>>>{
    const url = javaServerHost.concat(organizationAuthBaseurl + organizationAuthbylink);
    const header: HttpHeaders = httpHeaderPlain();
    return this.httpClient.post<HttpResponseModel<KoshAuthentication>>(url, data, {headers: header, observe: 'response'});
  }

}
