import { NumberUtility } from './../../shared/utility/number.utility';
import { small_dialog } from './../../website/model/dialog-parameter';

import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, Input, EventEmitter, Output, Inject, LOCALE_ID } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatRadioChange } from "@angular/material";
import { FormControl } from "@angular/forms";
import { StudentDetails } from "../../admin/entity/student-details";
import { Question } from "../library/interfaces/question-interface";
import { AnalysisService } from "./analysis-service";
import { ClassDetails } from "../studenthomepage/class-detail";
import { SearchTest } from "../analysis-search/search-test";
import { HttpErrorResponse ,HttpResponse } from "@angular/common/http";
import { ExamConstants } from "../library/interfaces/exam-constants";
import { TimeLibrary } from "../shared/library/time.library";
import { MediaQuery } from "../library/media-query";
import { DialogService } from "../shared/services/dialog-service";
import { AppConstant } from "src/app/shared/app-constant/app-constatnt";
import { formatDate } from '@angular/common';
import { SharedLoginService } from 'src/app/website/shared-login-service/shared.login.service';
import { StudentAccountService } from '../shared/services/student-account-service';
import { SafeUrl } from '@angular/platform-browser';
import { ExamUtility } from '../exam-start/matrix-option/exam.utility';
import { ResponseModel } from "src/app/website/model/response.model";
@Component({
  selector: "app-analysis-report",
  templateUrl: "./analysis-report.component.html",
  styleUrls: ["./analysis-report.component.css"],
  encapsulation : ViewEncapsulation.None
})
export class AnalysisReportComponent implements OnInit , AfterViewInit{
  public name: string;
  public examDates: FormControl = new FormControl("", []);
  public analysisOption:FormControl = new FormControl("1",[]);
  public footerData={};
  public testId: string = "";
  public examPattern: string = "";
  public chapterWise: string = "";
  public className:string = "";
  public koshBrandLogo:SafeUrl = null;
  public studentName:string = "";
  @ViewChild("paginator", { read: MatPaginator,static:false })
  private paginator: MatPaginator;
  public radioButton_Change(): void {}
  public dateSelect_Change(value: any): void {
    if (typeof value == "object") {
      this.displayRankData(value.subjects[0]);
      this.testSubjects = this.getTestSubjects(value.subjects);
      this.displayTestDetails(value.subjects[0]);
      this.isChapterWiseTest = value.isChapterWiseTest;
    }
  }



  // ngAfterViewInit() {
  //   this.adjustHeight();
  // }
  // public adjustHeight(): void {
  //   let viewPort = document.querySelector(".view-port") as HTMLDivElement;
  //   let body = document.querySelector("body");
  //   let innerHeight = body.offsetHeight;
  //   if (viewPort && body && innerHeight) {
  //     let viewPortHeight = innerHeight - (60);
  //     let perPerPixel = 100 / innerHeight;
  //     let heightInPercent = perPerPixel * viewPortHeight;
  //     viewPort.style.height = heightInPercent + "%";
  //   }
  // }

  public classDetails:ClassDetails = null;
  public testSolveStatus:string = "";
  public mainPercent_Click(): void {}
  constructor(
    private analysis: AnalysisService,
    private dialog:DialogService,
    private login:SharedLoginService,
    private student:StudentAccountService,
    @Inject(LOCALE_ID) private locale:string,
    ) {}
  public displayedColumns: string[] = [
    "index",
    "mark",
    "correctQuestion",
    "timeTaken",
    "noOfVisit",
    "subjectName",

  ];

  public dataSource = null;
  public solvedTest: Array<StudentDetails> = new Array<StudentDetails>();

  public currentSelectedTest: any = null;
  public allBranchRank: string = "";
  public branchRank: string = "";
  public divisionRank: string = "";
  public subDivisionRank = "";

