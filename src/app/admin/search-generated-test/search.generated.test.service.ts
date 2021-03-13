import { Injectable } from "@angular/core";
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
@Injectable({
    providedIn:'root'
})

export class SearchGeneratedTestService{
    private httpHeader = new HttpHeaders({'Content-Type':'application/json'});
    public constructor(private http:HttpClient){}
    public getGeneratedTest(data:any):Observable<HttpResponse<any>>{
        const url =AppConstant.SERVER_HOST.concat("/admin/get-generated-test");
        return this.http.post(url,data,{headers :this.httpHeader, withCredentials:true,observe:'response'});
    }

}
