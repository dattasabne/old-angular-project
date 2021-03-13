import { Component, OnInit, Input, ViewChild, ViewEncapsulation, AfterViewInit, Renderer2, EventEmitter, Output } from "@angular/core";


import {MediaObserver} from '@angular/flex-layout';
import {
  MatTableDataSource,

  MatPaginator
} from "@angular/material";

import { StudentDetails } from "../../admin/entity/student-details";
import { ExamEntity } from "../../shared/entities/exam-entity";
import { Question } from "../library/interfaces/question-interface";
import { ExamConstants } from "../library/interfaces/exam-constants";
import { TimeLibrary } from "../shared/library/time.library";
import { Router } from "@angular/router";
import { DataShareService } from "src/app/shared/services/data-share-service";
import { ClassDetails } from "../studenthomepage/class-detail";
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { ExamUtility } from '../exam-start/matrix-option/exam.utility';
@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.css"]
})
export class ResultComponent implements OnInit,AfterViewInit{
  public name: string;
  public examResultData: Array<StudentDetails> = new Array<StudentDetails>();
  public questionStates: string = null;
  public examStateData: ExamEntity = null;
  public obtainedPercentages: number = 0;
  public outOfPercentages:number =100;
  public isLoaded: boolean = false;
  public correctWrongProgress: string = "0";
  public attemptedNotAttemptedProgrss = "0";
  public visitedNotVisitedProgress = "0";
  public spendTimeTotalTimeProgress = "0";
  public positiveNegativeMarksProgress = "0";
  public totalMarksOutOfMarksProgress = "0";
  public percentageProgress = "0";
  public className:string='';
  public spendTime:string = '';
  public totalTime:string = '';
  public homeCallBack:()=>void;
  public patternName:string = "";
  public testId:string = "";
  public assignmentType:string = "";
  public testSubmittedDateTime:string = "";
  public resultType:string = "";
  public attemptedStatus:string = "";

  @Input("result_type")
  public set result_type(resultType:string){
    this.resultType = resultType;
  }

  @Input("questionStates")
  public set puQuestinStates(qstates: string) {
    this.questionStates = qstates;
    this.examStateData = <ExamEntity>JSON.parse(qstates);
    this.patternName = this.examStateData.patternName;
    this.testId = this.examStateData.allBranchId;
    this.assignmentType = this.examStateData.assignmentType;
    this.testSubmittedDateTime = this.examStateData.testSubmitedDatetime;
    this.attemptedStatus = (this.examStateData.testAttemptedData.attempted)?'Re-Attempted' : '';
  }
  @Input("examResult")
  public set examResult(resultData: Array<StudentDetails>) {
    this.examResultData = resultData;
  }

  public getTestPercentage(): string {
    if (this.examResultData.length > 0) {
      return this.examResultData[0].percentage;
    }
    return "0";
  }
  public logoImage:string = null;
  ngAfterViewInit() {
    this.tableSection = document.querySelector(".result-table-section");
    this.adjustHeight();
    this.setDefaultTableSection();
    this.render2.listen(window,"resize",(ev)=>{
      this.adjustHeight();
      this.setDefaultTableSection();
    });
  }
  public adjustHeight(): void {
    let viewPort = document.querySelector(".result-view-port") as HTMLDivElement;

    let body = document.querySelector("body");
    let innerHeight = body.offsetHeight;
    if (viewPort && body && innerHeight && this.tableSection) {
      let viewPortHeight = innerHeight - (60);
      let perPerPixel = 100 / innerHeight;
      let heightInPercent = perPerPixel * viewPortHeight;
      viewPort.style.height = heightInPercent + "%";
      this.tableSection.style.height =viewPortHeight+"px";
    }
  }
  public setDefaultTableSection():void{
    if(this.tableSection){
      if(!this.isMobileDevice()){
        this.tableSection.classList.add("result-dekstop-pallete");
        this.tableSection.classList.remove("result-active-pallete");
      }else{
        this.tableSection.classList.add("result-deactive-pallete");
        this.tableSection.classList.remove("result-dekstop-pallete");
      }
    }
  }
  public getMarksColor(question:Question):string{
    return ExamUtility.getColorByMarks(question);
  }

  private tableSection:HTMLElement = null;
  private isShowNavBar:boolean = true;
  public togglePallte():void{
    if(this.tableSection){
      if(this.isMobileDevice()){
        if(this.isShowNavBar){
          this.isShowNavBar = !this.isShowNavBar;
          this.tableSection.classList.remove("result-deactive-pallete");
          this.tableSection.classList.toggle("result-active-pallete");
        }else{
          this.isShowNavBar = !this.isShowNavBar;
          this.tableSection.classList.remove("result-active-pallete");
          this.tableSection.classList.toggle("result-deactive-pallete");
        }
      }
    }
  }
 private isMobileDevice():boolean{
   if(window.matchMedia){
      let matchMedia = window.matchMedia("(min-width:300px) and (max-width:788px)");
      return matchMedia.matches;
    }
 }

 public filterSubject(
    datasource: ExamEntity,
    details: StudentDetails
  ): Array<Question> {
    let filterData: Array<Question> = new Array<Question>();
    let count = 0;
    this.examStateData.questions.forEach((item, index) => {
      if (
        item.subjectName.trim().toUpperCase() ==
        details.subName.trim().toUpperCase()
      ) {

        ++count;
        item.index = count.toString();
        filterData.push(item);
      }
    });
    return filterData;
  }
  private resetSubjectBackground(): void {
    this.examResultData.forEach(item => {
      item.background = "white";
    });
  }

