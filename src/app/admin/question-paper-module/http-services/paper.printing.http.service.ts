import { SearchTest } from 'src/app/students/analysis-search/search-test';
import { HttpHeaders } from '@angular/common/http';
import { AppConstant } from './../../../shared/app-constant/app-constatnt';
import { ResponseModel } from './../../../website/model/response.model';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
@Injectable()
export class PaperPrintingHttpService{
  private header:HttpHeaders = new HttpHeaders();
  public constructor(private http:HttpClient){
    this.header.set("Content-Type","application/json");
  }
  public getSubjectIds(data:SearchTest):Observable<HttpResponse<ResponseModel>>{
    const url:string = AppConstant.SERVER_HOST.concat("/paper-printing/subject-ids");
    return this.http.post<ResponseModel>(url,data,{withCredentials:true,observe:'response',headers:this.header});
  }

}
