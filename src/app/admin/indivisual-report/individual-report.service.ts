import { ResponseModel } from 'src/app/website/model/response.model';
import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpResponse } from "@angular/common/http";
import { AppConstant } from "../../shared/app-constant/app-constatnt";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class IndividualReportService {
  private header: HttpHeaders = null;
  public constructor(private http: HttpClient) {
    this.header = new HttpHeaders();
    this.header.set("Content-Type", "application/json");
  }
  public getStudentExamList(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/admin/student-list-of-exam");
    return this.http.post<ResponseModel>(url, data,{headers:this.header,observe:'response',withCredentials:true});
  }
  public getStudentExamRecords(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/admin/student-get-exam-records");
    return this.http.post<ResponseModel>(url, data, {withCredentials: true,headers: this.header,observe:'response'});
  }
}
