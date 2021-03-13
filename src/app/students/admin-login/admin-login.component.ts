import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DialogService } from '../shared/services/dialog-service';
import { FormStyle } from '@angular/common';
import { StudentLoginData } from '../studenthomepage/student-login-model';
import { StudentAccountService } from '../shared/services/student-account-service';
import { ResponseModel } from 'src/app/website/model/response.model';
import { small_dialog } from 'src/app/website/model/dialog-parameter';
import { EXCEPTION, NONE, NOT_MATCH, RE_LOGIN } from 'src/app/website/model/login-constants';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit,AfterViewInit {
  public username: FormControl;
  public password: FormControl;
  public result:{message:string,color:string} = {message:'',color:''};
  public rememberMe:FormControl;
  public loginForm: NgForm;
  public isLoaded:boolean = false;
constructor( 
    private  dialog:DialogService,  
    private loginService: LoginService, 
    private router: Router,
    private render2:Renderer2,
    private studentData:StudentAccountService ) { 
    this.username   = new FormControl("", [Validators.required]);
    this.password   = new FormControl("", [Validators.required]);
    this.rememberMe = new FormControl('',[]); 
}
ngOnInit() {
    let username = localStorage.getItem("rememberMe");
    if(username){
      this.username.setValue(username,{onlySelf:true});
    }
    this.studentData.studentLoginData = null;
  }
  ngAfterViewInit() {
      this.window_keypress();
  }
  public window_keypress():void{
      this.render2.listen(window,"keypress",(ev:KeyboardEvent)=>{
        let char  = ev.keyCode;
        if(char==13){
          this.login();
        }
      });
  } 
  public displayError(): boolean {
    if(this.username.value && this.username.value.trim().length>0
      && this.password.value && this.password.value.trim().length>0){
      return true;
    }
    return false;
  }
  public ErrorResponse_Handler(error:HttpErrorResponse):void{
    if(error.status == 0){
        this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,small_dialog);
        return;
    }
    this.dialog.showAlert(error.message,small_dialog);
  }
  public StudentLogin_SuccessHandler(response:HttpResponse<ResponseModel>):void{
    this.isLoaded = false;
    let responseModel:ResponseModel = <ResponseModel>response.body;
    if(!(responseModel && responseModel.result)){
        this.dialog.showAlert(responseModel.message ,small_dialog);
        return;
    }
    if(responseModel.result && responseModel.error_type == NONE ){
        this.setData(responseModel);

    }else if(responseModel.result && responseModel.error_type == NOT_MATCH ){
      this.result.message = responseModel.message;
      this.result.color = "red";
      this.dialog.showAlert(responseModel.message ,small_dialog);
     
    }else if(responseModel.result && responseModel.error_type == EXCEPTION){
      this.isLoaded =  false;
      this.dialog.showAlert(responseModel.message ,small_dialog);
    }else if(responseModel.result && responseModel.error_type == RE_LOGIN){
        this.dialog.confirmDialog(responseModel.message ,()=>{
            this.isLoaded = true;
            let username = this.username.value;
            let password = this.password.value;
            let data = {
              username:username,
              password:password
            }
            this.loginService.reLogin(data).subscribe({next:(res:HttpResponse<ResponseModel>)=>{
                this.isLoaded = false;
                let responseModel:ResponseModel = <ResponseModel> res.body;
                this.setData(responseModel);
            },error:this.ErrorResponse_Handler.bind(this)});
        });
    }
}
public login():void {
    if(this.displayError()){
      let username = this.username.value;
      let password = this.password.value;
      let data = {
        username:username,
        password:password
      }
      if(this.rememberMe.value){
        localStorage.setItem("rememberMe",this.username.value);
      }
      this.isLoaded =  true;
      this.loginService.login(data).subscribe({next:this.StudentLogin_SuccessHandler.bind(this),error:this.ErrorResponse_Handler.bind(this)});
    }
  }
  private setData(response:ResponseModel):void{
    this.studentData.studentLoginData = response.data;
    this.result.message = response.message;
    this.result.color = "green"; 
    this.isLoaded = false;
    this.username.setValue("",{onlySelf:true});
    this.password.setValue("",{onlySelf:true});
    this.studentData.IsLogin = true;
    this.router.navigate(["/student-homepage"]);
  }
}
