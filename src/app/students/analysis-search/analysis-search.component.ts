import { Component, OnInit, Inject, LOCALE_ID, EventEmitter, Output, AfterViewInit } from "@angular/core";
import { DataShareService } from "../../shared/services/data-share-service";
import { ClassDetails } from "../studenthomepage/class-detail";
import { SearchAnalysisService } from "./search-analysis-service";
import { HttpErrorResponse , HttpResponse} from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { DateTimeUtility } from "../../shared/utility/date-time-utility";
import { SearchAssignment } from "../serach-assignment/search-assignmnet";
import { SearchTest } from "./search-test";
import { Route, Router } from "@angular/router";
import { formatDate } from "@angular/common";
import { DialogService } from "../shared/services/dialog-service";
import { MediaObserver } from "@angular/flex-layout";
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { ResponseModel } from "src/app/website/model/response.model";
@Component({
  selector: "app-analysis-search",
  templateUrl: "./analysis-search.component.html",
  styleUrls: ["./analysis-search.component.css"]
})

export class AnalysisSearchComponent implements OnInit , AfterViewInit {
  private classDetails: ClassDetails = null;
  public weekDateControl: FormControl = new FormControl("", []);
  public dayControl: FormControl = new FormControl("", []);
  public dateWisePatternControl: FormControl = new FormControl("ALL", []);
  public dateWiseSubjectControl: FormControl = new FormControl("ALL", []);
  public chapterWisePatternControl: FormControl = new FormControl("ALL", []);
  public chapterWiseSubjectControl: FormControl = new FormControl("ALL", []);
  public chapterControl: FormControl = new FormControl("ALL", []);
  public isLoaded: boolean = false;
  public subjects: Array<string> = [
    "ALL",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "PCM",
    "PCB"
  ];
  public pattern: Array<string> = [
    "ALL",
    "JEE",
    "JEE Advance",
    "NEET",
    "MHT-CET"
  ];

  constructor(
    private shareData: DataShareService,
    private analysisService: SearchAnalysisService,
    private router: Router,
    private dialog:DialogService,
    private media:MediaObserver,
    @Inject(LOCALE_ID) private local: string
  ) {}

