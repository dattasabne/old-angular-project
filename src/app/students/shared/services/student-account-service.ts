import { Injectable } from "@angular/core";
import { StudentLoginData } from "../../studenthomepage/student-login-model";
@Injectable({
    providedIn:'root'
})
export class StudentAccountService{
    public studentLoginData:any;
    private loginUrl:string = "/student-homepage";

    public isLoggedIn:boolean = false;
    public constructor(){
        this.studentLoginData = null;
    }
    public get IsLogin():boolean{
        return this.isLoggedIn;
    }
    public set IsLogin(isLogin:boolean){
        this.isLoggedIn = isLogin;
    }
    public get LoginUrl():string{
        return this.loginUrl;
    }
    public set LoginUrl(loginUrl:string){
        this.loginUrl = loginUrl;
    }
}