import { ResponseModel } from './../../website/model/response.model';
import {
  Component,
  OnInit,

  ViewChild,
  AfterViewInit,

  ElementRef,
  OnDestroy
} from "@angular/core";
import { StudentMenu } from "../library/enums/studnet-menu.enum";
import { StudentHomepageService } from "./student-homepage-service";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { StudentLoginData } from "./student-login-model";
import { ClassDetails } from "./class-detail";
import { DataShareService } from "../../shared/services/data-share-service";
import { StudentAccountService } from "../shared/services/student-account-service";
import { Router } from "@angular/router";
import { LogOutService } from "../shared/services/logout-service";
import { DialogService } from "../shared/services/dialog-service";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { ExamEntity } from "src/app/shared/entities/exam-entity";
import { LocalStorageExam } from "../shared/cache-exam/localstorage-exam";
import { TestStatus } from "../shared/cache-exam/test-status";
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { SharedLoginService } from 'src/app/website/shared-login-service/shared.login.service';
import {  SafeUrl } from '@angular/platform-browser';
import { SplitExamLocalStorage } from '../exam-start/split.exam.localstorage';
import { Question } from '../library/interfaces/question-interface';
import { SearchEntity } from '../shared/entity/search-entity';
@Component({
  selector: "app-studenthomepage",
  templateUrl: "./studenthomepage.component.html",
  styleUrls: ["./studenthomepage.component.css"]
})
export class StudenthomepageComponent implements OnInit, AfterViewInit , OnDestroy{
  public allClasses: Array<any> = new Array<any>();
  public footerData: any;
  public studentData:any = null;
  constructor(
    private shareData: DataShareService ,
    private studenLoginData:StudentAccountService,
    private logout:LogOutService,
    private dialog:DialogService,
    private router:Router ,
    private media:MediaObserver ,
    private login:SharedLoginService,
    private http:StudentHomepageService,
   ) {}
  public screenX:string  = '';
  public html = document.querySelector("html");
  public clasessList:ClassDetails[] = [];
  public koshClasses:ClassDetails[] = [];
  public logoImage:string = "";
  public className:string = "";

  public startCachedExam():void{
    try{
      let local = localStorage || window.localStorage;
      if(local){
        let jsonString = local.getItem("exam");
        if(jsonString != null ){
          let exam = JSON.parse(jsonString);
          if("submitExam" in exam){
            let splitExam:SplitExamLocalStorage = <SplitExamLocalStorage> exam;
            this.startSplitInterruptedExam(splitExam);
          }else{
            this.startSingleInterruptedExam();
          }
        }
      }
    }catch(ex){
      alert(ex);
    }
  }