  public allWeekDates: Array<{ startDate: ""; endDate: "" }> = new Array<{
    startDate: "";
    endDate: "";
  }>();
  public showAnalysis: boolean = false;
  public className:string = '';
  public contentDiv:HTMLElement = null;
  public adjustScreen():void{
    if(this.contentDiv){
      let totalHeight = document.body.offsetHeight;
      let bodyHeight = totalHeight - (60 + 15) ;// 60 refer to navbar height & 10 refer to extra height
      this.contentDiv.style.height = bodyHeight+"px";
      this.contentDiv.style.overflow="auto";
    }
  }
  ngAfterViewInit(){
    this.contentDiv = document.querySelector(".asearch-search-section");

    this.media.media$.subscribe((value)=>{
      this.adjustScreen();
    });
  }
  public logoImage:string = null;
  ngOnInit() {
    this.logoImage = AppConstant.instituteLogo;
    this.goToHome = this.close.bind(this);
    this.classDetails = this.shareData.ClassDetails;
    this.className = this.classDetails.className;
    this.loadServerData();
    this.weekDateControl.valueChanges.subscribe(value => {});
    this.chapterWiseSubjectControl.valueChanges.subscribe(value => {
      this.getChapterNames();
    });
  }
  public goToHome:()=>void;
  @Output("close")
  public closeEventEmiter:EventEmitter<void> = new EventEmitter<void>();
  public close():void{
    this.closeEventEmiter.emit();
  }
  public analysisReport = {testData:null,isLoad:false};
  public reviewReport = {testData:null , isLoad:false};
  //  this function load data from server
  public loadServerData(): void {
    this.isLoaded = true;
    const data = <any>{};
    data.uniqueClassName = this.classDetails.uniqueClassName;
    data.batch = this.classDetails.batch;
    data.course = this.classDetails.course;
    data.division = this.classDetails.division;
    data.subDivision = this.classDetails.subDivision;
    this.analysisService.getAllWeekDates(data).subscribe(
      (res:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = res.body;
        this.allWeekDates = responseModel.data.data;
        if(responseModel.result==false){
          this.dialog.showAlert(responseModel.message,{height:200,width:500});
        }else{
          this.setCurrentWeek();
        }
        this.isLoaded = false;
      },
      (error: HttpErrorResponse) => {
        if(error.status == 0){
          this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,{height:300,width:500});
          this.isLoaded = false;
          return;
        }
        this.dialog.showAlert(error.message,{height:300,width:500});
        this.isLoaded = false;
      }
    );
  }
  private setCurrentWeek(): void {
    for (var i = 0; i < this.allWeekDates.length; i++) {
      let week = this.allWeekDates[i];
      let currentDate = DateTimeUtility.getCurrentDateInDbFormat();
      if (DateTimeUtility.isDateExistInWeek(week, currentDate)) {
        this.weekDateControl.setValue(week, { onlySelf: true });
        this.dayControl.setValue(currentDate, { onlySelf: true });
        break;
      }
    }
    if (i == this.allWeekDates.length) {
      this.weekDateControl.setValue(this.allWeekDates[0], { onlySelf: true });
    }
  }
  public allChapters: Array<string> = new Array<string>();

  public getChapterNames(): void {
    this.isLoaded = true;
    const data = <any>{};
    data.uniqueClassName = this.classDetails.uniqueClassName;
    data.batch = this.classDetails.batch;
    data.course = this.classDetails.course;
    data.division = this.classDetails.division;
    data.subDivision = this.classDetails.subDivision;
    data.subjectName = this.chapterWiseSubjectControl.value;
    data.patternName = this.chapterWisePatternControl.value;

    this.analysisService.getChapterNames(data).subscribe(
      (res:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = res.body;
        if(responseModel.result){
          this.allChapters = responseModel.data;
        }else{
          this.dialog.showAlert(responseModel.message,{height:200,width:500});
        }
        this.isLoaded = false;
      },
      (error: HttpErrorResponse) => {
        if(error.status == 0){
          this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,{height:300,width:500});
          this.isLoaded = false;
          return;
        }
        this.dialog.showAlert(error.message,{height:300,width:500});
        this.isLoaded = false;
      }
    );
  }
  public allSearchedTest: Array<SearchTest> = new Array<SearchTest>();
  public searchapterWiseTest(): void {
    this.isLoaded = true;
    const data = <any>{};
    data.uniqueClassName = this.classDetails.uniqueClassName;
    data.batch = this.classDetails.batch;
    data.course = this.classDetails.course;
    data.division = this.classDetails.division;
    data.subDivision = this.classDetails.subDivision;
    data.subjectName = this.chapterWiseSubjectControl.value;
    data.patternName = this.chapterWisePatternControl.value;
    data.chapterName = this.chapterControl.value;
    data.branch = this.classDetails.branch;
    this.allSearchedTest = [];
    this.analysisService.searchChapterWiseTest(data).subscribe(
      (res:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = res.body;
        if(responseModel.result){
          this.allSearchedTest = this.prepareTestDescription(responseModel.data.data);
        }else{
          this.dialog.showAlert(responseModel.message,{height:200,width:500});
        }
        this.isLoaded = false;
      },
      (error: HttpErrorResponse) => {
        if(error.status == 0){
          this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,{height:300,width:500});
          this.isLoaded = false;
          return;
        }
        this.dialog.showAlert(error.message,{height:300,width:500});
        this.isLoaded = false;
      }
    );
  }
  public dateWiseSearchTest(): void {
    this.isLoaded = true;
    const data = <any>{};
    data.uniqueClassName = this.classDetails.uniqueClassName;
    data.batch = this.classDetails.batch;
    data.course = this.classDetails.course;
    data.division = this.classDetails.division;
    data.subDivision = this.classDetails.subDivision;
    data.subjectName = this.dateWiseSubjectControl.value;
    data.patternName = this.dateWisePatternControl.value;
    data.chapterName = null;
    data.branch = this.classDetails.branch;
    data.fromDate = this.dayControl.value;
    this.allSearchedTest = [];
    this.analysisService.searchChapterWiseTest(data).subscribe(
      (res:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = res.body;
        if(responseModel.result){
          this.allSearchedTest = this.prepareTestDescription(responseModel.data);
        }else{
          this.dialog.showAlert(responseModel.message,{height:200,width:500});
        }
        this.isLoaded = false;
      },
      (error: HttpErrorResponse) => {
        if(error.status == 0){
          this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,{height:300,width:500});
          this.isLoaded = false;
          return;
        }
        this.dialog.showAlert(error.message,{height:300,width:500});
        this.isLoaded = false;
      }
    );
  }
  private prepareTestDescription(dataSource: SearchTest[]): SearchTest[] {
    dataSource.forEach((test, index) => {
      // test.assignmentDate = formatDate(test.assignmentDate, "MMMM d, y ", this.local);
      test.assignmentDate = formatDate(test.assignmentDate, "dd-MM-yyyy", this.local);
      // test.testDescription =
      //   "[ Test Date :" +
      //   formatDate(test.assignmentDate, "dd-MM-yyy", this.local) +
      //   " ]" +
      //   "[ Test Description : " +
      //   test.testDescription +
      //   " ]";
    });
    return dataSource;
  }
  public displayTestMessage(test:SearchTest , message:string):boolean{
    if(test.isLockTest){
      this.dialog.showAlert(message,{height:200,width:500});
      return false;
    }
    return true;
  }
  public displayTestAnalysis(test: SearchTest): void {
    let message  = "Analysis Will Display On Date : "+test.solutionDate+" At "+test.solutionTime+" !.";
    if(this.displayTestMessage(test,message)){
      test.className = this.classDetails.className;
      this.analysisReport.isLoad = true;
      this.analysisReport.testData = test;

    }

  }
  public displayTestReview(test: SearchTest): void {
    let message  = "Review Will Display On Date  : "+test.solutionDate+" At "+test.solutionTime+" !.";
    if(this.displayTestMessage(test,message)){
      test.className =  this.classDetails.className;// this.shareData.ClassDetails.className;
      this.reviewReport.isLoad = true;
      this.reviewReport.testData = test;
    }
    // let json = JSON.stringify(test);
    // localStorage.setItem("reviewCriterial", json);
    // window.open("exam-review");

  }
}
