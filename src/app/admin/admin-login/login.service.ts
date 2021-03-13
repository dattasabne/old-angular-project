import { ResponseModel } from './../../website/model/response.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
 constructor(private http: HttpClient) { }
  public login(data:any): Observable<HttpResponse<ResponseModel>> {
    const url: string = AppConstant.SERVER_HOST.concat("/")
      .concat("kosh")
      .concat("/login");
       const header = new HttpHeaders({
      "Content-type": "application/json"
    });
    return this.http.post<ResponseModel>(url,data,{ headers: header, withCredentials: true,observe:'response' });
  }
  public resetEmail(data:any): Observable<HttpResponse<ResponseModel>> {
    const url: string = AppConstant.SERVER_HOST.concat("/kosh/resetEmail");
       const header = new HttpHeaders({
      "Content-type": "application/json"
    });
    return this.http.post<ResponseModel>(url,data,{ headers: header,observe:'response',  withCredentials: true });
  }
}