  public startSplitInterruptedExam(exam:SplitExamLocalStorage):void{
    let interruptExam:ExamEntity = exam.remainingExam[0];
    let userName:string = this.studentData.auth.userName;
    if( exam.userName.trim().toUpperCase() == userName.trim().toUpperCase()){
      const message = "You Have Pending Interuppted "+interruptExam.assignmentType +" : Class Name : "+interruptExam.className+" , Test Id : "+interruptExam.allBranchId +" , Subject Name : "+interruptExam.subjectName+" . Do You Want To Continue It ?";
      this.dialog.confirmDialog(message,()=>{
        this.startSplitExam(exam);
      });
    }
  }
  public startSingleInterruptedExam():void{
    try{
      if(localStorage){
        let examString = localStorage.getItem("exam");
        const exam =<LocalStorageExam> JSON.parse(examString);
        let userName = this.studentData.auth.userName;
        if(examString && exam && exam.userInfo.userName.trim()==userName){
          const message = "You Have Pending Interuppted "+exam.examData.assignmentType +" : Class Name : "+exam.classDetails.className+" , Test Id : "+exam.examData.allBranchId +" , Subject Name : "+exam.examData.subjectName+" . Do You Want To Continue It ?";
          this.dialog.confirmDialog(message,this.loadLocalStorageTest.bind(this));
        }
      }
    }catch(ex){
      console.log(ex);
      alert(ex);
    }
  }
  public showPoweredBy:boolean = false;
  ngOnInit() {

     if(!this.studenLoginData.studentLoginData){
       return;
     }
    //this.serverEvent(); // this is for automatic logout
    this.studentData = this.studenLoginData.studentLoginData;
    this.className = this.studentData.loginClass.className;
    this.logoImage = this.studentData.loginClass.classLogo;

    //AppConstant.instituteLogo = this.logoImage;


    this.showPoweredBy = !this.studentData.loginClass.removePoweredBy;

    //this.powerdByLogo = this.sanitizer.bypassSecurityTrustUrl(this.studentData.poweredByLogo);

    // this.powerdByLogo = "assets/kosh-data/koshedutech/institute-logo.jpg";
    this.powerdByLogo = this.studentData.poweredByLogo;

    this.clasessList = this.studentData.classess;
    this.koshClasses = this.studentData.koshClasses;

    this.footerData = { name: "", address: "" };
    this.showcaseName = this.studentData.info.studentName;

    // this is used to remove test reload data
    this.shareData.ExamStartData = null;
    this.initializeStudent();
    this.startCachedExam(); // this function start cached exams
  }
  public saniTizeImageUrl(url:string):SafeUrl{
    return   url;    // this.sanitizer.bypassSecurityTrustUrl(url);
  }
  public examLoader = {isLoad:false};
  public startSplitExam(exam:SplitExamLocalStorage):void{
      this.shareData.splitExam = exam.remainingExam;
      this.shareData.solvedPapers = exam.submitExam;
      this.shareData.ClassDetails = exam.classDetails;
      AppConstant.instituteLogo = exam.classDetails.classLogo;
      if(Array.isArray(this.shareData.splitExam) && this.shareData.splitExam.length > 0){
        this.shareData.splitExam[0].testStaus = TestStatus.pending;
        if(exam.strictTime){
          this.examLoader.isLoad = false;
          //this.dialog.showAlert("This Exam Operation Is On Pending. Sorry For Your Inconvenience.",{height:300,width:500});
        }else{
          this.shareData.splitExam[0].duration = this.shareData.splitExam[0].remainingTime.toString();
          this.examLoader.isLoad = true;
        }
      }
        this.shareData.GotoHomePageByStudents = ()=>{
          this.examLoader.isLoad = false;
      }
  }

  public getExamTotalDuration(questions: Question[]): number{
    let totalDuration:number = 0;
    try{
      questions.forEach(question =>{
        totalDuration += question.eachQuestionSec;
       });
    }catch(ex){
      totalDuration = 0;
    }
    return totalDuration;
  }

  private getExamEndDateTime(exam:ExamEntity, totalExamDuration:number):string{
    let splitAssignmentDate: string[] = exam.assignmentDate.split(" ");
    let splitAssignmentTime: string[] = exam.assignmentTime.split(" ");
    if(splitAssignmentDate != null && splitAssignmentTime != null){
      let assignmentDateAndTime:string = `${splitAssignmentDate[0]} ${splitAssignmentTime[1]}`;
      let examEndDateTime:Date = new Date(assignmentDateAndTime);
      examEndDateTime.setSeconds((examEndDateTime.getSeconds() + totalExamDuration));
      let endDateTime:string = `${examEndDateTime.getFullYear()}-${(examEndDateTime.getMonth() + 1 )}-${examEndDateTime.getDate()} ${examEndDateTime.getHours()}:${examEndDateTime.getMinutes()}:${examEndDateTime.getSeconds()}`;
      return endDateTime;
    }
    return null;
  }

