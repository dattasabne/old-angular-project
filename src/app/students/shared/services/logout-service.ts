import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConstant } from "src/app/shared/app-constant/app-constatnt";
import { ErrorService } from 'src/app/shared/error-service/error.service';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn:'root'
})
export class LogOutService{
    private headers:HttpHeaders = new HttpHeaders();
    public constructor(
        private http:HttpClient

    ){
        this.headers.set("Content-Type","application/json");
    }
    public doLogOut():Observable<any>{
        let url = AppConstant.SERVER_HOST.concat("/exam/logout");
        return this.http.post(url,{},{withCredentials:true,headers:this.headers})
    }
}
