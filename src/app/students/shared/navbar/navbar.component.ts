import { Component, OnInit, AfterViewInit, Renderer2, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { LogOutService } from '../services/logout-service';
import { DialogService } from '../services/dialog-service';
import { Router } from '@angular/router';
import { StudentAccountService } from '../services/student-account-service';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { ToggleService } from '../services/toggle-service';
import { DataShareService } from 'src/app/shared/services/data-share-service';
import { LoginType } from 'src/app/admin/admin-login2/login-type-enum';
import { SharedLoginService } from 'src/app/website/shared-login-service/shared.login.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ClassDetails } from '../../studenthomepage/class-detail';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit , AfterViewInit , OnChanges{
  public allClasses:Array<any> = new Array<any>();
  public kosBrandingLogo:SafeUrl = null; //AppConstant.KoshBrandingLogo;
  public instituteLink:string = "";
  public logOutLink:string = null;
  public studentName:string = "";
  public instituteName:string = "";
  constructor( private render2:Renderer2,
    private logout:LogOutService,
    private dialog:DialogService,
    private router:Router ,
    private studentData:StudentAccountService,
    private toggle:ToggleService,
    private shareData:DataShareService ,
    private login:SharedLoginService,
    private sanitizer:DomSanitizer) { }
  ngAfterViewInit(){
  }
  ngOnInit() {
    if(this.studentData.studentLoginData){
      this.studentName = this.studentData.studentLoginData.info.studentName;
      this.instituteLink = this.studentData.studentLoginData.loginClass.instituteLink;
      if(this.instituteLink == null){
          this.logOutLink = "/"+this.login.instituteLink;
      }else{
          this.logOutLink = "/"+this.instituteLink;
      }
    }

  }
  public logOut():void{
     this.dialog.confirmDialog("Do You Really Want To LogOut ? ",()=>{
      this.logout.doLogOut().subscribe((res)=>{
        this.dialog.showAlert(res.message,{height:300,width:500});
        this.studentData.IsLogin = false;
        let timeout = setTimeout(()=>{
        let logoutLink:string = "/";
        if(this.login.appType == AppConstant.LOGIN_TYPE_BYLINK){
          logoutLink = AppConstant.LOGOUT_LINK_OF_LINKAPP.concat(this.logOutLink);
          this.router.navigate([logoutLink]);
        }else if(this.login.appType  == AppConstant.LOGIN_TYPE_ANDROID){
          logoutLink = AppConstant.LOGOUT_LINK_OF_LINKAPP.concat(this.logOutLink);
          this.router.navigate([logoutLink]);
      } else if(this.login.appType == AppConstant.LOGIN_TYPE_WEB){
          this.router.navigate([logoutLink]);
        }
      },1500);
      },(error)=>{
        this.dialog.showAlert(error.message,{height:300,width:500});
      });
     });
  }
  public isDisplayClassName:boolean = false;
  public className:string = '';
  @Input("isClassName")
  public set IsClassName(isClassName:boolean){
    this.isDisplayClassName = isClassName;
  }
  @Input("className")
  public set ClassName(className:string){
    this.className = className;
  }
  public homeCallBack:()=>void;
  @Input("homeCallBack")
  public set HomeCallBack(fun:()=>void){
    this.homeCallBack = fun;
  }
  public hideToggle = false;
  public isHideToggle:boolean = true;
  @Input("xsHideToggle")
  public set HidetoggleXs(isHide:boolean){
    this.isHideToggle = isHide;
  }

  public showHomeIcon:boolean = false ;
  @Input("isHome")
  public set isHome(isHome:boolean){
    this.showHomeIcon = isHome;
  }
  @Input("logo")
  public set logo(logoImage:string){
    this.kosBrandingLogo = this.sanitizer.bypassSecurityTrustUrl(logoImage);
  }
  public homeName:string = "";
  @Input("homeName")
  public set HomeName(name:string){
    this.homeName = name;
  }
  public navBarType:string = null;
  @Input("navType")
  public set navType(type:string){
    this.navBarType = type;
  }

  ngOnChanges():void{
    this.hideToggle = this.isHideToggle;
  }
  @Output("toggleClick")
  public toggleClickEvent:EventEmitter<void> = new EventEmitter<void>();
  public clickOnToggleButton(ev):void{
    this.toggleClickEvent.emit();
  }

  @Output("clickOnHomeButton")
  public homeEventEmmiter:EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  public home_click(ev):void{
    //this.homeEventEmmiter.emit(ev);
    //this.shareData.GotoHomePageByStudents();
    if(this.homeCallBack){
      this.homeCallBack();
    }
  }
}
