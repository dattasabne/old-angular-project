import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentAccountService } from 'src/app/students/shared/services/student-account-service';
import { SharedLoginService } from '../shared-login-service/shared.login.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    public constructor(
      private loginService:SharedLoginService,
      private studentData:StudentAccountService){}
    intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
        let authToken:string = this.loginService.authToken;
        req =req.clone({
            setHeaders:{
                'Authorization':`Bearer ${authToken}`
            }
        });
        return next.handle(req);
    }
}
