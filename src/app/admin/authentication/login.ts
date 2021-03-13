import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Component({
  selector: "login",
  templateUrl: "./login.html",
  styleUrls: ["./login.css"]
})
export class LoginComponent implements OnInit, AfterViewInit {
  public username: FormControl;
  public password: FormControl;

  public constructor(public authService: AuthService) {
    this.username = new FormControl("", [Validators.required]);
    this.password = new FormControl("", [Validators.required]);
  }
  ngOnInit() {}
  ngAfterViewInit() {}

  
  public displayError(): string {
    if (this.username.dirty && this.username.hasError("required")) {
      return "Please Enter Username";
    }
    if (this.password.dirty && this.password.hasError("required")) {
      return "Please Enter Password";
    }
  }
 public submit() {
    this.authService.login().subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }
}
