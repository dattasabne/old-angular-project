import { Injectable } from "@angular/core";
import {
  HttpResponse,
  HttpClient,
  HttpHeaders,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConstant } from "../../shared/app-constant/app-constatnt";
import { ResponseModel } from "src/app/website/model/response.model";
@Injectable({
  providedIn: "root"
})
export class AnalysisService {
  jsonHeaders: HttpHeaders = null;
  public constructor(private http: HttpClient) {
    this.jsonHeaders = new HttpHeaders();
    this.jsonHeaders.set("Content-Type", "application/json");
  }
  public getSessionData(): Observable<HttpResponse<ResponseModel>> {
    const url:string = AppConstant.SERVER_HOST.concat("admin/home/ghhg");
    return this.http.get<ResponseModel>(url, {
      withCredentials: true,
      observe:'response'
    });
  }

  public logout(): Observable<HttpResponse<ResponseModel>> {
    const url = "http://localhost:8080/admin/login";
    return this.http.post<ResponseModel>(url,{},{withCredentials:true,headers:this.jsonHeaders, observe:'response'});
  }



  public getCriteria(): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/admin/criteria");
    return this.http.get<ResponseModel>(url, { withCredentials: true,observe:'response' });
  }
  public getDivisionBySearch(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/admin/get-division");
    return this.http.post<ResponseModel>(url, data, {
      headers: this.jsonHeaders,
      withCredentials: true,
      observe:'response'
    });
  }
  public getSubDivisionBySearch(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/admin/get-subdivision");
    return this.http.post<ResponseModel>(url, data, {
      headers: this.jsonHeaders,
      withCredentials: true,
      observe:'response'
    });
  }

  public searchAsigment(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/admin/search-assignment");
    return this.http.post<ResponseModel>(url, data, {
      headers: this.jsonHeaders,
      withCredentials: true,
      observe:'response'
    });
  }
  public searchAssignmentStudentDetaild(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/admin/search-assignment-student");
    return this.http.post<ResponseModel>(url, data, {
      headers: this.jsonHeaders,
      withCredentials: true,
      observe:'response'
    });
  }
  public getTestNotAttempted(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/admin/not-attempted-student");
    return this.http.post<ResponseModel>(url, data, {
      headers: this.jsonHeaders,
      withCredentials: true,
      observe:'response'
    });
  }
  public updateRanks(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/admin/update-rank");
    return this.http.post<ResponseModel>(url, data, {
      headers: this.jsonHeaders,
      withCredentials: true,
      observe:'response'
    });
  }
}
