import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { StudentAccountService } from "../services/student-account-service";
@Injectable({
    providedIn:'root'
})
export class StudentLoginGuard implements CanActivate{
    public constructor(private studentData:StudentAccountService , 
        private router:Router){
    }
    canActivate(route:ActivatedRouteSnapshot , state : RouterStateSnapshot){
        if(this.studentData.isLoggedIn){
            return true;
        }
        this.studentData.LoginUrl = state.url;
        this.router.navigate(["/"]);
        return false;
    }
}