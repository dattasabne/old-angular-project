import { NumberUtility } from './../../shared/utility/number.utility';
import { Component, OnInit, Input, ViewChild, ViewEncapsulation, AfterViewInit, Renderer2, EventEmitter, Output, OnChanges } from "@angular/core";
import { StudentDetails } from "../entity/student-details";
import { ClassDetails } from "../entity/class-details";
import { DataShareService } from "src/app/shared/services/data-share-service";
import { DialogService } from "src/app/shared/services/dialog.service";
import { TimeLibrary } from "src/app/students/shared/library/time.library";
@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.css"]
})
export class ResultComponent implements OnInit,AfterViewInit ,OnChanges{
  public name: string;
  public examResultData: Array<StudentDetails> = new Array<StudentDetails>();
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
  public spendTime:string = '';
  public totalTime:string = '';
  public studentName:string = '';
  public className:string='';
  public academicYear:string='';
  public course:string='';
  public subjectName:string='';
  public testId:string = '';
  public patternName:string ='';
  public userName:string='';
  public resultData:any ={};

  @Output("onDisplayFile")
  public onDisplayFile:EventEmitter<boolean>= new EventEmitter<boolean>();

  @Input("examResult")
  public set examResult(resultData:any) {
      this.resultData = resultData;
      console.log(resultData);
  }
  public initModels():void{
    try{
      this.examResultData = this.resultData.testResult;
      this.className = this.resultData.classDetails.className;
      this.studentName = this.resultData.student.info.studentName;
      this.academicYear = this.resultData.exam.academicYear;
      this.course = this.resultData.classDetails.course;
      this.subjectName = this.resultData.exam.subjectName;
      this.userName = this.resultData.student.auth.userName;
      this.examResultData = this.resultData.testResult;
      this.testId = this.resultData.exam.testId;
      this.patternName = this.resultData.exam.patternName;
      this.onDisplayFile.emit(true);
    }catch(e){
      this.dialog.showAlert("Invalid Encrypted Data Format");
      this.onDisplayFile.emit(false);
    }
  }
  public getTestPercentage(): string {
    if (this.examResultData.length > 0) {
      return this.examResultData[0].percentage;
    }
    return "0";
  }
  ngAfterViewInit() {
   // this.tableSection = document.querySelector(".result-table-section");
    // this.adjustHeight();
   // this.setDefaultTableSection();

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
 private resetSubjectBackground(): void {
    this.examResultData.forEach(item => {
      item.background = "white";
    });
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

  public getCorrectPrWrongPercentages(test: StudentDetails): string {
    let percentage: string = "0";
    let sum = Number(test.rightQuestion) + Number(test.wrongQuestion);
    if (sum > 0) {
      percentage = ((Number(test.rightQuestion) / sum) * 100).toString();
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
    // "correctQuestion",
    "timeTaken",
    // "chapterId",
    "noOfVisit",
    "subjectName"
  ];
  public dataSource = null;
  public classDetails:ClassDetails;
  constructor(
    private dialog:DialogService
  ) {}
  public isHideToggleButton:boolean =  true;
  ngOnChanges(){
    this.initModels();
    if(this.examResultData && Array.isArray(this.examResultData) && this.examResultData.length>0){
      this.displayTestResults(this.examResultData[0]);
    }
  }
  ngOnInit() {

  }
  public displayTestResults(subject:StudentDetails):void{
    this.resetSubjectBackground();
    this.printResult = subject;
    this.spendTime = TimeLibrary.convertSecondInToHourFormat(Number(subject.totalTime));
    this.totalTime = TimeLibrary.convertSecondInToHourFormat(Number(subject.outOfTime));
    this.totalMarksOutOfMarksProgress = this.getTotalMarksPercentage(subject);
    this.positiveNegativeMarksProgress = this.getPositiveMarksPercentage(subject);
    this.spendTimeTotalTimeProgress = this.getTotalTimeAndSpendTimePercentage(subject);
    this.correctWrongProgress = this.getCorrectPrWrongPercentages(subject);
    this.attemptedNotAttemptedProgrss = this.getAttemptedPercentage(subject);
    this.visitedNotVisitedProgress = this.getVisitedPercentage(subject);
    subject.background="skyblue";
  }
  public  displayNumber(x:any):any{
    return NumberUtility.correctNumber(x);
  }
}

