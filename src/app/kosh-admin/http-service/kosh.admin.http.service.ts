import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from 'src/app/website/model/response.model';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
@Injectable({
  providedIn: 'root'
})
export class KoshAdminService{
  private header:HttpHeaders = new HttpHeaders();
  public constructor(private http:HttpClient){}
  public getChapterIds(data:any):Observable<HttpResponse<ResponseModel>>{
    const url:string = AppConstant.SERVER_HOST.concat("/admin-administration/get-chapter-ids");
    return this.http.post<ResponseModel>(url,data,{observe:'response',headers :this.header});
  }
  public submitToDataConversion(data:any):Observable<HttpResponse<ResponseModel>>{
    const url:string = AppConstant.SERVER_HOST.concat("/admin-administration/submit-to-xmldata-conversion");
    return this.http.post<ResponseModel>(url,data,{observe:'response',headers :this.header});
  }
}
