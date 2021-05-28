import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, QueryList, ViewEncapsulation, Renderer2, SecurityContext } from "@angular/core";
import { MediaObserver } from "@angular/flex-layout";
import { FormControl, Validators } from "@angular/forms";
import { LoginType } from "./login-type-enum";
import { Router, ActivatedRoute } from "@angular/router";
import { DialogService } from "src/app/students/shared/services/dialog-service";
import { StudentAccountService } from "src/app/students/shared/services/student-account-service";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { LoginService } from "src/app/students/admin-login/login.service";
import { DataShareService } from "src/app/shared/services/data-share-service";
import { ClassProfile } from "src/app/shared/model/class-profile-model";
import { SliderData, SliderImageData } from "src/app/shared/entities/slider-data.entity";
import { AdminLogin2Service } from "./website.login.service";
import { DomSanitizer } from "@angular/platform-browser";

import { RefferenceModel } from 'src/app/shared/services/reffdata.model.service';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { AppComponent } from 'src/app/app.component';
import { SharedLoginService } from 'src/app/website/shared-login-service/shared.login.service';
import { EncryptionDecryption } from 'src/app/shared/application/encryption';
import { Keys } from 'src/app/shared/application/keys';
import { ExamConstants } from 'src/app/students/library/interfaces/exam-constants';
import { AdminMenuService } from 'src/app/admin/admin-menu/admin-menu.service';
import { ResponseModel } from "../model/response.model";
import { small_dialog } from "../model/dialog-parameter";
import { ClassDetailModal } from "src/app/shared/model/class-detail-model";
import { AdminLoginService } from "src/app/admin/admin-services/admin-login-service";
import { EXCEPTION, NONE, NOT_MATCH, RE_LOGIN } from "../model/login-constants";

@Component({
    selector:"admin-login2",
    templateUrl:'./website.login..html',
    styleUrls:['./website.login.css'],
    encapsulation:ViewEncapsulation.None
})
export class WebsiteLoginComponent implements OnInit , AfterViewInit{

    public userNameControl:FormControl = new FormControl('',[Validators.required]);
    public passwordControl:FormControl = new FormControl('',[Validators.required]);
    public loginTypeControl:FormControl = new FormControl(LoginType.STUDENTS,[]);
    public rememberMe:FormControl = new FormControl('',[]);
    @ViewChild("mainDiv",{read:ElementRef,static:false}) private  mainDivRef:ElementRef
    @ViewChild("header",{read:ElementRef,static:false}) private  headerRef:ElementRef
    @ViewChild("content",{read:ElementRef,static:false}) private contentRef:ElementRef
    @ViewChild("footer",{read:ElementRef,static:false}) private  footerRef:ElementRef
    @ViewChild("marquee",{read:ElementRef,static:false}) private marquee:ElementRef<HTMLMarqueeElement>;
    @ViewChild("megaMenu",{read:ElementRef,static:false}) private megaMenu:ElementRef<HTMLElement>;

    public constructor(
        private media:MediaObserver,
        private render2:Renderer2,
        private dialog:DialogService,
        private loginService: LoginService,
        private router: Router,
        private studentData:StudentAccountService ,
        private adminService:AdminMenuService,
        private dataShare:DataShareService,
        private route:ActivatedRoute ,
        private adminLogin2:AdminLogin2Service,
        private domsanitizer:DomSanitizer,
        private sharedLogin:SharedLoginService,
        private adminLoginDetails:AdminLoginService

        ){}
    private adjsutScreenHeight():void{

        let totalHeight = (<HTMLElement>this.mainDivRef.nativeElement).offsetHeight;
    }
    private slides :NodeListOf<HTMLElement> = null ;
    private dotes:NodeListOf<HTMLElement> = null;
    private loginPanel:HTMLElement = null;
    public imageArray:Array<SliderImageData> = [];
    public craeteDomObjects():void{
        this.slides = document.querySelectorAll(".slider-content2");
        this.dotes = document.querySelectorAll(".dot2");
        this.loginPanel = document.querySelector(".login-panel2");
    }
    // @this code for toggle login page
    public isLoginClicked:boolean = false;
    public clickOnLoginMenu(ev:Event):void{
        let loginName =<HTMLElement> document.querySelector(".login-name");
        if(this.isLoginClicked == false){
            this.isLoginClicked = true;
        }else{
           if(this.megaMenu.nativeElement == <HTMLElement> ev.target || loginName == <HTMLElement> ev.target){
            this.isLoginClicked = false;
           }
        }
    }



