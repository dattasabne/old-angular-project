import { ResponseModel } from './../../website/model/response.model';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ClassTestService {
 constructor(private http: HttpClient) { }
     public getAllUniqueClasses(): Observable<HttpResponse<ResponseModel>> {
       const url: string = AppConstant.SERVER_HOST.concat("/kosh/all-unique-classes");
          const header = new HttpHeaders({
         "Content-type": "application/json"
       });
       return this.http.post<ResponseModel>(url,{},{ observe:'response', headers: header, withCredentials: true });
     }
     public getClassBatchCourseBranch(data:any): Observable<HttpResponse<ResponseModel>> {
      const url: string = AppConstant.SERVER_HOST.concat("/kosh/unique-classes-batch");
         const header = new HttpHeaders({
        "Content-type": "application/json"
      });
      return this.http.post<ResponseModel>(url,data,{ observe:'response', headers: header, withCredentials: true });
    }
    public getClassDivision(data:any): Observable<HttpResponse<ResponseModel>> {
      const url: string = AppConstant.SERVER_HOST.concat("/kosh/unique-classes-division");
         const header = new HttpHeaders({
        "Content-type": "application/json"
      });
      return this.http.post<ResponseModel>(url,data,{ observe:'response', headers: header, withCredentials: true });
    }
    public getClassSubDivision(data:any): Observable<HttpResponse<ResponseModel>> {
      const url: string = AppConstant.SERVER_HOST.concat("/kosh/unique-classes-subdivision");
         const header = new HttpHeaders({
        "Content-type": "application/json"
      });
      return this.http.post<ResponseModel>(url,data,{ observe:'response', headers: header, withCredentials: true });
    }
    public search(data:any): Observable<HttpResponse<ResponseModel>> {
      const url: string = AppConstant.SERVER_HOST.concat("/kosh/search-class-test");
         const header = new HttpHeaders({
        "Content-type": "application/json"
      });
      return this.http.post<ResponseModel>(url,data,{ observe:'response', headers: header, withCredentials: true });
  }
}