  public loadLocalStorageTest():void{
    try {
      if(localStorage){
        let localStorageExam = localStorage.getItem("exam");
        let cachedExam :LocalStorageExam  = <LocalStorageExam> JSON.parse(localStorageExam);
        AppConstant.instituteLogo = cachedExam.classDetails.classLogo;
        cachedExam.examData.testStaus = TestStatus.pending;
        this.shareData.ClassDetails = cachedExam.classDetails;
        this.shareData.ExamStartData = cachedExam.examData;
        if(cachedExam.strictTime){
          let exam:ExamEntity = cachedExam.examData;
          let totalExamDuration:number = this.getExamTotalDuration(exam.questions);
          let testEntDateTime:string = this.getExamEndDateTime(exam,totalExamDuration);
          let data:SearchEntity = <SearchEntity>{};
          data.examEndDateTime = testEntDateTime;
          this.http.getTestDuration(data).subscribe((response:HttpResponse<any>) =>{
            let data:ResponseModel = <ResponseModel>response.body;
            // exam.duration = String(data.data);
            if(data.result){
              exam.duration = String(data.data);
            }else{
              // this.dialog.showAlert(data.message,{height:300,width:500});
              this.examLoader.isLoad = false;
              exam.duration = String(0);
            }
            this.examLoader.isLoad = true;
          },(error:HttpErrorResponse)=>{
              this.dialog.showAlert(error.message,{height:300,width:500});
              this.examLoader.isLoad = false;
          });
        }else{
          this.examLoader.isLoad = true;
        }
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
    this.shareData.GotoHomePageByStudents = ()=>{
      this.examLoader.isLoad = false;
    }
  }
  public logOut():void{
    this.dialog.confirmDialog("Do You Really Want To LogOut ? ",()=>{
     this.logout.doLogOut().subscribe((res)=>{
       this.dialog.showAlert(res.message,{height:300,width:500});
       this.studentData.IsLogin = false;
       let timeout = setTimeout(()=>{
          let logoutLink = "/" ;
          if(this.login.appType == AppConstant.LOGIN_TYPE_BYLINK){
            logoutLink = AppConstant.LOGOUT_LINK_OF_LINKAPP.concat("/"+this.login.instituteLink);
            this.router.navigate([logoutLink]);
          }else if(this.login.appType == AppConstant.LOGIN_TYPE_ANDROID){
            logoutLink = AppConstant.LOGOUT_LINK_OF_LINKAPP.concat("/"+this.login.instituteLink);
            this.router.navigate([logoutLink]);
          }else{
            this.router.navigate([logoutLink]);
          }
      },1500);
     },(error:HttpErrorResponse)=>{
       if(error.status == 0){
         this.dialog.showAlert("Internet connection lost . please retry.",{height:300,width:500});
       }else if(error.status == 500){
        this.dialog.showAlert(error.message,{height:300,width:500});
       }

     });
    });
 }
  public isLoaded: boolean = false;
  public studentloginData: StudentLoginData = <StudentLoginData>{};
  public initializeStudent(): void {
        if(this.studentData){
          this.studentloginData.address = this.studentData.info.address;
          this.studentloginData.batch = this.studentData.info.batch;
          this.studentloginData.course = this.studentData.info.course;
          this.studentloginData.division = this.studentData.info.division;
          this.studentloginData.emailId = this.studentData.info.emailId;
          this.studentloginData.gender = this.studentData.info.gender;
          this.studentloginData.mobileNo = this.studentData.info.mobileNo;
          this.studentloginData.studentId = this.studentData.info.studentId;
          this.studentloginData.studentName = this.studentData.info.studentName;
          this.studentloginData.uniqueClassName = this.studentData.auth.uniqueClassName;
          this.studentloginData.userName = this.studentData.auth.userName;
          this.studentloginData.passwor = this.studentData.auth.password;
          this.studentloginData.cloudKey = this.studentData.auth.cloudKey;
          this.studentloginData.studentLock = this.studentData.auth.studentLock;
          this.studentloginData.classList = <Array<ClassDetails>>(
            this.studentData.classess
          );
          this.isLoaded = false;
          this.showcaseName = "welcome " + this.studentloginData.studentName;
        }else{
          this.router.navigate(["/"]);
        }
  }
  public showCase:HTMLElement = null;
  @ViewChild("navbar",{read:ElementRef,static:false})
  public navbar: ElementRef;
  public fixedSidebar:HTMLElement = null;
  public contentContainer:HTMLElement = null;
  public mainDiv:HTMLElement = null;

  public adjustSideBarHeight():void{
    let container:HTMLElement = <HTMLElement> document.querySelector(".student-content-container");
    let showCase:HTMLElement = <HTMLElement> document.querySelector(".showcase");
    if(showCase && container ){
      let showCaseHeight = showCase.offsetHeight;
      let extra:number = 4;
      let minumsHeight = (showCaseHeight + 60 + extra );
      let totalHeight =  window.innerHeight;
      let actualHeight = totalHeight - minumsHeight;
      container.style.height = actualHeight + "px";
      let containerScrollHeight:number = container.scrollHeight;
      let powerdBy:HTMLElement = <HTMLElement> document.querySelector(".homepage-footer");
      if(powerdBy){
        if(containerScrollHeight <= actualHeight){
          powerdBy.classList.add("responsive-powerdby");
        }else{
          powerdBy.classList.remove("responsive-powerdby");
        }
      }
    }
  }





  // public adjustSideBarHeight():void{
  //   let navbarElem=this.navbar.nativeElement.querySelector(".new-navbar");
  //   if(this.showCase && this.navbar && navbarElem
  //      && this.contentContainer && this.mainDiv ){
  //     let extra = 8;
  //     let totalHeight =  document.body.offsetHeight;
  //     this.mainDiv.style.height = totalHeight +"px";


  //     let showcaseHeight = Number(this.showCase.offsetHeight);
  //     let navbarHeight = Number(navbarElem.offsetHeight);
  //     let sideBarHeight  = totalHeight - (showcaseHeight + navbarHeight + extra);
  //     //this.fixedSidebar.style.height = sideBarHeight+"px";

  //     this.contentContainer.style.height = sideBarHeight+"px";

  //   }
  // }
  ngOnDestroy(){
    window.onresize = null;
  }
  ngAfterViewInit() {
    this.showCase = document.querySelector(".showcase");
    //this.fixedSidebar = document.querySelector(".student-fixed-sidebar");
    this.contentContainer = document.querySelector(".student-content-container");
    this.mainDiv = document.querySelector(".main-div");
    this.adjustSideBarHeight();

    this.media.media$.subscribe((value:MediaChange)=>{
      this.adjustSideBarHeight();
     // this.setDefaultSideBar(value);
    });
    // if(this.media.isActive("xl") ||   this.media.isActive("lg") || this.media.isActive("md")){
    //   if(this.fixedSidebar){
    //     this.adjustSideBarHeight();
    //     if(this.fixedSidebar){
    //       this.fixedSidebar.classList.add('active-toggle');
    //     }

    //     this.hidetoggleButton = true;
    //   }
    // }
    // this.render2.listen(window,"click",(ev)=>{
    //     this.toggle(ev,null);
    // });
  }
  public powerdByLogo:SafeUrl = null;
  public hidetoggleButton:boolean = true;
  public setDefaultSideBar(value:MediaChange):void{
    if(value.mqAlias=="xl"||  value.mqAlias=="lg" || value.mqAlias=="md" ){
      if(this.fixedSidebar){
        if(this.fixedSidebar){
          this.fixedSidebar.classList.add('active-toggle');
        }
        this.hidetoggleButton = true;
      }
    }else{
      //this.fixedSidebar.classList.remove('active-toggle');
      if(this.fixedSidebar){
        this.fixedSidebar.classList.add('active-toggle');
      }

      this.hidetoggleButton = false;
    }
  }
  public showcaseName: string = "";
  public classSlogan: string = "";
  public clickOnClass($class: ClassDetails): void {
    this.showcaseName = $class.className;
    this.classSlogan = "we make you best !";
    this.footerData.name = $class.className;
    this.footerData.address = "N.A.";
    this.loadComponent(StudentMenu.BASHBOARD, $class);
  }
  public toggle(mev,tev:MouseEvent):void{
    if(this.media.isActive("xs") || this.media.isActive("sm") ){
      if(mev.target.closest(".toggle-whole")){
        if(this.fixedSidebar){
          this.fixedSidebar.classList.toggle('active-toggle');
        }


      }else if(!mev.target.closest(".student-fixed-sidebar")){
        if(this.fixedSidebar){
          this.fixedSidebar.classList.remove('active-toggle');
        }

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
  public closeDashobard():void{
    this.dashBoardClass.isLoad = false;
  }
}