  public correctQuestion: string = "";
  public wrongQuestion: string = "";
  public visitedQuestion: string = "";
  public notVisitedQuestion: string = "";
  public attemptedQuestion: string = "";
  public notAttemptedQuestion: string = "";
  public spendTime: string = "";
  public totalTime: string = "";
  public positiveMarks: string = "";
  public negativeMarks: string = "";
  public totalMarks: string = "";
  public outOfMarks: string = "";
  public outOfPercentile: string = "";
  public obtainedPercentile: string = "";
  public correctWrongProgress: string = "0";
  public attemptedNotAttemptedProgrss = "0";
  public visitedNotVisitedProgress = "0";
  public spendTimeTotalTimeProgress = "0";
  public positiveNegativeMarksProgress = "0";
  public totalMarksOutOfMarksProgress = "0";
  public analysisCriterial: string = null;
  public obtainedOutOfPercentileProgress = "0";
  public testDescription: string = "";
  public isChapterWiseTest: boolean = false;
  public outOfTime: string = "";
  public getMarkColor(question:Question):string{

    return ExamUtility.getColorByMarks(question);
  }

  public displayTestDetails(test: StudentDetails): void {

    try{
      this.testSolveStatus = test.testSolveStatus;
      this.correctQuestion = test.rightQuestion;
      this.wrongQuestion = test.wrongQuestion;
      this.visitedQuestion = test.totalVisitedQuestion;
      this.notVisitedQuestion = test.notVistedQuestion;
      this.attemptedQuestion = test.totalAttemptedQuestion;
      this.notAttemptedQuestion = test.notAttemptedQuestion;
      this.spendTime = TimeLibrary.convertSecondInToHourFormat(
        Number(test.totalTime)
      );
      this.totalTime = TimeLibrary.convertSecondInToHourFormat(
        Number(this.classData.duration) * 60
      );
      this.spendTimeTotalTimeProgress = this.getTotalTimeAndSpendTimePercentage(
        test
      );
      this.positiveMarks = test.totalPositiveMarks;
      this.negativeMarks = test.totalNegativeMarks;
      this.totalMarks = test.totalMarks;
      this.outOfMarks = test.outOfMarks;
      this.correctWrongProgress = this.getRightWrongPercentage(test);
      this.attemptedNotAttemptedProgrss = this.getAttemptedPercentage(test);
      this.visitedNotVisitedProgress = this.getVisitedPercentage(test);
      this.positiveNegativeMarksProgress = this.getPositiveMarksPercentage(test);
      this.totalMarksOutOfMarksProgress = this.getTotalMarksPercentage(test);
      let questions = <Array<Question>>JSON.parse(test.questions);
      if (!Array.isArray(questions)) {
        questions = [];
      } else {
        questions = this.generateQuestionIndex(questions);
      }
      this.dataSource = new MatTableDataSource<Question>(questions);
      this.dataSource.paginator = this.paginator;
    }catch(error){
      this.dialog.showAlert("Display Test Details : "+error,{height:200,width:500});
    }
  }
  public getFormatedDate(date:string):string{
    return formatDate(date,"EEEE, MMMM d, y hh:mm:ss",this.locale);
  }
  public getTotalTimeAndSpendTimePercentage(test: StudentDetails): string {
    let percentage: string = "0";
    let sum = Number(test.totalTime) + Number(this.classData.duration) * 60;
    if (sum > 0) {
      percentage = ((Number(test.totalTime) / sum) * 100).toString();
    }
    return percentage;
  }

