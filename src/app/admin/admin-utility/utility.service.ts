import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  public static readonly host = AppConstant.SERVER_HOST;
    header:HttpHeaders = new HttpHeaders();
    constructor(private http:HttpClient) {
      this.header.set("Content-Type","application/json");
    }

    public addLink(data:any):Observable<any> {
      let url = UtilityService.host.concat("/classes/add-link");
      return this.http.post(url,data,{headers:this.header, withCredentials:true});
    }
    public deleteLink(data:any):Observable<any> {
      let url = UtilityService.host.concat("/classes/delete-link");
      return this.http.post(url,data,{headers:this.header, withCredentials:true});
    }
    public modifyLink(data:any):Observable<any> {
      let url = UtilityService.host.concat("/classes/update-link-classes");
      return this.http.post(url,data,{headers:this.header, withCredentials:true});
    }
    public getAllLinkClasses():Observable<any> {
      let url = UtilityService.host.concat("/classes/get-all-link-classes");
      return this.http.post(url,{},{headers:this.header, withCredentials:true});
    }
    public getClassSliderImages(data:any):Observable<any> {
      let url = UtilityService.host.concat("/classes/get-class-slider-images");
      return this.http.post(url,data,{headers:this.header, withCredentials:true});
    }
    public getAllClasses():Observable<any> {
      let url = UtilityService.host.concat("/classes/get-all-classes");
      return this.http.post(url,{headers:this.header, withCredentials:true});
    }
    public addImage(data:any):Observable<any> {
      let url = UtilityService.host.concat("/classes/add-image");
      return this.http.post(url,data,{headers:this.header, withCredentials:true});
    }
    public deleteImages(data:any):Observable<any> {
      let url = UtilityService.host.concat("/classes/delete-images");
      return this.http.post(url,data,{headers:this.header, withCredentials:true});
    }
}
