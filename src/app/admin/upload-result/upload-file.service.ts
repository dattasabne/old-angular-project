import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConstant } from "src/app/shared/app-constant/app-constatnt";
@Injectable({
    providedIn:'root',
})
export class UploadResultService{
    private httpHeaders:HttpHeaders = null;
    public constructor(private http:HttpClient){
        this.httpHeaders = new HttpHeaders();
        this.httpHeaders.set("Content-Type","application/json");
    }
    public uploadResult(data:any):Observable<any>{
        let url = AppConstant.SERVER_HOST.concat("/admin/upload-result");
        let httpHeader = this.httpHeaders;
        return this.http.post(url,data,{withCredentials:true,headers:httpHeader});
    }
} 