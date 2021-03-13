import { Component, OnInit, Input, ViewChild, ElementRef, ComponentFactoryResolver, Renderer2, ChangeDetectorRef, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MediaChange, MediaObserver} from '@angular/flex-layout';
import { StudentLoginData } from '../studenthomepage/student-login-model';
import { StudentHomepageService } from '../studenthomepage/student-homepage-service';
import { DataShareService } from 'src/app/shared/services/data-share-service';
import { LogOutService } from '../shared/services/logout-service';
import { StudentAccountService } from '../shared/services/student-account-service';
import { Router } from '@angular/router';
import { ClassDetails } from '../studenthomepage/class-detail';
import { StudentMenu } from '../library/enums/studnet-menu.enum';
import { DialogService } from '../shared/services/dialog-service';

@Component({
  selector: 'app-individual-analysis',
  templateUrl: './individual-analysis.component.html',
  styleUrls: ['./individual-analysis.component.css'],
})
export class IndividualAnalysisComponent implements OnInit {

  public solvedDates: FormControl = new FormControl("ALL", []);
  public panelColor = new FormControl('red');
  public studentData:any = null;

  constructor(
    private factory: ComponentFactoryResolver,
    private render2: Renderer2,
    private http: StudentHomepageService,
    private shareData: DataShareService , 
    private studenLoginData:StudentAccountService,
    private logout:LogOutService,
    private dialog:DialogService,
    private router:Router,
    private media:MediaObserver,
    private cdRef:ChangeDetectorRef
  ) { }

  // public someField:boolean = false;
  @HostBinding('class.someClass') someField:boolean = false;
  ngOnInit() {
    this.someField = true;
    this.cdRef.detectChanges();
  }


  public isHideToggle:boolean = false;
  @Input("xsHideToggle")
  public set HidetoggleXs(isHide:boolean){
    this.isHideToggle = isHide;
  }

  public isAnalysisType:boolean = false;
  @Input("isClassName")
  public set IsClassName(isAnalysis:boolean){
    this.isAnalysisType = isAnalysis;
  }

  public examSolvedDates:any = [
    "All","July-2019","Jun-2019","May-2019"
  ]

  public examResultData:any = [
    {
      subName:"Physics",
      percentage:"50",
      background:"#FFF5EE"
    }
  ]

  public analysisType:any = [
    {
      type:"Overall Analysis",
      icon:"local_library"
    },
    {
      type:"Own Analysis",
      icon:"account_circle"
    },
    {
      type:"Topper Analysis",
      icon:"speaker_group"
    },
  ]

  public logOut():void{
    this.dialog.confirmDialog("Do You Really Want To LogOut ? ",()=>{
     this.logout.doLogOut().subscribe((res)=>{
       this.dialog.showAlert(res.message,{height:300,width:500});
       this.studentData.IsLogin = false;
       let timeout = setTimeout(()=>{
       this.router.navigate(["/students"]);
       },1500);
     },(error)=>{
       this.dialog.showAlert(error.message,{height:300,width:500});
     });
    }); 
 }
  public isLoaded: boolean = false;
  public studentloginData: StudentLoginData = <StudentLoginData>{};
  // public initializeStudent(): void {
  //       if(this.studentData){
  //         this.studentloginData.address = this.studentData.info.address;
  //         this.studentloginData.batch = this.studentData.info.batch;
  //         this.studentloginData.course = this.studentData.info.course;
  //         this.studentloginData.division = this.studentData.info.division;
  //         this.studentloginData.emailId = this.studentData.info.emailId;
  //         this.studentloginData.gender = this.studentData.info.gender;
  //         this.studentloginData.mobileNo = this.studentData.info.mobileNo;
  //         this.studentloginData.studentId = this.studentData.info.studentId;
  //         this.studentloginData.studentName = this.studentData.info.studentName;
  //         this.studentloginData.uniqueClassName = this.studentData.auth.uniqueClassName;
  //         this.studentloginData.userName = this.studentData.auth.userName;
  //         this.studentloginData.passwor = this.studentData.auth.password;
  //         this.studentloginData.cloudKey = this.studentData.auth.cloudKey;
  //         this.studentloginData.studentLock = this.studentData.auth.studentLock;
  //         this.studentloginData.classList = <Array<ClassDetails>>(
  //           this.studentData.classess
  //         );
  //         this.isLoaded = false;
  //         this.showcaseName = "welcome " + this.studentloginData.studentName;
  //       }else{
  //         this.router.navigate(["/students"]);
  //       }
       
  // }
  public showCase:HTMLElement = null;
  @ViewChild("navbar",{read:ElementRef,static:false}) public navbar: ElementRef;
  public fixedSidebar:HTMLElement = null;
  public contentContainer:HTMLElement = null;
  public mainDiv:HTMLElement = null;

  public adjustSideBarHeight():void{
    let navbarElem=this.navbar.nativeElement.querySelector(".new-navbar");
    if(this.showCase && this.navbar 
       && this.fixedSidebar && navbarElem 
       && this.contentContainer && this.mainDiv ){
      let extra = 7;
      let totalHeight = document.body.offsetHeight;
      let showcaseHeight = Number(this.showCase.offsetHeight);
      let navbarHeight = Number(navbarElem.offsetHeight);
      let sideBarHeight  = totalHeight - (showcaseHeight + navbarHeight + extra);
      this.fixedSidebar.style.height = sideBarHeight+"px";
      this.contentContainer.style.height = sideBarHeight+"px";
      this.mainDiv.style.height = totalHeight +"px";
    }
  }
  ngAfterViewInit() {
    this.showCase = document.querySelector(".showcase");
    this.fixedSidebar = document.querySelector(".student-fixed-sidebar");
    this.contentContainer = document.querySelector(".student-content-container");
    this.mainDiv = document.querySelector(".main-div");
    this.media.media$.subscribe((value:MediaChange)=>{
      this.adjustSideBarHeight();
      this.setDefaultSideBar(value);
    });
    this.render2.listen(window,"click",(ev)=>{
        this.toggle(ev,null);
    });
  }
  public hidetoggleButton:boolean = true;
  public setDefaultSideBar(value:MediaChange):void{
    if(value.mqAlias=="xl"|| value.mqAlias=="lg" || value.mqAlias=="md" ){
      if(this.fixedSidebar){
        this.fixedSidebar.classList.add('active-toggle');
        this.hidetoggleButton = true;
      }
    }else{
      this.fixedSidebar.classList.remove('active-toggle');
      this.hidetoggleButton = false;
    }
  }
  public showcaseName: string = "";
  public classSlogan: string = "";
  public clickOnClass($class: ClassDetails): void {
    this.showcaseName = $class.className;
   
    this.loadComponent(StudentMenu.BASHBOARD, $class);
  }
  public toggle(mev,tev:MouseEvent):void{
    if(this.media.isActive("xs") || this.media.isActive("sm") ){
      if(mev.target.closest(".toggle-whole")){
        this.fixedSidebar.classList.toggle('active-toggle');
      }else if(!mev.target.closest(".student-fixed-sidebar")){
        this.fixedSidebar.classList.remove('active-toggle');
      }
    }
  }
  public classDetails:ClassDetails;
  public dashBoardClass= {classDetails:null,isLoad:false};

  private loadComponent(menu: StudentMenu, data: ClassDetails = null) {
    
    switch (menu) {
      case StudentMenu.BASHBOARD:
        this.dashBoardClass.classDetails = data;
        this.dashBoardClass.isLoad = true; 
        break;
      case StudentMenu.CLASSESS:
        break;
    }
  }
}
