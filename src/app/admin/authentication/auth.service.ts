import { ResponseModel } from './../../website/model/response.model';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConstant } from "../../shared/app-constant/app-constatnt";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}
  public login(): Observable<HttpResponse<ResponseModel>> {
    const url: string = AppConstant.SERVER_HOST.concat("/admin/appLogin");
    const header = new HttpHeaders({
      "Content-type": "application/json"
    });
    return this.http.post<ResponseModel>(url, {},{observe:'response', headers: header, withCredentials: true  });
  }
}
