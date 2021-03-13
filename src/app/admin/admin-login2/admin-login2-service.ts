import { ResponseModel } from './../../website/model/response.model';
import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConstant } from "src/app/shared/app-constant/app-constatnt";


@Injectable({
    providedIn:"root"
})
export class AdminLogin2Service{
    private httpHeaders:HttpHeaders = new HttpHeaders();
    public constructor(private http:HttpClient){
        this.httpHeaders.set("Content-Type","application/json");
    }
    public getClassDataByLink(data):Observable<HttpResponse<ResponseModel>>{
        let host = AppConstant.SERVER_HOST;
        let url = host.concat("/classes/link-data");
        return this.http.post<ResponseModel>(url,data,{withCredentials:true,observe:'response', headers:this.httpHeaders});
    }
}
