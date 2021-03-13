import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OwntestUploaderJson } from './own-test-upload-json';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
@Injectable({
    providedIn:'root'
})
export class OwntestUploadService{
    private headers:HttpHeaders = null;
    public constructor(private http:HttpClient){
        this.headers = new HttpHeaders();
        this.headers.set('Content-Type','application/json');
    }
    public uploadOwnTest(data:OwntestUploaderJson):Observable<any>{
      const url = AppConstant.SERVER_HOST+"/admin/owntest-upload";
      return this.http.post(url,data,{headers:this.headers,withCredentials:true});
    }
}
