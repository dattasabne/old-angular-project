import { StudentRegistrationModel } from './student.registration.model';
import { AppConstant } from './../../shared/app-constant/app-constatnt';
import { ResponseModel } from './../model/response.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { RequestParam } from 'src/app/app-models/RequestParam';

@Injectable({
    providedIn:'root'
  })
export class StudentRegistrationHttpService{
  public constructor(private http:HttpClient){}
  public getBatchData(data:RequestParam):Observable<HttpResponse<ResponseModel>>{
    const url = AppConstant.SERVER_HOST + "/admin/batch-course-forstudentregistration";
    const headers = new HttpHeaders();
    headers.set("Content-Type","application/json");
    return this.http.post<ResponseModel>(url , data, {observe:'response',headers:headers});
  }
  public studentRegistration(data:StudentRegistrationModel[]):Observable<HttpResponse<ResponseModel>>{
    const url = AppConstant.SERVER_HOST + "/classes/student-registration";
    const headers = new HttpHeaders();
    headers.set("Content-Type","application/json");
    return this.http.post<ResponseModel>(url , data, {observe:'response',headers:headers});
  }

}
