import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from '../admin-login/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit,AfterViewInit {
  @ViewChild("email",{read:ElementRef,static:false}) email:ElementRef;
  public $email: HTMLInputElement = null;
  private emailPattern:any = /^[a-zA-Z_]+[a-zA-Z-_0-9]*@[a-zA-Z]+\.[a-zA-Z]+$/;
  constructor(private loginService: LoginService) { }
  ngOnInit() {
  }
 ngAfterViewInit() {
    this.$email = this.email.nativeElement as HTMLInputElement;
  }

  public validateMail():boolean {
    let filterEmail = this.emailPattern.exec(this.$email.value.trim());
    if(filterEmail==null || !(filterEmail[0]===this.$email.value.trim()))  {
      alert("Please enter valid email id !");  
      return false;
    } else {
      return true;
    }
  }
 public resetMail():void {
    const data = {
      email:this.$email.value
    }
    if(this.validateMail()) {
      this.loginService.resetEmail(data)
      .subscribe(res=>{
        if(res.status)
        console.log(res);
      },err=>{
        console.log(err);
      })
    }
  }
}
