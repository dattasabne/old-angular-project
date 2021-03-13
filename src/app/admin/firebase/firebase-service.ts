import { ResponseModel } from './../../website/model/response.model';
import { Injectable } from "@angular/core";
import {HttpResponse} from "@angular/common/http";
import {
  HttpClient,
  HttpHeaderResponse,
  HttpHeaders
} from "@angular/common/http";
import { AppConstant } from "src/app/shared/app-constant/app-constatnt";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class FireBaseService {
  private header = new HttpHeaders();
  public constructor(private http: HttpClient) {
    this.header.set("Content-Type", "application/json");
  }
  public sendFireBaseNotification(data: Array<any>): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/admin/send-firbase-notification");
    return this.http.post<ResponseModel>(url, data, {
      headers: this.header,
      withCredentials: true,
      observe:'response'
    });
  }
}
