import { Injectable } from '@angular/core';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RandomgenerateService {

  public static readonly host = AppConstant.SERVER_HOST;
    header:HttpHeaders = new HttpHeaders();
    constructor(private http:HttpClient) { 
      this.header.set("Content-Type","application/json");
    }
    public getPatternSubject(data:any):Observable<any> {
      let url = RandomgenerateService.host.concat("/classes/add-link");
      return this.http.post(url,data,{headers:this.header, withCredentials:true}); 
    }
}
