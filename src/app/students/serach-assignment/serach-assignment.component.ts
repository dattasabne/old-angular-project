import { small_dialog } from './../../website/model/dialog-parameter';
import { ResponseModel } from './../../website/model/response.model';
import {
  Component,
  OnInit,
  Inject,
  LOCALE_ID,
  AfterViewInit,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { SearchExamService } from "./search-assignment-service";
import { SearchEntity } from "../shared/entity/search-entity";
import { HttpErrorResponse ,HttpResponse } from "@angular/common/http";
import { SearchAssignment } from "./search-assignmnet";
import { DataShareService } from "../../shared/services/data-share-service";
import { ExamEntity } from "../../shared/entities/exam-entity";
import { FormControl } from "@angular/forms";
import { ClassDetails } from "../studenthomepage/class-detail";
import { SearchAnalysisService } from "../analysis-search/search-analysis-service";
import { DateTimeUtility } from "../../shared/utility/date-time-utility";
import { formatDate } from "@angular/common";
import { DialogService } from "../shared/services/dialog-service";
import { MediaObserver } from "@angular/flex-layout";
import { StudentAccountService } from '../shared/services/student-account-service';
import { SafeUrl } from '@angular/platform-browser';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { TestAttempted } from 'src/app/website/model/test.attempted';
import { SearchTest } from '../analysis-search/search-test';
@Component({
  selector: "app-serach-assignment",
  templateUrl: "./serach-assignment.component.html",
  styleUrls: ["./serach-assignment.component.css"]
})
export class SerachAssignmentComponent implements OnInit , AfterViewInit {
  public allAssignments: Array<any> = new Array<any>();
  public displayTest: Array<SearchAssignment> = new Array<SearchAssignment>();
  public isLoaded: boolean = false;
  public classData: ClassDetails = null;
  public examStartForm = {
    isLoad:false
  }
  constructor(
    private httpService: SearchExamService,
    private share: DataShareService,
    private analysisService: SearchAnalysisService,
    private dialog:DialogService,
    private media:MediaObserver,
    private student:StudentAccountService,
    @Inject(LOCALE_ID) private loacale: string
  ) {}
    @Input("allAssignmnetData")
    public set AllAssignmnetsData(allAssignments:Array<any>){
      this.allAssignments = allAssignments;
    }
    public goToHome:()=>void;
    @Output("close")
    public closeEmitter:EventEmitter<void> = new EventEmitter<void>();
    public close():void{
      this.closeEmitter.emit();
    }
    public contentDiv:HTMLElement = null;
    public adjustScreen():void{
      if(this.contentDiv){
        let totalHeight = document.body.offsetHeight;
        let bodyHeight = totalHeight - (60 + 15) ;// 60 refer to navbar height & 10 refer to extra height
        this.contentDiv.style.height = bodyHeight+"px";
        this.contentDiv.style.overflow="auto";
      }
    }
  public className:string = '';
  ngAfterViewInit():void{
    this.contentDiv =document.querySelector(".search-assi-main-content-div");
    this.media.media$.subscribe((value)=>{
      this.adjustScreen();
    });
  }
  public logoImage:SafeUrl = "";
  ngOnInit() {
    this.goToHome=this.close.bind(this);
    this.filterTest(this.allAssignments);
    this.displayTest = this.prepareTestDescription(this.displayTest);

    this.logoImage = AppConstant.instituteLogo;
    this.classData = this.share.ClassDetails;
    this.className = this.classData.className;
    this.dateWisePatternControl.setValue(this.examPattern[0], {
      onlySelf: true
    });
    this.chapterWisePatternControl.setValue(this.examPattern[0], {
      onlySelf: true
    });
    this.chapterWiseSubjectControl.valueChanges.subscribe(value => {
      this.getChapterNames();
    });
    this.getAllWeeks();
  }
  public allChapters: Array<string> = new Array<string>();
  public getChapterNames(): void {
    this.isLoaded = true;
    const data = <any>{};
    data.uniqueClassName = this.classData.uniqueClassName;
    data.batch = this.classData.batch;
    data.course = this.classData.course;
    data.division = this.classData.division;
    data.subDivision = this.classData.subDivision;
    data.subjectName = this.chapterWiseSubjectControl.value;
    data.patternName = this.chapterWisePatternControl.value.value;
    data.fromDate = this.dateWiseDayControl.value;
    data.assignmentStatus = this.chapterWiseStatusControl.value;
    this.analysisService.getChapterNames(data).subscribe(
      (res:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = res.body;
        this.allChapters = responseModel.data.data;
        this.isLoaded = false;
      },
      (error: HttpErrorResponse) => {
        this.dialog.showAlert(error.message,{height:300,width:500});
        this.isLoaded = false;
      }
    );
  }
  public filterTest(source: Array<any>): Array<SearchAssignment> {
    source.forEach(test => {
      let testData = <SearchAssignment>{};
      testData.duration = test.totalTime;
      testData.startTime = test.assignmentTime;
      testData.subjectName = test.subjectName;
      testData.testId = test.testId;
      testData.testType = test.assignemntType;
      testData.assignmentType = test.assignemntType;
      testData.pkid = test.studentDetailId;
      testData.testDescription = test.testDescription;
      testData.startDate = test.assignmentDate;
      testData.disableTest = test.disableTest;
      testData.allBranchId = test.allBranchId;
      testData.batch = test.batch;
      testData.course = test.course;
      testData.branch = test.branch;
      testData.division = test.division;
      testData.subDivision = test.subDivision;
      testData.uniqueClassName = test.uniqueClassName;
      testData.assignmentDate = test.assignmentDate;
      testData.assignmentTime = test.assignmentTime;
      this.displayTest.push(testData);
    });
    return this.displayTest;
  }
  public clickOnSearch(): void {
    //this.getAllAssignments();
  }

  public testProperLoaded(test:any):void{
    this.isLoaded = true;
    let data:SearchEntity = this.getSearchEntityForTest(test);
    this.httpService.loadExamPaper(data).subscribe((response:HttpResponse<ResponseModel>) =>{
      this.isLoaded = false;
      let responseModel:ResponseModel = response.body;


      if(responseModel.result){
        this.clickOnTest(test);
      }else{
        this.dialog.showAlert(responseModel.message,{height:300,width:500});
      }
    },(error:HttpErrorResponse) =>{
      this.isLoaded = false;
      this.dialog.showAlert(error.message,{height:300,width:500});
    });
  }
  public clickOnTest(test: any): void {
    if(test.disableTest){
      this.dialog.showAlert("The Test Will Be Start On Given Time. ",{height:200,width:500});
      return;
    }

    let message:string = "Do You Want Start Exam ? ";
    this.dialog.confirmDialog(message , ()=>{
      this.loadExamPaper(test);
    });
  }
  public startExam():void{
    this.isLoaded = false;
    this.examStartForm.isLoad = true;
  }
  public testLoadSuccessHandler(res:HttpResponse<ResponseModel>):void{
    let responseModel:ResponseModel = res.body;
    this.isLoaded = false;
    console.log(responseModel);
    if (!responseModel.result || !responseModel.data) {
      this.dialog.showAlert(responseModel.message,{height:200,width:500});
      return;
    }
    try{
      if(Array.isArray(responseModel.data)){
        if(responseModel.data.length <=1  ){
          this.dialog.showAlert("Test Not Properly Set",{height:200,width:500});
          return;
        }else{
          this.share.splitExam = <ExamEntity[]>responseModel.data;
          if(this.isTestExpired(this.share.splitExam[0])){
            return;
          }
          this.share.splitExam[0].testAttemptedData = <TestAttempted> responseModel.testAttemptedData;
          this.share.splitExam[1].testAttemptedData = <TestAttempted> responseModel.testAttemptedData;

          let firstSubject:string  = this.share.splitExam[0].questions[0].subjectName;

          let secondSubject:string = this.share.splitExam[1].questions[0].subjectName;
          let message:string = `Physics and Chemistry subjects will be displayed first after its submission Immediately ${secondSubject} subject will be displayed.`;
          this.dialog.okConfirmDialog(message,this.startExam.bind(this));
          return;
        }
      }else{
        this.share.ExamStartData = <ExamEntity>responseModel.data;
        if(this.isTestExpired(this.share.ExamStartData)){
          return ;
        }
        this.share.ExamStartData.testAttemptedData = <TestAttempted> responseModel.testAttemptedData;
        if( (!this.share.ExamStartData.questions) || this.share.ExamStartData.questions.length == 0){
          this.dialog.showAlert("Test Question Not Available",{height:200,width:500});
          return;
        }
      }
      this.startExam();
    }catch(ex){
      console.log(ex);
    }
  }
  private isTestExpired(exam:ExamEntity):boolean{
    let testDuration:number = 0;
    try{
      testDuration = Number(exam.duration);
    }catch(e){
      testDuration = 0;
    }
    if( testDuration <= 0){
      this.dialog.showAlert("Your Test Time Is Expired.",{height:300,width:500});
      return true;
    }
    return false;
  }
  public httpErrorResponseHandler(error:HttpErrorResponse):void{
    this.isLoaded = false;
    let message:string = "";
    if(error.status == 0){
      message = AppConstant.NOCONNECT_RESPONSE;
    }else{
      message = error.message;
    }
    this.dialog.showAlert(message,{height:300,width:500});
  }
  public getSearchEntityForTest(test:any):SearchEntity{
    const data = <SearchEntity>{};
    data.examId = test.pkid;
    data.branch = test.branch;
    data.course = test.course;
    data.batch  = test.batch;
    data.division = test.division;
    data.subDivision = test.subDivision;
    data.userName = this.student.studentLoginData.auth.userName;
    data.chapterName = test.testDescription;
    data.classBatch = this.classData.batch ;
    data.classBranch = this.classData.branch;
    data.classCourse = this.classData.course;
    data.classDivision = this.classData.division;
    data.classSubDivision = this.classData.subDivision;
    data.strictTime = this.classData.strictTime;
    return data;
  }
  public loadExamPaper(test:any): void {
    this.isLoaded = true;
    let data :SearchEntity = this.getSearchEntityForTest(test);
    this.httpService.loadExamPaper(data).subscribe({next:this.testLoadSuccessHandler.bind(this),error:this.httpErrorResponseHandler.bind(this)});
  }


  public dateWiseStatusControl: FormControl = new FormControl("PENDING", []);
  public dateWiseSubjectControl: FormControl = new FormControl("All", []);
  public dateWisePatternControl: FormControl = new FormControl("All", []);
  public dateWiseDayControl: FormControl = new FormControl("All", []);
  public dateWiseWeekControl: FormControl = new FormControl("All", []);

  public chapterWiseStatusControl: FormControl = new FormControl("ALL", []);
  public chapterWiseSubjectControl: FormControl = new FormControl("All", []);
  public chapterWisePatternControl: FormControl = new FormControl("All", []);
  public chapterWiseChapterControl: FormControl = new FormControl("All", []);

  public allWeekDates: Array<{ startDate: ""; endDate: "" }> = new Array<{
    startDate: "";
    endDate: "";
  }>();
  public allweek_SuccessHandler(res:HttpResponse<ResponseModel>){
    let responseModel:ResponseModel = res.body;
    this.isLoaded = false;

    if(responseModel.result == false){
      this.dialog.showAlert(responseModel.message,{height:200,width:500});
    }else{
      if(!responseModel.data){
        this.allWeekDates = [];
      }else{
        this.allWeekDates = responseModel.data.data;
        this.setCurrentWeek();
      }
    }
  }
  public getAllWeeks(): void {
    this.isLoaded = true;
    const data = <any>{};
    data.uniqueClassName = this.classData.uniqueClassName;
    data.batch = this.classData.batch;
    data.course = this.classData.course;
    data.division = this.classData.division;
    data.subDivision = this.classData.subDivision;

    this.analysisService.getAllWeekDates(data).subscribe({next:this.allweek_SuccessHandler.bind(this),error:this.httpErrorResponseHandler.bind(this)});
  }

  private setCurrentWeek(): void {
    if(!this.allWeekDates){
     return;
    }
    for (var i = 0; i < this.allWeekDates.length; i++) {
      let week = this.allWeekDates[i];
      let currentDate = DateTimeUtility.getCurrentDateInDbFormat();
      if (DateTimeUtility.isDateExistInWeek(week, currentDate)) {
        this.dateWiseWeekControl.setValue(week, { onlySelf: true });
        this.dateWiseDayControl.setValue(currentDate, { onlySelf: true });
        break;
      }
    }
    if (i == this.allWeekDates.length) {
      this.dateWiseWeekControl.setValue(this.allWeekDates[0], {
        onlySelf: true
      });
    }
  }
  public searchTestByFilter_SuccessHandler(res:HttpResponse<ResponseModel>):void{
    this.isLoaded = false;
    let responseModel:ResponseModel = res.body;
    if(!responseModel.result){
      this.dialog.showAlert(responseModel.message,small_dialog);
    }else{
      this.displayTest = this.prepareTestDescription(responseModel.data.data);
    }
  }


 // this function search test date Wise

  public dateWiseSearch(): void {
    this.isLoaded = true;
    const data = <SearchEntity>{};
    data.uniqueClassName = this.classData.uniqueClassName;
    data.batch = this.classData.batch;
    data.course = this.classData.course;
    data.division = this.classData.division;
    data.subDivision = this.classData.subDivision;
    data.assignmentStatus = this.dateWiseStatusControl.value;
    data.patternName = this.dateWisePatternControl.value.value;
    data.subjectName = this.dateWiseSubjectControl.value;
    data.fromDate = this.dateWiseDayControl.value;
    data.branch = this.classData.branch;
    this.httpService.searchTestByFilter(data).subscribe({next:this.searchTestByFilter_SuccessHandler.bind(this),error:this.httpErrorResponseHandler.bind(this)});
  }
  private prepareTestDescription(dataSource: SearchAssignment[]): SearchAssignment[] {
    if(!Array.isArray(dataSource)){
      return [];
    }
    dataSource.forEach((test, index) => {
      test.startDate = formatDate(test.startDate, 'dd-MM-yyyy', this.loacale);
    });
    return dataSource;
  }

  public chapterWiseSearch(): void {
    this.displayTest = [];
    this.isLoaded = true;
    const data = <SearchEntity>{};
    data.uniqueClassName = this.classData.uniqueClassName;
    data.batch = this.classData.batch;
    data.course = this.classData.course;
    data.division = this.classData.division;
    data.subDivision = this.classData.subDivision;
    data.branch = this.classData.branch;
    data.assignmentStatus = this.chapterWiseStatusControl.value;
    data.patternName = this.chapterWisePatternControl.value.value;
    data.subjectName = this.chapterWiseSubjectControl.value;
    data.chapterName = this.chapterWiseChapterControl.value;
    this.httpService.searchTestByFilter(data).subscribe({next: this.searchTestByFilter_SuccessHandler.bind(this),error: this.httpErrorResponseHandler.bind(this)});
  }
  public allSubjects = [
    "All",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "PCM",
    "PCB"
  ];

  public examStatus = ["ALL", "PENDING", "SOLVED", "UPCOMMING"];
  public examPattern = [
    {
      name: "All",
      value: "All"
    },
    {
      name: "JEE",
      value: "JEE"
    },
    {
      name: "JEE Advance",
      value: "JEE_Advance"
    },
    {
      name: "NEET",
      value: "NEET"
    },
    {
      name: "MHT-CET",
      value: "MHT-CET"
    }
  ];
}