    public sliderOperation():void{
       this.craeteDomObjects();
       this.hideAllSlides();
       this.setDefaultBackgroundColor();
       this.next();
       let slideInterval = setInterval(()=>{
           this.next();
       },3000);
    }

    ngAfterViewInit(){
        if(!this.loadFromAndroidApp()){
            this.setMarqueeEventS();

            this.media.media$.subscribe(value=>{
                this.adjsutScreenHeight();
            });
            this.window_keypress();
        }
    }
    private setMarqueeEventS():void{
        if(this.marquee && this.marquee.nativeElement){
            this.render2.listen(this.marquee.nativeElement, "mouseover",(ev:MouseEvent)=>{
            this.marquee.nativeElement.stop();
            });
            this.render2.listen(this.marquee.nativeElement, "mouseout",(ev:MouseEvent)=>{
                this.marquee.nativeElement.start();
             });
        }
    }
    // this is login panel toggle for individual admin login.
    private toggleLoginPanel():void{
        if(this.loginPanel){
            this.loginPanel.classList.toggle("active-login2");
        }
    }
    public showLogin:boolean = true;
    public loadFromAndroidApp():boolean{
        let loginType:string = this.route.snapshot.queryParamMap.get("type");
        let userName:string = this.route.snapshot.queryParamMap.get("username");
        let password:string = this.route.snapshot.queryParamMap.get("password");
        if(loginType && userName && password){
            loginType = loginType.trim();
            userName = userName.trim();
            password = password.trim();
            this.userNameControl.setValue(userName,{onlySelf:true});
            this.passwordControl.setValue(password ,{onlySelf:true});
            let authType:LoginType = this.getLoginType(loginType);
            this.loginTypeControl.setValue(authType);
            return true;
        }
        return false;
    }
    public getLoginType(type:string):LoginType{
        switch(type){
            case 'student':
                    return LoginType.STUDENTS;
            case 'institute':
                return LoginType.INSTITUTE;
            case 'parent':
                    return LoginType.PARENTS;
            case 'admin':
                    break;
        }
    }
    ngOnInit(){
        this.loginService.sendLocalStorageResultToServer();
        if(this.loadFromAndroidApp()){
            this.showLogin = false;
            this.decideLogin();
            this.dataShare.LoginType = AppConstant.LOGIN_TYPE_ANDROID;
            this.sharedLogin.appType = AppConstant.LOGIN_TYPE_ANDROID;
            this.sharedLogin.instituteLink = AppConstant.KOSH_EDTECH_DEFAULT_LINK;
        }else{
            this.dataShare.LoginType = AppConstant.LOGIN_TYPE_WEB;
            this.sharedLogin.appType = AppConstant.LOGIN_TYPE_WEB;
            this.dataShare.ClassDetails = null;
            this.dataShare.ClassProfile = null;
            this.dataShare.ExamStartData = null;
            let username = localStorage.getItem("rememberMe");
            if(username){
                this.userNameControl.setValue(username,{onlySelf:true});
            }
            this.studentData.studentLoginData = null;
            this.loginTypeControl.valueChanges.subscribe((type:LoginType)=>{
                if(type==LoginType.STUDENTS){
                    this.loginTypeMessage = "Student Login";
                }else if(type == LoginType.INSTITUTE){
                    this.loginTypeMessage = "Institute Login";
                }else if(type == LoginType.PARENTS){
                    this.loginTypeMessage = "Parent Login";
                }else{
                    this.loginTypeMessage = "Unkonwn Login";
                }
            });
            this.callUserData();
        }
    }
    private callUserData():void{
        let linkParam = null;
        this.route.paramMap.subscribe(param=>{
            linkParam = param.get("link");
        });

        if(linkParam!=null && linkParam.trim().length>0){
            this.loadLinkSliderData(linkParam)
        }else{
            this.koshSliderData();
        }

    }
    private createTrustedUrl():void{
        this.loginPageData.images.forEach(image=>{
            image.sliderImage = this.domsanitizer.bypassSecurityTrustUrl(image.sliderImage);
        });
    }
    private loadLinkSliderData(link:string):void{
      let data ={
          link:link
      }
      this.adminLogin2.getClassDataByLink(data).subscribe(
          (res:HttpResponse<ResponseModel>)=>{
            let responseModel:ResponseModel = res.body;
            if(responseModel.result && responseModel.data){
                this.loginPageData = <SliderData>responseModel.data.data;
                this.createTrustedUrl();
                this.className = this.loginPageData.className || this.loginPageData.uniqueClassName;
                this.classLogo = this.domsanitizer.bypassSecurityTrustUrl(this.loginPageData.classLogo);
                let timeInterval = Number(this.loginPageData.images.length) * 800;
                setTimeout(()=>{
                    this.sliderOperation();
                },timeInterval);


            }else{
                //this.router.navigate(["/"]);
            }
          },(error:HttpErrorResponse)=>{
              console.log(error);
          }
      );
    }
    public className:string = '';
    public classLogo:any = '';

