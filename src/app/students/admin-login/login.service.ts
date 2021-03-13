
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { catchError } from 'rxjs/operators';
import { ErrorService } from 'src/app/shared/error-service/error.service';
import { StudentDetails } from 'src/app/admin/entity/student-details';
import { EncryptionDecryption } from 'src/app/shared/application/encryption';
import { Keys } from 'src/app/shared/application/keys';
import { ResponseModel } from 'src/app/website/model/response.model';

import { small_dialog } from 'src/app/website/model/dialog-parameter';
import { DialogService } from '../shared/services/dialog-service';



@Injectable({
  providedIn: 'root'
})
export class LoginService {
 constructor(private http: HttpClient , private dialog:DialogService) { }
  public login(data:any): Observable<HttpResponse<ResponseModel>> {
    const url: string = AppConstant.SERVER_HOST.concat("/exam/login");
    const header = new HttpHeaders({
      "Content-type": "application/json"
    });
    return this.http.post<ResponseModel>(url,data,{ headers: header, withCredentials: true,observe :'response' });
  }

  public reLogin(data:any): Observable<HttpResponse<ResponseModel>> {
    const url: string = AppConstant.SERVER_HOST.concat("/exam/re-login");
       const header = new HttpHeaders({
      "Content-type": "application/json"
    });
    return this.http.post<ResponseModel>(url,data,{ headers: header, withCredentials: true,observe:'response'});
  }
  public resetEmail(data:any): Observable<HttpResponse<ResponseModel>> {
    const url: string = AppConstant.SERVER_HOST.concat("/")
      .concat("kosh")
      .concat("/resetEmail");
       const header = new HttpHeaders({
      "Content-type": "application/json"
    });
    return this.http.post<ResponseModel>(url,data,{ headers: header, withCredentials: true ,observe:'response'});
  }
  private header:HttpHeaders = new HttpHeaders({'Content-Type':'application/json'});
  private textHeader:HttpHeaders = new HttpHeaders({'Content-Type':'text/plain'});
  public submitLocalTestResult(data:any):Observable<HttpResponse<ResponseModel>>{
    const url:string = AppConstant.SERVER_HOST.concat("/exam/save-local-exam-result");
    return this.http.post<ResponseModel>(url,data,{headers :this.header,observe:'response',withCredentials:true});
  }
  public loadInstituteDataByLink(link:any):Observable<HttpResponse<ResponseModel>>{
    const url:string  = AppConstant.SERVER_HOST.concat("/admin/institute-linkdata");
    return this.http.post<ResponseModel>(url,link,{headers:this.header ,withCredentials:true,observe:'response'});
  }
  public sendLocalStorage_SuccessHandler(response:HttpResponse<ResponseModel>):void{
    let responseModel:ResponseModel = response.body;
    if(responseModel.result){
      try{
        if(localStorage){
           localStorage.removeItem("testResult");
        }
      }catch(ex){
        this.dialog.showAlert(ex,small_dialog);
      }
    }
    // else{
    //   this.dialog.showAlert(responseModel.message +"drwtfgrw",small_dialog);
    // }
  }
  public ErrorResponse_Handler(error:HttpErrorResponse):void{
    if(error.status == 0){
      this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,small_dialog);
      return;
    }
    this.dialog.showAlert(error.message,small_dialog);
  }
  public sendLocalStorageResultToServer():void{
    if(localStorage){
        try{
          let encryptedResult = localStorage.getItem("testResult");
          if(encryptedResult != null && encryptedResult != undefined && encryptedResult.trim().length > 0){
            let jsonString:string = EncryptionDecryption.decrypt(encryptedResult , Keys.encryptionKey);
            if(jsonString != null && jsonString != undefined && jsonString.trim().length > 0){
              let result:any = JSON.parse(jsonString);
              this.submitLocalTestResult(result).subscribe({next:this.sendLocalStorage_SuccessHandler.bind(this),error:this.ErrorResponse_Handler.bind(this)});
            }
          }
        }catch(ex){
          this.dialog.showAlert(ex,small_dialog);
        }
    }
}
}
