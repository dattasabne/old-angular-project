import { HttpResponse } from '@angular/common/http';
import { ResponseModel } from './../../website/model/response.model';
import { Component, OnInit, AfterViewInit, Type, ComponentFactoryResolver, ElementRef, ViewContainerRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdminUiSetting } from '../admin-ui-settings/admin-ui-setting-class';
import { CommonAnalysisReportComponent } from '../analysis-report/analysis-report';
import { IndivisualReportComponent } from '../indivisual-report/indivisual-report';
import { SettingMenuComponent } from '../setting/setting-menu/setting-menu';
import { MediaObserver } from '@angular/flex-layout';
import { DataShareService } from 'src/app/shared/services/data-share-service';
import { ClassProfile } from 'src/app/shared/model/class-profile-model';
import { DomSanitizer } from '@angular/platform-browser';
import { RandomePaperGeneration } from '../random-paper-generation/random-paper-generation.component';
import { AdminMenuService } from '../admin-menu/admin-menu.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/students/shared/services/dialog-service';
import { UploadResult } from '../upload-result/upload-result.component';
import { OwnTestUploader } from '../own-test-upload/own-test-upload.component';
import { RefferenceModel } from 'src/app/shared/services/reffdata.model.service';
import { MessageService } from '../services/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppReffDataService } from '../services/app-reffdata';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { SharedLoginService } from 'src/app/website/shared-login-service/shared.login.service';
import { SearchGeneratedTestComponent } from '../search-generated-test/search-generated-test.component';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class AdminPanel implements OnInit,AfterViewInit{
  public fixedSidebar:HTMLElement = null;
  public shouldLoaderOn:boolean = false;
  constructor(
    private factor:ComponentFactoryResolver ,
    private media:MediaObserver,
    private dataShare:DataShareService,
    private sanitizer:DomSanitizer,
    private http: AdminMenuService,
    private location: Location,
    private router: Router ,
    private dialog:DialogService ,
    private refModel:RefferenceModel ,
    private messageService:MessageService,
    private reffDataHttp:AppReffDataService,
    private sharedLogin:SharedLoginService
    ) { }
    private mainContainer:HTMLElement = null;
  @ViewChild("templates",{read:ViewContainerRef,static:false})
  private templates:ViewContainerRef;
  private navBar:HTMLElement = null;
  private contentArea:HTMLElement = null;
  private toggleButton:HTMLButtonElement=null;
  private createDomObjects():void{
      this.mainContainer = <HTMLElement> document.querySelector('.admin-panel-main');
      this.navBar = <HTMLElement> document.querySelector('.navbar');
      this.fixedSidebar = document.querySelector(".sidebar");
      this.contentArea = document.querySelector(".admin-panel-content");
      this.toggleButton = document.querySelector(".openbtn");
  }
  public classProfile:ClassProfile =null;
  public className:string = '';
  public classLogo:any = '';
  public userName:string = '';
  public logOutLink:string = null;
  ngOnInit() {
    if(this.dataShare.ClassProfile){
      this.classProfile = this.dataShare.ClassProfile;
      this.className = this.classProfile.className;
      this.classLogo = this.sanitizer.bypassSecurityTrustUrl(this.classProfile.classLogo);
      this.userName = this.classProfile.username;
      this.getReffData();
    }else{

      let logoutPath = AppConstant.LOGOUT_LINK_OF_LINKAPP.concat("/"+this.sharedLogin.instituteLink);
      this.router.navigate([logoutPath]);
    }
  }
  public getReffData():void{
    const uniqueClassName = this.dataShare.ClassProfile.uniqueClassName;
    const userName:string = this.dataShare.ClassProfile.username;
    this.shouldLoaderOn = true;
    this.reffDataHttp.getAppReffData(uniqueClassName ,userName).subscribe((res:HttpResponse<ResponseModel>)=>{
      let responseModel:ResponseModel = res.body;
      if(res.status==200){
            this.refModel.patternName= responseModel.data.pattern;
            this.refModel.classNames = responseModel.data.className;
            this.refModel.academicYearNames = responseModel.data.academicYead;
            this.refModel.courses = responseModel.data.courses;
          }else{
            this.messageService.serverMessage(res.status.toString(),res.statusText)
        }
        this.shouldLoaderOn = false;
    },(error:HttpErrorResponse)=>{
      console.log(error);
      this.shouldLoaderOn = false;
      this.dialog.showAlert(this.messageService.serverMessage(error.status.toString(),error.statusText),{heght:300,width:500});
    });
}
  ngAfterViewInit() {
    this.createDomObjects();
    this.openNav();
    // this.media.subscribe(size=>{
    //   this.adjustHeight();
    //   if(size.mqAlias=='xs' || size.mqAlias=='sm' ){
    //     this.navBar.style.height="100px";
    //   }else if(size.mqAlias=='md' || size.mqAlias=='lg' || size.mqAlias=='xl'){
    //     this.navBar.style.height=AdminUiSetting.adminPanelMenubarHeightPx+"px";
    //   }
    // });
    this.adjustHeight();
    window.onresize = ()=>{
     this.adjustHeight();
    }
  }
  private adjustHeight():void{
     this.navBar.style.height = AdminUiSetting.adminPanelMenubarHeightPx+"px";
     let mainContHeight:number =Number(this.mainContainer.offsetHeight);
     let contentHeight:number = (mainContHeight - AdminUiSetting.adminPanelMenubarHeightPx);
     this.contentArea.style.height =contentHeight+"px";
  }
  public logOut():void{
    let message = "Do You Really Want To Logout ?";
    this.dialog.confirmDialog(message,this.confirmLogout.bind(this));
  }
  public confirmLogout():void{
    this.http.logout().subscribe(
      res => {
        if (res.result !== true) {
          alert("Internal Server Problem Occured.");
        }
        let webLink:string = this.dataShare.ClassProfile.webLink;
        if(webLink == null){
          this.logOutLink = "/" + this.sharedLogin.instituteLink;
        }else{
          this.logOutLink = "/" + this.classProfile.webLink;
        }
        this.dataShare.ClassProfile = null;
        this.location.replaceState("koshedutech.com");
        if(this.sharedLogin.appType == AppConstant.LOGIN_TYPE_BYLINK){
          let logoutLink = AppConstant.LOGOUT_LINK_OF_LINKAPP.concat(this.logOutLink);
          this.router.navigate([logoutLink]);
        }else if(this.sharedLogin.appType== AppConstant.LOGIN_TYPE_ANDROID){
          let logoutLink = AppConstant.LOGOUT_LINK_OF_ANDROID.concat(this.logOutLink);
          this.router.navigate([logoutLink]);
        }else if(this.sharedLogin.appType == AppConstant.LOGIN_TYPE_WEB){
          this.router.navigate(["/"]);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  public loadComponent(component:Type<any>):void{
    this.closeNav();
    this.templates.clear();
    let componentFactory = this.factor.resolveComponentFactory(component);
    let createComponent= this.templates.createComponent(componentFactory);

  }
  public menus:any = [
    {
      heading:"Paper Generation",
      icon:"local_library",
      subMenu :[
          {
            name:'Mannual',
            component:RandomePaperGeneration,
            icon:''
          },
          {
            name:'Random / Auto',
            component:RandomePaperGeneration,
            icon:''
          },
          {
            name:'Own / Institute',
            component:OwnTestUploader,
            icon:''
          },
          {
            name:'Reprint Test',
            component:SearchGeneratedTestComponent,
            icon:''
          }
      ]
  },
  {
      heading:"Analysis Report",
      icon:"local_library",
      subMenu :[
          {
            name:'Common Analysis',
            component:CommonAnalysisReportComponent,
            icon:''
          },
          {
            name:'Individual Analysis',
            component:IndivisualReportComponent,
            icon:''
          }
      ],
  },
  {
    heading:"Results",
    icon:"settings_applications",
    subMenu :[
        {
          name:'Upload Test Result',
          component:UploadResult,
          icon:''
        }
    ],
  },
  {
    heading:"Settings",
    icon:"settings_applications",
    subMenu :[
        {
          name:'Template Setting',
          component:SettingMenuComponent,
          icon:''
        }
    ],
    },

  ];
  public closeNav():void {
    this.fixedSidebar.style.width = "0";
  }
  public openNav():void {
    window.onclick = (ev:any)=>{
      if(!this.fixedSidebar.contains(ev.target) && ev.target!=this.toggleButton ){
        this.closeNav();
        window.onclick = null;
      }
    };
    this.fixedSidebar.style.width ="300px";
  }
}
