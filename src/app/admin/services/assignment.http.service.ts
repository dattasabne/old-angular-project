
import { CreateAssignmentModel } from './../../website/model/student.assignmnet.database.model';
import { SearchEntity } from './../../students/shared/entity/search-entity';
import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { StudentAssignmentDataBaseModel } from 'src/app/website/model/student.assignmnet.database.model';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
@Injectable({
  providedIn:'root'
})
export class AssignmentHttpService{
  private headerJson:HttpHeaders = null;
  private headerAcceptJson:HttpHeaders = null;
  public constructor(private http:HttpClient){
    this.headerJson = new HttpHeaders();
    this.headerAcceptJson = new HttpHeaders();
    this.headerJson.set("Content-Type","application/json");
    this.headerAcceptJson.set("Accept","application/json");
  }
  public saveBulkAssignment(assignments:CreateAssignmentModel):Observable<HttpResponse<any>>{
    const url:string = AppConstant.SERVER_HOST.concat("/admin/save-bulk-assignment");
    return this.http.post(url,assignments,{observe:'response',headers:this.headerJson,withCredentials:true});
  }
  public getBranchTree(data:SearchEntity):Observable<HttpResponse<any>>{
    const url :string = AppConstant.SERVER_HOST.concat("/assignment/get-all-branch-tree");
    return this.http.post(url,data,{withCredentials:true,headers:this.headerJson,observe:'response'});
  }
  public getAssignmentJsonData(data:SearchEntity):Observable<HttpResponse<any>>{
    const url:string = AppConstant.SERVER_HOST.concat("/assignment/assigned-test-json")
    return this.http.post(url,data,{observe:'response',headers:this.headerAcceptJson});
  }
  public updateAssignment(data:CreateAssignmentModel):Observable<HttpResponse<any>>{
    const url:string = AppConstant.SERVER_HOST.concat("/assignment/update-assignments");
    return this.http.post(url,data,{withCredentials:true,observe:'response',headers:this.headerJson});
  }
  public deleteAssignment(data:CreateAssignmentModel):Observable<HttpResponse<any>>{
    const url:string = AppConstant.SERVER_HOST.concat("/assignment/delete-assignments");
    return this.http.post(url,data,{withCredentials:true,observe:'response',headers:this.headerJson});
  }

}
