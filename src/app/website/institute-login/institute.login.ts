import { Component, OnInit, AfterViewInit, Input, OnChanges, EventEmitter, Output } from "@angular/core";
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LoginType } from 'src/app/admin/admin-login2/login-type-enum';
import { DialogService } from 'src/app/students/shared/services/dialog-service';
import { LoginService } from 'src/app/students/admin-login/login.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatCheckboxChange } from '@angular/material';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { AdminMenuService } from 'src/app/admin/admin-menu/admin-menu.service';
import { LoginResponseModel } from '../model/login.response.model';
import { ResponseModel } from "../model/response.model";
import { small_dialog } from "../model/dialog-parameter";
import { EXCEPTION, NONE, NOT_MATCH, RE_LOGIN } from "../model/login-constants";
@Component({
  selector:'login',
  templateUrl:'./institute.login.html',
  styleUrls:['./institute.login.css']
})
export class InstituteLogin implements OnInit , AfterViewInit{
  public userNameFormControl:FormControl = new FormControl("",[Validators.required]);
  public passwordFormControl:FormControl = new FormControl("",Validators.compose([Validators.required]));
  public loginTypeControl:FormControl = new FormControl(LoginType.STUDENTS,[]);
  public logoData:SafeUrl ="";
  public isLoaded:boolean = false;
  public rememberMe:boolean = false;
  public constructor(
    private dialog:DialogService,
    private http:LoginService,
    private adminHttp:AdminMenuService) {
  }
  ngAfterViewInit(){}
  ngOnInit(){
    //this.logoData =this.sanitizer.bypassSecurityTrustUrl("assets/institute-logoes/inspire-institute.jpg");
    let rememberMeData = this.getRememberMe();
    if(rememberMeData != null){
      this.userNameFormControl.setValue(rememberMeData,{onlySelf:true});
    }
  }
  @Input("logo")
  public set logo(logoData:string){
    // this.logoData = this.sanitizer.bypassSecurityTrustUrl(logoData);
    this.logoData = logoData;
  }
  @Output("studentLoginSuccess")
  public student:EventEmitter<LoginResponseModel> = new EventEmitter<LoginResponseModel>();
  @Output("instituteLoginSuccess")
  public institute:EventEmitter<LoginResponseModel> = new EventEmitter<LoginResponseModel>();
  public whoIsuser(username:string):LoginType{
     let user:RegExp = /^[7-9][0-9]{9}$/;
     let wrongUser:RegExp = /^[7-9][0-9]{9,}$/;
     if(user.test(username) || wrongUser.test(username)){
       return LoginType.STUDENTS;
     }
     return LoginType.INSTITUTE;
  }
  public rememberMeChange(checkBox:MatCheckboxChange):void{
    this.rememberMe = checkBox.checked;
  }
  public validateCredentials():boolean{
    if(this.userNameFormControl.hasError("required")){
      this.dialog.showAlert("Please Enter UserName.",small_dialog);
      return false;
    }
    if(this.passwordFormControl.hasError("required")){
      this.dialog.showAlert("Please Enter Password.",small_dialog);
      return false;
    }
    return true;
  }
  private setRememberMe(data:string):void{
    if(this.rememberMe){
      if(localStorage){
        localStorage.setItem("rememberMe",data);
      }
    }
  }
  private getRememberMe():string{
    try{
      if(localStorage){
        let data:string = localStorage.getItem("rememberMe");
        if(data != null && data.trim().length > 0){
          return data;
        }
      }
    }catch(ex){
      alert(ex);
    }
    return null;
  }
  private loginSuccessResponse(response:HttpResponse<ResponseModel>):void{
    this.isLoaded = false;
    let res:ResponseModel =<ResponseModel>response.body;
    if( res.error_type == NONE ){    // success response
        this.setRememberMe(this.userNameFormControl.value);
        let studentLoginData:LoginResponseModel = new LoginResponseModel();
        studentLoginData.result  = res.result;
        studentLoginData.message = res.message;
        studentLoginData.data    = res.data;
        this.student.emit(studentLoginData);

    }else if(res.result == false && res.error_type == NOT_MATCH ){ // invalid username password response
      this.dialog.showAlert(res.message  ,small_dialog);
    }else if(res.result == false && res.error_type == EXCEPTION){// server side error response
      this.dialog.showAlert(res.message ,small_dialog);
    }else if(res.result == false && res.error_type == RE_LOGIN){ // somebody allready logged in
      this.dialog.confirmDialog(res.message ,this.relogin.bind(this));
    }
  }
  private relogin():void{
    this.isLoaded = true;
    let data = {
      username :this.userNameFormControl.value,
      password : this.passwordFormControl.value
    }
    this.http.reLogin(data).subscribe({next:this.reloginSuccessResponse.bind(this),error:this.errorResponse.bind(this)});
  }
  private reloginSuccessResponse(res:HttpResponse<ResponseModel>):void{
    let responseModel:ResponseModel = <ResponseModel>res.body;
    this.isLoaded = false;
    let studentLoginData:LoginResponseModel = new LoginResponseModel();
    studentLoginData.result  = responseModel.result;
    studentLoginData.message = responseModel.message;
    studentLoginData.data    = responseModel.data;
    this.student.emit(studentLoginData);
  }
  private instituteLoginSuccessResponse(response:HttpResponse<ResponseModel>):void{
      this.isLoaded = false;
      let responseModel:ResponseModel = <ResponseModel> response.body;
      if(responseModel && responseModel.data && responseModel.result){
        this.setRememberMe(this.userNameFormControl.value);
        let institutetLoginData:LoginResponseModel = new LoginResponseModel();
        institutetLoginData.result  = responseModel.result;
        institutetLoginData.message = responseModel.message;
        institutetLoginData.data    = responseModel.data;
        institutetLoginData.data.username = this.userNameFormControl.value;
        this.institute.emit(institutetLoginData);
       }else{
           this.dialog.showAlert(responseModel.message,small_dialog);
           this.isLoaded = false;
       }
   }
   private errorResponse(error:HttpErrorResponse):void{
    this.isLoaded = false;
    if(error.status == 0){
      this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,{height:300,width:500});
    }else{
      this.dialog.showAlert(error.message,{height:300,width:500});
    }
  }
  public login():void{
    if(this.validateCredentials()){
      let data = {
        username:this.userNameFormControl.value,
        password:this.passwordFormControl.value
      }
      let userType:LoginType = this.whoIsuser(this.userNameFormControl.value);
      if(this.loginTypeControl.value == LoginType.STUDENTS && userType == LoginType.STUDENTS){
        this.isLoaded = true;
        this.http.login(data).subscribe({next:this.loginSuccessResponse.bind(this) , error:this.errorResponse.bind(this)});
      }else if(this.loginTypeControl.value == LoginType.INSTITUTE && userType == LoginType.INSTITUTE){
        this.isLoaded = true;
        this.adminHttp.login(data).subscribe({next:this.instituteLoginSuccessResponse.bind(this) , error: this.errorResponse.bind(this)});
      }else{
        this.dialog.showAlert("Invalid Username Or Password.",{height:200,width:500});
      }
    }
  }
}