  public getRightWrongPercentage(test: StudentDetails): string {
    let percentage: string = "0";
    let sum = Number(test.rightQuestion) + Number(test.wrongQuestion);
    if (sum > 0) {
      percentage = ((Number(test.rightQuestion) / sum) * 100).toString();
    }
    return percentage;
  }
  public getAttemptedPercentage(test: StudentDetails): string {
    let percentage: string = "0";
    let sum =
      Number(test.totalAttemptedQuestion) + Number(test.notAttemptedQuestion);
    if (sum > 0) {
      percentage = (
        (Number(test.totalAttemptedQuestion) / sum) *
        100
      ).toString();
    }
    return percentage;
  }
  public getVisitedPercentage(test: StudentDetails): string {
    let percentage: string = "0";
    let sum =
      Number(test.totalVisitedQuestion) + Number(test.notVistedQuestion);
    if (sum > 0) {
      percentage = ((Number(test.totalVisitedQuestion) / sum) * 100).toString();
    }
    return percentage;
  }
  public getPositiveMarksPercentage(test: StudentDetails): string {
    let percentage: string = "0";
    let sum = Number(test.totalPositiveMarks) + Number(test.totalNegativeMarks);
    if (sum > 0) {
      percentage = ((Number(test.totalPositiveMarks) / sum) * 100).toString();
    }
    return percentage;
  }
  public getTotalMarksPercentage(test: StudentDetails): string {
    let percentage: string = "0";
    let sum = Number(test.totalMarks) + Number(test.outOfMarks);
    if (sum > 0) {
      percentage = ((Number(test.totalMarks) / sum) * 100).toString();
    }
    return percentage;
  }
  public getPercentilePrgressPercentages(obtained:string,total:string):string{
    let progress = "0";
    try {
      let sum = Number(obtained) + Number(total);
      if(sum>0){
        progress =( (Number(obtained)/Number(total) )*100).toString() ;
      }
    } catch (error) {
      progress = error;
    }
    return progress;
  }

  public displayOnlyRankOnce(test: StudentDetails):void{
    this.allBranchRank = (test.allBranchRank=="0")?"-":test.allBranchRank;
    this.branchRank = (test.branchRank =="0")?"-":test.branchRank;
    this.divisionRank = (test.divisionRank =="0"?"-":test.divisionRank);
    this.subDivisionRank = (test.subDivisionRank=="0")?"-":test.subDivisionRank;
  }
  public displayRankData(test: StudentDetails): void {
    this.currentPercentages = (test.percentage);
    this.currentSubject = test.subjectName;
    this.currentPercentages = test.percentage;
    this.currentSubject = test.subName;
  }
  public isCorrectQuestion(question: Question): boolean {
    if (
      question.status &&
      question.status == ExamConstants.SOLVED &&
      question.correctQuestion
    ) {
      return true;
    }
    return false;
  }
  public isWrongQuestion(question: Question): boolean {
    if (
      question.status &&
      question.status == ExamConstants.SOLVED &&
      question.correctQuestion == false
    ) {
      return true;
    }
    return false;
  }
  public isNotAttemptedQuestion(question: Question): boolean {
    if (
      question.status &&
      question.status != ExamConstants.SOLVED &&
      question.correctQuestion != true
    ) {
      return true;
    }
    return false;
  }






  public testSubjects: Array<StudentDetails> = new Array<StudentDetails>();
  public mapValue(value: any): string {
    return value.date;
  }
  public testData = {
    ownAnalysis: [],
    topperAnalysis: []
  };
  public classData: SearchTest = <SearchTest>{};
    ngOnInit() {
      this.studentName = this.student.studentLoginData.info.studentName;

      this.koshBrandLogo = AppConstant.instituteLogo;//this.student.studentLoginData.loginClass.classLogo;
      this.examDates.valueChanges.subscribe((value: any) => {
      this.analysisOption.setValue('own',{onlySelf:true});
      this.displayOnlyRankOnce(this.testData.ownAnalysis[0]);
      this.dateSelect_Change(value);
    });
    //this.analysisCriterial = localStorage.getItem("analysisCriterial");
    if (!this.classData) {
      this.dialog.showAlert("Invalid Parameter Passed",{height:200,width:500});
    }
    // localStorage.removeItem("analysisCriterial");
    // this.classData = <SearchTest>JSON.parse(this.analysisCriterial);

    this.className = this.classData.className;
    this.startExecution();
  }

  @Input("testSearchData")
  public set setTestSearchData(searchData:SearchTest){
      this.classData = searchData;


  }
  @Output("close")
  public closeEventEmitter:EventEmitter<void> = new EventEmitter<void>();
  public close():void{
    this.closeEventEmitter.emit();
  }

