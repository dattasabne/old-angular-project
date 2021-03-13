import { Component, OnInit, EventEmitter, Output, Input, OnChanges, AfterViewInit } from "@angular/core";
import { ClassDetails } from "../../studenthomepage/class-detail";
import { AppConstant } from "src/app/shared/app-constant/app-constatnt";
import { StudentLoginData } from "../../studenthomepage/student-login-model";
import { DataShareService } from "src/app/shared/services/data-share-service";
import { StudentAccountService } from "../services/student-account-service";
import { SafeUrl } from '@angular/platform-browser';
import { ExamEntity } from 'src/app/shared/entities/exam-entity';
import { TestStatus } from '../cache-exam/test-status';

@Component({
  selector: "app-exam-navbar",
  templateUrl: "./exam-navbar.component.html",
  styleUrls: ["./exam-navbar.component.css"]
})
export class ExamNavbarComponent implements OnInit , AfterViewInit {
  public questionNo: number;
  public totalQuestion: number;
  public classDetails: ClassDetails;
  public subject:string;
  public koshBrandingLogo:SafeUrl = '';

  @Output("OnInit")
  public onInit:EventEmitter<ExamNavbarComponent> = new EventEmitter<ExamNavbarComponent>();


 @Input("subject")
 public set Subject(subject:string){
   this.subject = subject;
 }

  @Input("classDetails")
  public set ClassDetails(classDetails: ClassDetails) {
    this.classDetails = classDetails;
  }
  @Input("questionData")
  public set $questionNo(questionData: any) {
    this.questionNo = questionData.questionNo;
    this.totalQuestion = questionData.totalQuestion;
  }
  @Output("tictic")
  public emitPerSecond: EventEmitter<number> = new EventEmitter<number>();
  @Output("timeUp")
  public timeup: EventEmitter<void> = new EventEmitter<void>();
  @Output("clickOnNavbar")
  public clickOnNavbar: EventEmitter<void> = new EventEmitter<void>();

  public userName:string = '';
  constructor(private student:StudentAccountService) {
  }
  ngAfterViewInit(){
    this.onInit.emit(this);
  }
  ngOnInit() {
    if(this.student.studentLoginData){
      this.koshBrandingLogo = AppConstant.instituteLogo ; // this.student.studentLoginData.loginClass.classLogo;
    }
    this.userName = this.student.studentLoginData.info.studentName;

  }
  public clickOnToggleButton(): void {
    this.clickOnNavbar.emit();
  }
  public hour: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;
  public interval = null;
  public remainingSecond = 0;
  public flag: boolean = false;

  public startTimer(exam:ExamEntity , extraSecond:number = 0):void{
    if(exam.limitedTime){
      let totalSecond:number = 0;
      if(exam.duration && exam.duration.trim().length > 0){
        totalSecond = Number(exam.duration);
      }
      this.countDownTimer(totalSecond);
    }else{
      this.countUpTimer(extraSecond);

    }
  }


  public countUpTimer(totalSecond:number = 0):void{
    let countUpTimerHandler:()=>void = ()=>{
      this.hour = Math.floor(totalSecond / 3600);
      let reminder = totalSecond % 3600;
      this.minutes = Math.floor(reminder / 60);
      reminder = reminder % 60;
      this.seconds = reminder;
      this.remainingSecond = totalSecond;
      if (this.flag) {
        this.emitPerSecond.emit(totalSecond);
      }
      if (this.flag == false) {
        this.flag = true;
      }
      ++totalSecond;
    };
    this.interval = setInterval(countUpTimerHandler,1000);
  }




  public countDownTimer(totalSecond: number): void {
    this.flag = false;
    let reminder = 0;
    this.interval = setInterval(() => {
      if (totalSecond < 0) {
        clearInterval(this.interval);
        this.timeup.emit();
      } else {
        this.hour = Math.floor(totalSecond / 3600);
        reminder = totalSecond % 3600;
        this.minutes = Math.floor(reminder / 60);
        reminder = reminder % 60;
        this.seconds = reminder;
        this.remainingSecond = totalSecond;
        if (this.flag) {
          this.emitPerSecond.emit(totalSecond);
        }
        if (this.flag == false) {
          this.flag = true;
        }
        --totalSecond;
      }
    }, 1000);
  }
  public stopTimer():number {
    clearInterval(this.interval);
    return this.remainingSecond;
  }

}
