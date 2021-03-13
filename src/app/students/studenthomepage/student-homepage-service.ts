import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpResponse } from "@angular/common/http";
import { AppConstant } from "../../shared/app-constant/app-constatnt";
import { Observable } from "rxjs";
import { SearchEntity } from '../shared/entity/search-entity';

@Injectable({
  providedIn: "root"
})
export class StudentHomepageService {
  private httpHeader: HttpHeaders;
  public constructor(private http: HttpClient) {
    this.httpHeader = new HttpHeaders();
    this.httpHeader.set("Content-Type", "application/json");
  }
  public initializeStudent(): Observable<any> {
    const url = AppConstant.SERVER_HOST.concat("/exam/login");
    return this.http.post(
      url,
      {},
      { headers: this.httpHeader, withCredentials: true }
    );
  }
  public getTestDuration(data:SearchEntity):Observable<HttpResponse<any>>{
    const url:string = AppConstant.SERVER_HOST.concat("/exam/get-test-duration");
    return this.http.post(url,data,{observe:'response',headers:this.httpHeader});
  }
}
