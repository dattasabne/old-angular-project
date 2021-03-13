import { HttpErrorResponse } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AdminAuthService } from '../admin-dashboard/admin-auth.service';
import { ResponseModel } from 'src/app/website/model/response.model';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit,AfterViewInit {
  public username: FormControl;
  public password: FormControl;
  public loginForm: NgForm;


constructor( private authServive:AdminAuthService,private loginService: LoginService, private router: Router) {
  this.username = new FormControl("", [Validators.required]);
  this.password = new FormControl("", [Validators.required]);
}

  ngOnInit() {}
  ngAfterViewInit() {}

  public displayError(): boolean {
    if (this.username.touched) {
      if(this.username.dirty && this.username.hasError("required")) {
       return false;
      } else {
        return true;
      }
    }
    if(this.password.touched) {
      if (this.password.dirty && this.password.hasError("required")) {
        return false
      } else {
        return true;
       }
    }
  }
  public result: string;
public login():void {

    if(this.displayError()){
      const data={
        userName:this.username.value,
        password:this.password.value
      };
      this.loginService.login(data)
      .subscribe(
        (res:HttpResponse<ResponseModel>) => {
          let responseModel:ResponseModel = res.body;

          if(responseModel.result) {
            this.authServive.loginStatus  = true;
            setTimeout(()=>{
              this.router.navigate([this.authServive.url]);
            },500);
          }
          this.result = responseModel.message;
        },
        (err:HttpErrorResponse) => {
          alert(err.message);
        }
      );
    }
  }
}
