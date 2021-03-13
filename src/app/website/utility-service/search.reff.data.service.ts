import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchEntity } from 'src/app/students/shared/entity/search-entity';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';

@Injectable({
  providedIn:'root'
})
export class SearchReffDataService{
  private applicationJsonHeader:HttpHeaders = new HttpHeaders();
  public constructor(private http:HttpClient){
    this.applicationJsonHeader.set("Content-Type",'application/json');
  }
  public getSubjectListByPatternName(data:SearchEntity):Observable<HttpResponse<any>>{
    const url:string  = AppConstant.SERVER_HOST.concat("/admin/get-subject-by-pattern");
    return this.http.post(url,data,{withCredentials:true,observe:'response',headers:this.applicationJsonHeader});
  }
  public getClassCourses(data:SearchEntity):Observable<HttpResponse<any>>{
    const url:string  = AppConstant.SERVER_HOST.concat("/refference/class-courses");
    return this.http.post(url,data,{withCredentials:true,observe:'response',headers:this.applicationJsonHeader});
  }
}
