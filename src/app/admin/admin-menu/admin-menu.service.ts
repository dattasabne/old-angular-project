import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { AppConstant } from "../../shared/app-constant/app-constatnt";
import { ResponseModel } from "src/app/website/model/response.model";
@Injectable({
  providedIn: "root"
})
export class AdminMenuService {
  public constructor(private http: HttpClient) {}
  public login(data: any): Observable<HttpResponse<ResponseModel>> {
    let header = new HttpHeaders();
    header.set("Content-Type", "application/json");
    let option = {
      headers: header
    };
    const url = AppConstant.SERVER_HOST.concat("/admin/app-login");
    return this.http.post<ResponseModel>(url, data, {
      headers: header,
      withCredentials: true,
      observe:'response'
    });
  }
  public logout(): Observable<any> {
    const url = AppConstant.SERVER_HOST.concat("/admin/logout");
    return this.http.post(url, {}, { withCredentials: true });
  }
}
