import { Component, OnInit, AfterViewInit, Type, ComponentFactoryResolver, ElementRef, ViewContainerRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { DataShareService } from 'src/app/shared/services/data-share-service';
import { ClassProfile } from 'src/app/shared/model/class-profile-model';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminUiSetting } from 'src/app/admin/admin-ui-settings/admin-ui-setting-class';
import { RandomePaperGeneration } from 'src/app/admin/random-paper-generation/random-paper-generation.component';
import { CommonAnalysisReportComponent } from 'src/app/admin/analysis-report/analysis-report';
import { IndivisualReportComponent } from 'src/app/admin/indivisual-report/indivisual-report';
import { SettingMenuComponent } from 'src/app/admin/setting/setting-menu/setting-menu';
import { ManualGenerationComponent } from '../Paper Generation/manual-generation/manual-generation.component';
import { GenerateComponent } from '../Paper Generation/random-generate/generate.component';
import { UploadPapersComponent } from '../upload-papers/upload-papers.component';
import { AdminUtilityComponent } from 'src/app/admin/admin-utility/admin-utility.component';
import { StudentAssignmentComponent } from '../student-assignment/student-assignment.component';
import { KoshDataConversionComponent } from 'src/app/kosh-admin/kosh-data-conversion/kosh-data-conversion.component';

@Component({
  selector: 'app-kosh-admin',
  templateUrl: './kosh-admin.component.html',
  styleUrls: ['./kosh-admin.component.css'],
  encapsulation:ViewEncapsulation.None

})
export class KoshAdminComponent implements OnInit {

  public fixedSidebar:HTMLElement = null;
  constructor(private factor:ComponentFactoryResolver ,
    private media:MediaObserver,
    private dataShare:DataShareService,
    private sanitizer:DomSanitizer ) { }

  private mainContainer:HTMLElement = null;
  @ViewChild("templates",{read:ViewContainerRef,static:false})
  private templates:ViewContainerRef;

  private navBar:HTMLElement = null;
  private contentArea:HTMLElement = null;
  private createDomObjects():void{
      this.mainContainer = <HTMLElement> document.querySelector('.admin-panel-main');
      this.navBar = <HTMLElement> document.querySelector('.navbar');
      this.fixedSidebar = document.querySelector(".sidebar");
      this.contentArea = document.querySelector(".admin-panel-content");
  }

  public classProfile:ClassProfile =null;
  public className:string = '';
  public classLogo:any = '';
  ngOnInit() {
    if(this.dataShare.ClassProfile){
      this.classProfile = this.dataShare.ClassProfile;
      this.className = this.classProfile.className;
      this.classLogo = this.sanitizer.bypassSecurityTrustUrl(this.classProfile.classLogo);
    }
  }
  ngAfterViewInit() {
    this.createDomObjects();
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
  public loadComponent(component:Type<any>):void{
     this.templates.clear();
      let componentFactory = this.factor.resolveComponentFactory(component);
      let createComponent= this.templates.createComponent(componentFactory);
  }
  public menus:any = [
    {
      heading:"Utility",
      icon:"view_comfy",
      subMenu :[
          {
            name:'kosh XML Data Conversion',
            component:KoshDataConversionComponent,
            icon:''
          }
      ],
    }
  ];
  public closeNav():void {
    this.fixedSidebar.style.width = "0";
  }
  public openNav():void {
    this.fixedSidebar.style.width ="300px";
  }
}