    public loginPageData:SliderData = <SliderData>{};
    private koshSliderData():void{
        this.classLogo = "assets/kosh_brand_logo.jpg";
        this.className = "KOSH EDUTECH PRIVATE LIMITED , PUNE";
        this.loginPageData.images = new Array<SliderImageData>();
        let imageData = <SliderImageData>{};
        imageData.id = 1;
        imageData.sliderImage = "assets/slider-images/slider1.jpg";
        this.loginPageData.images.push(imageData);
        imageData = <SliderImageData>{};
        imageData.id = 2;
        imageData.sliderImage = "assets/slider-images/slider2.jpg";
        this.loginPageData.images.push(imageData);
        imageData = <SliderImageData>{};
        imageData.id = 3;
        imageData.sliderImage = "assets/slider-images/slider3.jpg";
        this.loginPageData.images.push(imageData);
        setTimeout(()=>{
            this.sliderOperation();
        },2000);
    }
    private slideIndex:number = -1;
    public next():void{
        this.slideIndex++;
        this.changeSlideByIndex(this.slideIndex);
    }
    public changeSlideByIndex(index:number):void{
        if(this.slides){
            index = index % (this.slides.length);
            if(this.slides[index]){
                this.hideAllSlides();
                this.setDefaultBackgroundColor();
                this.slides[index].style.display="block";
                this.dotes[index].style.background="gray";
            }
        }
    }
    public prev():void{
        // this.toggleLoginPanel();
        if(this.slideIndex>0){
            this.slideIndex--;
            this.changeSlideByIndex(this.slideIndex);
        }
    }
    private setDefaultBackgroundColor():void{
        this.dotes.forEach((item,index)=>{
            item.style.background = "lightgray";
        });
    }
    private hideAllSlides():void{
        if(!this.slides){
            return;
        }
        this.slides.forEach((item,index)=>{
            item.style.display ="none";
        });
    }
    public loginTypeModal:LoginType = LoginType.STUDENTS;
    public studentModal:LoginType = LoginType.STUDENTS;
    public instituteModal:LoginType = LoginType.INSTITUTE;
    public parentModal:LoginType = LoginType.PARENTS;
    public loginTypeMessage:string = 'Student Login';