  public displayAnswerIcons(question:Question):number{
     if(question.correctQuestion && question.status == ExamConstants.SOLVED){
       return 1;
     }else if(question.correctQuestion==false && question.status == ExamConstants.SOLVED){
       return 0;
     }
     return 2;
  }
  public getTotalTimeAndSpendTimePercentage(test: StudentDetails): string {
    let percentage: string = "0";
    let sum = Number(test.totalTime) + Number(test.outOfTime);
    if (sum > 0) {
      percentage = ((Number(test.totalTime) / sum) * 100).toString();
    }
    return percentage;
  }

  public printResult: StudentDetails = <StudentDetails>{};

  public displayTestResults(result: StudentDetails): void {
    this.resetSubjectBackground();
    result.background = "lightslategray";
    this.printResult = result;
    this.printResult.rightQuestion = result.rightQuestion;
    this.printResult.wrongQuestion = result.wrongQuestion;
    this.printResult.totalAttemptedQuestion = result.totalAttemptedQuestion;
    this.printResult.notAttemptedQuestion = result.notAttemptedQuestion;
    this.printResult.totalVisitedQuestion = result.totalVisitedQuestion;
    this.printResult.notVistedQuestion = result.notVistedQuestion;

    this.spendTime = TimeLibrary.convertSecondInToHourFormat(
      Number(result.totalTime)
    );
    this.totalTime = TimeLibrary.convertSecondInToHourFormat(
      Number(result.outOfTime)
    );
    this.spendTimeTotalTimeProgress = this.getTotalTimeAndSpendTimePercentage(result);

    this.printResult.totalPositiveMarks = result.totalPositiveMarks;
    this.printResult.totalNegativeMarks = result.totalNegativeMarks;
    this.printResult.totalMarks = result.totalMarks;
    this.printResult.outOfMarks = result.outOfMarks;
    this.obtainedPercentages = Number(result.percentage);
    this.outOfPercentages = Number(this.outOfPercentages);

    this.percentageProgress = this.getTotalPercentage(result);

    this.correctWrongProgress = this.getRightWrongPercentage(result);
    this.attemptedNotAttemptedProgrss = this.getAttemptedPercentage(result);
    this.visitedNotVisitedProgress = this.getVisitedPercentage(result);
    this.positiveNegativeMarksProgress = this.getPositiveMarksPercentage(
      result
    );

    this.totalMarksOutOfMarksProgress = this.getTotalMarksPercentage(result);
    if (result.subName.trim().length > 4) {
      this.filteredSubjects = this.filterSubject(this.examStateData, result);
    } else {
      this.filteredSubjects = this.examStateData.questions;
    }
    this.initTableDataSource(this.filteredSubjects);
  }
  @Output("click_on_home_button")
  public home:EventEmitter<void> = new EventEmitter<void>();
  public home_btn_click():void{
    //this.router.navigate(["//student-homepage"]);
   // this.home.emit();
  }
  @Output("close")
  public closeEventEmiter:EventEmitter<void>  = new EventEmitter<void>();
  public close():void{
    this.closeEventEmiter.emit();
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
    if (sum !=0) {
      percentage = ((Number(test.totalMarks) / sum) * 100).toString();
    }
    return percentage;
  }

  public getTotalPercentage(test: StudentDetails): string {
    let percentage: string = "0";
    let sum = Number(test.totalMarks) + Number(test.outOfMarks);
    if (sum > 0) {
      percentage = ((Number(test.totalMarks) / sum) * 100).toString();
    }
    return percentage;
  }
  public displayedColumns: string[] = [
    "index",
    "mark",
    // "correctQuestion",
    "timeTaken",
    // "chapterId",
    "noOfVisit",
    "subjectName",

  ];

  public filteredSubjects: Array<Question> = new Array<Question>();
  public dataSource = null;
  public classDetails:ClassDetails;
  @ViewChild(MatPaginator, { read: MatPaginator ,static:false}) paginator: MatPaginator;
  constructor(
    private render2:Renderer2 ,
    private router:Router ,
    private mediaService: MediaObserver,
    private dataShare:DataShareService) {

    }
    public isHideToggleButton:boolean =  true;
  ngOnInit() {
    this.logoImage = AppConstant.instituteLogo ;
    this.homeCallBack = this.dataShare.GotoHomePageByStudents;
    this.classDetails = this.dataShare.ClassDetails;
    this.className = this.classDetails.className;
    this.mediaService.media$.subscribe(value=>{
      setTimeout(()=>{
        if(value.mqAlias=="xs"){
          this.isHideToggleButton = false;
        }else{
          this.isHideToggleButton = true;
        }
      },500);

    });
    if (this.examResultData.length > 0) {
      this.displayTestResults(this.examResultData[0]);
    }
    this.generateQuestionIndex();
    this.filteredSubjects = this.examStateData.questions;
    // permanant comment
    // this.filteredSubjects = this.filterSubject(
    //   this.examStateData,
    //   this.examResultData[0]
    // );
    this.initTableDataSource(this.filteredSubjects);
  }
  private initTableDataSource(question: Question[]): void {
    this.dataSource = new MatTableDataSource<Question>(this.filteredSubjects);
    this.dataSource.paginator = this.paginator;

  }

  private generateQuestionIndex(): void {
    this.examStateData.questions.forEach((item, index) => {
      item.index = (index + 1).toString();
    });
  }
}