  public isLoaded: boolean = false;
  public topperRecord:Array<any> = new Array<any>();
  // this is entry point for data source
  private startExecution(): void {
    this.isLoaded = true;
    try {
    const data = {
      testId: this.classData.testId,
      uniqueClassName: this.classData.uniqueClassName,
      batch: this.classData.batch,
      course: this.classData.course,
      branch: this.classData.branch,
      division: this.classData.division,
      subDivision: this.classData.subDivision,
      pkId:this.classData.pkId
    };
    this.analysis.getTestResults(data).subscribe(
        (res:HttpResponse<ResponseModel>) => {
          let responseData:ResponseModel = res.body;
          console.log(responseData);
          if(responseData.data==null){
            this.dialog.showAlert(responseData.message,small_dialog);
          }else if (responseData.data.length < 1) {
            this.dialog.showAlert("Test Analysis Not Available. Please Solve Test First.",{height:200,width:500});
          }
          else  {
            this.topperRecord = responseData.topperData;
            this.testData.ownAnalysis = responseData.data;
            if(responseData.data && responseData.data.length > 0){
              this.examDates.setValue(responseData.data[0], { onlySelf: true });
              this.displayFirstRecord(responseData.data[0]);
            }
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
    } catch (error) {
      this.isLoaded = false;
      this.dialog.showAlert("startExecution : "+error,{height:300,width:500});
    }
  }
  public showAnalysis(radio:MatRadioChange):void{
    switch(radio.value){
      case 'own':
                  this.displayOnlyRankOnce(this.testData.ownAnalysis[0]);
                  this.dateSelect_Change(this.examDates.value);
                  break;
      case 'topper':
                    let ownUserName    = (this.testData.ownAnalysis && this.testData.ownAnalysis[0] && this.testData.ownAnalysis[0].subjects && this.testData.ownAnalysis[0].subjects[0]['userName'] )?this.testData.ownAnalysis[0].subjects[0]['userName'].toUpperCase():"";
                    let topperUserName = (this.topperRecord && this.topperRecord[0] && this.topperRecord[0].subjects && this.topperRecord[0].subjects[0] && this.topperRecord[0].subjects[0]['userName'])?this.topperRecord[0].subjects[0]['userName'].toUpperCase() :"not";
                    let allBranchRank  = (this.topperRecord && this.topperRecord[0] && this.topperRecord[0].subjects && this.topperRecord[0].subjects[0] && this.topperRecord[0].subjects[0]['allBranchRank']) ;
                    if(allBranchRank == null || allBranchRank == undefined
                    || allBranchRank.trim().length < 1 ||   (!allBranchRank.match(/^[0-9]+$/)) ||  Number(allBranchRank.trim())== 0){
                        this.dialog.showAlert("Topper Not Calculated..!",{height:300, width:500});
                        return;
                    }
                    if(ownUserName == topperUserName){
                      this.dialog.showAlert("Congratulations..! You Are The Topper. ",{height:300, width:500});
                    }else{
                      this.displayFirstRecord(this.topperRecord[0]);
                    }
                    break;
      }
  }

  public  displayNumber(x:any):any{
    return NumberUtility.correctNumber(x);
  }




  public currentPercentages: string = "";
  public currentSubject: string = "";
  public percentileProgress:string = "0";
  // display first record of test analysis
  public displayFirstRecord(data: any = null) {
    try {
      if (data != null) {
        this.testSubjects = this.getTestSubjects(data.subjects);
        this.displayTestDetails(data.subjects[0]);
        this.examPattern = data.patternName;
        this.testId = data.allBranchId;
        this.allBranchRank = data.allBranchRank;
        this.branchRank = data.branchRank;
        this.divisionRank = data.divisionRank;
        this.subDivisionRank = data.subDivisionRank;
        this.isChapterWiseTest = data.isChapterWiseTest;
        this.testDescription = data.testDescription;
        this.currentPercentages = data.subjects[0].percentage;
        this.currentSubject = data.subjects[0].subName;
        this.obtainedPercentile = data.obtainedPercentile;
        this.outOfPercentile = data.obtainedPercentile;
        this.percentileProgress = this.getPercentilePrgressPercentages(this.obtainedPercentile,this.outOfPercentile);
        let questions = <Array<Question>>(
          JSON.parse(data.subjects[0].questions)
        );
        if (!Array.isArray(questions)) {
          questions = [];
        } else {
          questions = this.generateQuestionIndex(questions);
        }
        this.dataSource = new MatTableDataSource<Question>(questions);
        this.dataSource.paginator = this.paginator;
      }
       // display last test records ranks in descending order..!
      //this.displayOnlyRankOnce(data[data.length-1].subjects[0]);
      // display first record rank
      this.displayOnlyRankOnce(data.subjects[0]);

    } catch (error) {
      this.dialog.showAlert("Display First Record : "+ error,{height:200,width:500});
    }
  }

  public getTestSubjects(
    dataSource: Array<StudentDetails>
  ): Array<StudentDetails> {
    let subjects = [];
    for (let i = 1; i < dataSource.length; i++) {

      subjects.push(dataSource[i]);
    }
    return subjects;
  }
  private generateQuestionIndex(questions: Array<Question>): Array<Question> {
    let indexedQuestions: Array<Question> = new Array<Question>();
    for (let i = 0; i < questions.length; i++) {
      questions[i].index = (i + 1).toString();
      indexedQuestions.push(questions[i]);
    }
    return questions;
  }
  public tableContainer:HTMLElement= null;


  ngAfterViewInit():void{
    this.mainDivision = document.querySelector(".ana-main");
    this.tableContainer = document.querySelector(".ana-table-section");
    this.analysisSectionContainer = document.querySelector(".ana-main-analyis-container");
    this.hideTableOnMobileViewDefault();
    this.setDefaultScreenHeight();

    window.addEventListener("resize",(ev)=>{
      this.setDefaultScreenHeight();
      if(!MediaQuery.isMobileDevice() && this.tableContainer){
          this.tableContainer.classList.remove("ana-deactive-table");
          this.tableContainer.classList.remove('ana-mobile-active-table');
          this.tableContainer.classList.add("ana-desktop-active-table");
        }else{
          this.hideTableOnMobileViewDefault();
        }
    });
  }
  public hideTableOnMobileViewDefault():void{
    if(MediaQuery.isMobileDevice()){
      this.tableContainer.classList.add("ana-deactive-table");
    }else{
      this.tableContainer.classList.remove("ana-deactive-table");
      this.tableContainer.classList.remove('ana-mobile-active-table');
      this.tableContainer.classList.add("ana-desktop-active-table");
    }
  }

  public toggleTable_click(ev):void{
      ev = ev || window.event;
      if(MediaQuery.isMobileDevice()){
        this.tableContainer.classList.remove("ana-deactive-table");
        this.tableContainer.classList.remove("ana-desktop-active-table");
        this.tableContainer.classList.toggle('ana-mobile-active-table');
      }
  }
  // private isMobileDevice():boolean{
  //   let media = window.matchMedia("(min-width:300px) and (max-width:900px)");
  //   if(media.matches && this.tableContainer){
  //     return true;
  //   }
  //   return false;
  // }
  private mainDivision:HTMLElement = null;
  private analysisSectionContainer:HTMLElement = null;
  private setDefaultScreenHeight():void{
    if(this.mainDivision && this.analysisSectionContainer){
      if(!MediaQuery.isMobileDevice()){
        let totalHeight = this.mainDivision.offsetHeight;
        let analysisHeight =  (totalHeight - 60) + "px";
        this.analysisSectionContainer.style.height = analysisHeight;
      }else{
        let totalHeight = this.mainDivision.offsetHeight;
        let analysisHeight =  (totalHeight - 60 - 10) + "px";
        this.analysisSectionContainer.style.height = analysisHeight;
      }
    }
  }


}
