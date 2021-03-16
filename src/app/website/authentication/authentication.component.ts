import { Component, OnInit } from "@angular/core";
import { LoginResponseModel } from '../model/login.response.model';
import { DialogService } from 'src/app/students/shared/services/dialog-service';
import { SharedLoginService } from '../shared-login-service/shared.login.service';
import { DataShareService } from 'src/app/shared/services/data-share-service';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentAccountService } from 'src/app/students/shared/services/student-account-service';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { ClassProfile } from 'src/app/shared/model/class-profile-model';
import { LoginService } from 'src/app/students/admin-login/login.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { InstituteRefferenceModel } from '../webiste-model/institute.reffernce.model';
import { ResponseModel } from "../model/response.model";
import { AdminLoginService } from "src/app/admin/admin-services/admin-login-service";
import { ClassDetailModal } from "src/app/shared/model/class-detail-model";
@Component({
  selector:'authentication',
  templateUrl:'./authentication.html',
  styleUrls:['./authentication.css']
})
export class Authentication implements OnInit {
  public enalbleStudentRegistrationClasses:string[] = ['vishwaniketan'];
  public displayStudentRegistrationLink:boolean = false;
  public pageLoader:boolean = false;
  public instituteData:InstituteRefferenceModel = <InstituteRefferenceModel>{};
  public constructor(
    private dialog:DialogService ,
    private sharedLogin:SharedLoginService ,
    private dataShare:DataShareService,
    private router:Router,
    private activeRoute:ActivatedRoute,
    private studentData:StudentAccountService,
    private http:LoginService,
    private loginService:LoginService,
    private adminLoginData:AdminLoginService){}
    public classLink:string = null;
    ngOnInit(){
      this.loginService.sendLocalStorageResultToServer();
      let instituteLink:string = null ;
      this.activeRoute.paramMap.subscribe(param=>{
          instituteLink = param.get("link");
      });
      if(instituteLink != null){
        this.classLink = instituteLink;
        this.displayStudentRegistrationLink = (this.enalbleStudentRegistrationClasses.indexOf(instituteLink.trim()) !== -1);
        this.sharedLogin.appType = AppConstant.LOGIN_TYPE_BYLINK;
        this.sharedLogin.instituteLink = instituteLink;
        this.loadInstituteDataByLink(instituteLink);
      }else{
        this.sharedLogin.appType = AppConstant.LOGIN_TYPE_BYLINK;
        this.sharedLogin.instituteLink = AppConstant.KOSH_EDTECH_DEFAULT_LINK;
        this.loadInstituteDataByLink(this.sharedLogin.instituteLink);
      }
    }
    public studentLoginSuccess(response:LoginResponseModel):void{
      this.setData(response);
    }


    public institueLoginSuccess(response:LoginResponseModel):void{
      this.sharedLogin.loginType = AppConstant.LOGIN_TYPE_INSTITUTE;
      let classProfile = <ClassProfile> response.data;
      let classDetails:ClassDetailModal = <ClassDetailModal>response.data;
      this.dataShare.ClassProfile = classProfile;
      this.sharedLogin.authToken = response.data.authToken;
      this.adminLoginData.adminLoginData = classDetails;

      window.onkeypress = null;
      this.router.navigate(["/admin-panel"]);
    }
    private setData(res:LoginResponseModel):void{
      this.studentData.studentLoginData = res.data;
      this.sharedLogin.loginType = AppConstant.LOGIN_TYPE_STUDENT;
      this.sharedLogin.authToken = res.data.auth.authToken;
      this.studentData.IsLogin = true;
      this.router.navigate(["/student"]);
    }
    private loadInstituteDataByLink(link:string):void{
      let data = {
        link : link
      }
      this.pageLoader = true;
      this.http.loadInstituteDataByLink(data).subscribe({next:this.loadInstituteDataSuccess.bind(this),error:this.httpErrorResponse.bind(this)});
    }
    private loadInstituteDataSuccess(res:HttpResponse<ResponseModel>):void{
      this.pageLoader = false;
      let responseModel:ResponseModel = <ResponseModel> res.body;
      this.instituteData = <InstituteRefferenceModel> responseModel.data;
      this.sharedLogin.bannerImage = this.instituteData.loginPageImage;
      this.sharedLogin.logo_image  =  this.instituteData.logoImage;
      if(this.sharedLogin.logo_image){
        AppConstant.KoshBrandingLogo = this.sharedLogin.logo_image;
      }
      this.displayStudentRegistrationLink = this.instituteData.allowStudentRegistration;
      // if(!this.instituteData.loginPageImage){P
      //   this.router.navigate(["/not-found"]);
      // }
    }
    private httpErrorResponse(error:HttpErrorResponse):void{
      this.pageLoader = false;
      if(error.status == 0){
        this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,{height:250, width:500});
        return;
      }
      this.dialog.showAlert(error.message,{height:250, width:500});
    }
}

