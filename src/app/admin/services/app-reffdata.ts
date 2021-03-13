import { Injectable } from "@angular/core";
import { HttpHeaderResponse, HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';

@Injectable({
    providedIn:'root'
})
export class AppReffDataService{
    private  header:HttpHeaders = new HttpHeaders({'Content-Type':'application/json'});
    public constructor(private http:HttpClient){}
    public getAppReffData(uniqueClassName:string , userName:string):Observable<HttpResponse<any>>{
        let queryParam:string =`?uniqueClassName=${uniqueClassName}&userName=${userName}`;
        const url= AppConstant.SERVER_HOST.concat("/admin/classReffData").concat(queryParam);
        return this.http.get(url,{withCredentials:true,headers:this.header, observe:'response'});
    }
}
