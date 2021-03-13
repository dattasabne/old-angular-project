import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { PrintTestModel } from './print-test-model';

@Injectable({
    providedIn:'root'
})
export class ReprintTestDetailService{
    private header = new HttpHeaders({'Content-Type':'application/json'});
    public constructor(private http:HttpClient){}
    public fetchReprintTest(data:any):Observable<HttpResponse<any>>{
        const url = AppConstant.SERVER_HOST.concat("/admin/get-reprint-test-list");
        return this.http.post(url,data,{withCredentials:true,observe:'response',headers:this.header});
    }
    public printDocument(data:PrintTestModel):Observable<HttpResponse<any>>{
        const url = AppConstant.SERVER_HOST.concat("/admin/reprinttest");
        return this.http.post(url,data,{withCredentials:true,headers:this.header,observe:'response'});
    }
    public getClassDetails(data:any):Observable<HttpResponse<any>>{
        const url = AppConstant.SERVER_HOST.concat("/admin/class-details");
        return this.http.post(url,data,{withCredentials:true,observe:'response', headers : this.header});
    }

}