    public decideLogin():void{
        let  loginType : LoginType = this.checkWhoIsUser();
        this.loginTypeControl.setValue(loginType);

        switch(this.loginTypeControl.value){
            case this.studentModal:
                       this.studentLogin();
                        break;
            case this.instituteModal:
                        this.instituteLogin();
                        break;
            case this.parentModal:
                        this.parentLogin();
                        break;
            default:
                this.dialog.showAlert("ERROR : Can not determined",{height:200,width:500});
        }
    }
    public StudentLogin_SuccessHandler(response:HttpResponse<ResponseModel>):void{
        this.isLoaded = false;

        let responseModel:ResponseModel = <ResponseModel>response.body;


        if(responseModel.error_type == NONE ){
            this.setData(responseModel);

        }else if(responseModel.error_type == NOT_MATCH ){
          this.result.message = responseModel.message;
          this.result.color = "red";
          this.dialog.showAlert(responseModel.message ,small_dialog);

        }else if( responseModel.error_type == EXCEPTION){
          this.isLoaded =  false;
          this.dialog.showAlert(responseModel.message ,small_dialog);
        }else if(responseModel.error_type == RE_LOGIN){
            this.dialog.confirmDialog(responseModel.message ,()=>{
                this.isLoaded = true;
                let data = {
                    username:this.userNameControl.value,
                    password:this.passwordControl.value
                  }
                this.loginService.reLogin(data).subscribe({next:(res:HttpResponse<ResponseModel>)=>{
                    this.isLoaded = false;
                    let responseModel:ResponseModel = <ResponseModel> res.body;
                    this.setData(responseModel);
                },error:this.ErrorResponse_Handler.bind(this)});
            });
        }
    }
    public ErrorResponse_Handler(error:HttpErrorResponse):void{
        this.isLoaded = false;
        if(error.status == 0){
            this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,small_dialog);
            return;
        }
        this.dialog.showAlert(error.message,small_dialog);
    }
    private studentLogin():void{
        if(this.displayError() && this.checkWhoIsUser()==LoginType.STUDENTS){
            let data = {
              username:this.userNameControl.value,
              password:this.passwordControl.value
            }
            this.setRememberMe();
            this.isLoaded =  true;
            this.loginService.login(data).subscribe({next:this.StudentLogin_SuccessHandler.bind(this),error:this.ErrorResponse_Handler.bind(this)});
          }else{
            this.dialog.showAlert("ERROR: Invalid Username or Password",{height:300,width:500});
          }
    }
    private instituteLogin_successHandler(response:HttpResponse<ResponseModel>):void{
        this.isLoaded = false;
        let responseModel:ResponseModel = <ResponseModel> response.body;
        if( responseModel && responseModel.result){
            this.sharedLogin.loginType = AppConstant.LOGIN_TYPE_INSTITUTE;
            this.isLoaded = false;
            this.setRememberMe();
            let classDetails:ClassDetailModal = <ClassDetailModal>responseModel.data;
            this.sharedLogin.authToken = classDetails.authToken;
            let classProfile = <ClassProfile>{};
            classProfile.classLogo = classDetails.classLogo;
            classProfile.className = classDetails.className;
            classProfile.uniqueClassName = classDetails.uniqueClassName;
            classProfile.username = classDetails.userName;
            this.dataShare.ClassProfile = classProfile;
            this.isLoaded = false;
            this.adminLoginDetails.adminLoginData = classDetails;
            window.onkeypress = null;
            this.router.navigate(["/admin-panel"]);
           
        }else{
            this.dialog.showAlert(responseModel.message,small_dialog);
        }
    }
    private error_responseHandler(error:HttpErrorResponse):void{
        this.isLoaded = false;
        if(error.status == 0){
            this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,small_dialog);
        }else{
            this.dialog.showAlert(error.message,small_dialog);
        }
    }
    private instituteLogin():void{
        if(this.displayError() && this.checkWhoIsUser()==LoginType.INSTITUTE){
            this.isLoaded = true;
            let username = this.userNameControl.value;
            let password = this.passwordControl.value;
            let data = {
                username:username,
                password:password
            }
            this.adminService.login(data).subscribe({next:this.instituteLogin_successHandler.bind(this),error:this.error_responseHandler.bind(this)});
        }else{
            this.dialog.showAlert("ERROR : Invalid Username or Password",{height:300,width:500});
        }
    }



    private parentLogin():void{
    }
    private setRememberMe():void{
        if(this.rememberMe.value){
            localStorage.setItem("rememberMe",this.userNameControl.value);
        }
    }
    public isLoaded:boolean = false;
    public result:{message:string,color:string} = {message:'',color:''};


    private setData(response:ResponseModel):void{
        this.studentData.studentLoginData = response.data;
        this.sharedLogin.loginType = AppConstant.LOGIN_TYPE_STUDENT;
        this.sharedLogin.authToken = response.data.auth.authToken;
        this.result.message = response.message;
        this.result.color = "green";
        this.isLoaded = false;
        this.userNameControl.setValue("",{onlySelf:true});
        this.passwordControl.setValue("",{onlySelf:true});
        this.studentData.IsLogin = true;
        window.onkeypress = null;
        this.router.navigate(["/student"]);
        

      }
      public displayError(): boolean {
        if(this.userNameControl.value && this.userNameControl.value.trim().length>0
          && this.passwordControl.value && this.passwordControl.value.trim().length>0){
          return true;
        }
        return false;
      }
      public window_keypress():void{
        window.onkeypress = (ev:KeyboardEvent)=>{
            let char  = ev.keyCode;
            if(char==13){
              this.decideLogin();
            }
          }
    }
    private checkWhoIsUser():LoginType{
        let studentPattern   = /^[0-9]{10}$/;
        if(studentPattern.test(this.userNameControl.value)){
            return LoginType.STUDENTS;
        }
        return LoginType.INSTITUTE;
    }

}
