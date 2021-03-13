import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { small_dialog } from 'src/app/website/model/dialog-parameter';
import {
  Component,
  OnInit,
  Renderer2,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  EventEmitter,
  Output
} from "@angular/core";
import { MatCheckboxChange,MatBottomSheetRef } from "@angular/material";
import { Exam } from "../library/interfaces/exam-interface";
import { Question } from "../library/interfaces/question-interface";
import { ExamConstants } from "../library/interfaces/exam-constants";
import  {DialogService} from "../shared/services/dialog-service";
import { DataShareService } from "../../shared/services/data-share-service";
import { ExamEntity } from "../../shared/entities/exam-entity";
import { SingleOption } from "../../shared/entities/single-option";
import { Router } from "@angular/router";
import { ClassDetails } from "../studenthomepage/class-detail";
import { StudentDetails } from "../../admin/entity/student-details";
import { ExamStartService } from "./exam-start-service";
import { HttpErrorResponse } from "@angular/common/http";
import { ExamPatternConstant } from "../library/exam-pattern-constant";
import { ExamNavbarComponent } from "../shared/exam-navbar/exam-navbar.component";
import { TimeLibrary } from "../shared/library/time.library";
import { StudentAccountService } from "../shared/services/student-account-service";
import { LocalStorageExam } from "../shared/cache-exam/localstorage-exam";
import { TestStatus } from "../shared/cache-exam/test-status";
import { StudentLoginData } from "../studenthomepage/student-login-model";
import { Keys } from "src/app/shared/application/keys";
import { EncryptionDecryption } from "src/app/shared/application/encryption";
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { SplitExamLocalStorage } from './split.exam.localstorage';
import { MarksIndicator } from './marks.indicator';
import { MediaObserver } from '@angular/flex-layout';
import { PdfLoadedEvent } from 'ngx-extended-pdf-viewer';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: "app-exam-start",
  templateUrl: "./exam-start.component.html",
  styleUrls: ["./exam-start.component.css"]
})
export class ExamStartComponent implements OnInit, AfterViewInit, OnDestroy {
  public footerData = { name: "datta", address: "parli" };
  public pdfSrc: string = "";
  public pageNo: number = 1;
  public totalExamSeconds: number = 0;
  public isQuestionPaper: boolean = false;
  public isLoaded:boolean = false;
  @ViewChild("examNavBar", { read: ExamNavbarComponent,static:false}) private examNavBar: ExamNavbarComponent;
  private examData:ExamEntity = null;
  public localStorageExam:LocalStorageExam =<LocalStorageExam>{};
  constructor(
    private render2: Renderer2,
    private dialog: DialogService,
    private shareData: DataShareService,
    private router: Router,
    private examService: ExamStartService,
    private student:StudentAccountService,
    private responsiv:MediaObserver,
    private sanitizer:DomSanitizer,
    private breakPoint:BreakpointObserver
  ) {}
  public displayTestPage: boolean = false;
  ngOnDestroy(): void {
    if (this.stack.length != 0) {
      clearInterval(this.stack.pop());
    }
  }
  public questionPaperPDF:string = "";
  public mathOrBioQuestionLength:number = 0;
  public calculateTotalQuestion():number{
    let count:number = 0;
    if(Array.isArray(this.shareData.splitExam) && this.shareData.splitExam.length > 0){
        for(let paper of this.shareData.splitExam){
          count += paper.questions.length;
        }
    }
    if(this.shareData.solvedPapers != null && Array.isArray(this.shareData.solvedPapers)){
      for(let paper of this.shareData.solvedPapers){
        count += paper.questions.length;
      }
    }
    return count;
  }
  public setTestData(exam:ExamEntity):void{

    this.assignmentType  = exam.assignmentType
    this.patternName     = exam.patternName;
    this.allBranchId     = exam.allBranchId;
  }
  public examInitialization():void{
    this.examData = this.shareData.ExamStartData;
    if ((!this.examData) && (!this.shareData.splitExam)) {
        this.dialog.showAlert("data not available",small_dialog);
        this.router.navigate(["/"]);
        return;
    }
    this.classDetails = this.shareData.ClassDetails;
    if(Array.isArray(this.shareData.splitExam) && this.shareData.splitExam.length > 0){
      this.examData = this.shareData.splitExam[0];
      this.setTestData(this.examData);
      if(this.shareData.solvedPapers != null){
        this.examPapers = this.shareData.solvedPapers;
      }
      this.mathOrBioQuestionLength = this.calculateTotalQuestion();
    }else{
      this.setTestData(this.examData);
    }
    if(this.shareData.solvedPapers != null
      && Array.isArray(this.shareData.solvedPapers)
      && this.shareData.solvedPapers.length > 0){
      this.questionPaperPDF = this.shareData.solvedPapers[0].testFile;
    }else{
      this.questionPaperPDF = this.examData.testFile;
    }
    this.testPdfUrl = AppConstant.SERVER_HOST.concat("/exam/download-testfile/"+this.examData.testId +"/"+ this.examData.uniqueClassName + "/" + this.examData.academicYear);
  }
  public testPdfUrl:string = '';
  ngOnInit() {
    this.isLoaded = true;
    this.examInitialization();
    this.startTest();
  }

  @Output("close")
  public closeEventEmiter:EventEmitter<void> = new EventEmitter<void>();
  public close():void{
    this.closeEventEmiter.emit();
  }
  public pallete: HTMLElement = null;
  public question: HTMLElement = null;
  public questionSection: HTMLElement = null;
  public togglePalleteInitialize(): void {
    this.pallete = document.querySelector(".exam-pallete") as HTMLElement;
  }
  public PdfLoad_SuccessHandler(message:any):void{
    this.isLoaded = false;
  }
  public PdfLoad_FailedHandler(error:any):void{
    this.dialog.showAlert(error,small_dialog);
  }
  public selectedSubject: string = "";

  public onSubjectClick(subject: any): void {
    this.clearAllSubjectBackground();
    subject.background = "red";
    this.subjectName = subject.name;
    this.fileterSubjects(subject.name, this.currentExam.questions);
    this.currentSubject = subject;
  }
  public fileterSubjects(subjectName: string, source: Array<any>) {
    this.allQuestions = new Array<Question>();
    if(subjectName.trim().toUpperCase()=="PCM" || subjectName.trim().toUpperCase()=="PCB"){
      source.forEach(item=>{
        this.allQuestions.push(item);
      });
    }else{
      source.forEach((item, index) => {
        if (
          item.subjectName.trim().toUpperCase() ==
          subjectName.toUpperCase().trim()
        ) {
          this.allQuestions.push(item);
        }
      });
    }
    if (this.allQuestions.length > 0) {
      this.clickOnButton(this.allQuestions[0]);
    }
  }
  public togglePallete(): void {
    // let isSmall = window.matchMedia("(max-width:900px)").matches;
    // if (this.pallete != null && isSmall) {
    //   this.pallete.classList.toggle("exam-active-pallete");
    // }
    if(this.responsiv.isActive("xs") || this.responsiv.isActive("sm")){
      this.pallete.classList.toggle("exam-active-pallete");
    }
  }
  public hidePallete():void{
    if(this.responsiv.isActive("xs") || this.responsiv.isActive("sm")){
      this.pallete.classList.remove("exam-active-pallete");
    }
  }
  public examNavbarInit(examNavbar:ExamNavbarComponent):void{
    examNavbar.startTimer(this.currentExam ,this.totalExamSeconds);
  }

  public scrollPdfTop(){
    if(this.pdfSection){
      this.pdfSection.scrollTop = 0;
    }
  }
  ngAfterViewInit(): void {
    this.adjustHeight();
    this.adjustButtonHeight();
    this.render2.listen(window, "resize", () => {
      this.adjustHeight();
      this.adjustButtonHeight();
      if( !(this.responsiv.isActive("xs") && this.responsiv.isActive("sm") ) && this.pallete != null ){
        this.pallete.classList.remove("exam-active-pallete");
      }
    });
    this.togglePalleteInitialize();
  }
  public questionData = { questionNo: 0, totalQuestion: 0 };
  public currentQuestion: Question ;
  public currentQuestionNo: number;
  public onlyClickOnButton(question: Question):void{


    this.clickOnButton(question);
    this.togglePallete();
  }
  public bottomSheetRef:MatBottomSheetRef = null;

  public clickOnButton(question: Question): void {
    this.currentQuestion = question;

    if(this.bottomSheetRef!=null){
      this.bottomSheetRef.dismiss();
    }

    this.currentQuestionNo = question.nSquence;
    this.isQuestionPaper = false;
    this.isLast = false;
    this.removeButtonAllBorders();
    this.scrollPdfTop();
    question.border = "2px solid black";
    if(question.status == ExamConstants.NOT_VISITED) {
      question.background = "red";
      question.color = "white";
      question.visited = true;
      question.status = ExamConstants.VISITED;
    }
    this.questionData = {
      questionNo: question.nSquence,
      totalQuestion:   this.currentExam.questions.length
    };
    if(Array.isArray(this.shareData.splitExam) && this.shareData.splitExam.length > 0 ){
      if(question.subjectName.trim().toUpperCase()=="MATHEMATICS" || question.subjectName.trim().toUpperCase() == "BIOLOGY"){
        this.questionData = {
          questionNo: question.nSquence,
          totalQuestion:  this.mathOrBioQuestionLength
        };
      }
    }
    if (question.status != ExamConstants.SOLVED) {
      question.status = ExamConstants.VISITED;
    }
    this.pageNo = question.nSquence;
    switch (Number(question.questionType)) {
      case 4:
      case 1:
        // this is single type question
        this.allOptions = question.options;
        break;
      case 2:
        this.allOptions = question.options;
        break;
      case 3:
        this.allOptions = question.options;
        break;
      // case 4:
      //   this.matrixOptionPanel.show = true;
      //   this.matrixOptionPanel.height = "auto";
      //   this.createMatrixOptions(question);
      //   break;
      case 5:
        this.allOptions = question.options;
        break;
      case 6:
        this.allOptions = question.options;
        break;
    }
    question.noOfVisit++;
  }
  public matrix:any={};
  public createMatrixOptions(question:Question):void{
      this.matrix = question.matrixOptions;
  }
  public matrixCheckBox(checkBox:MatCheckboxChange,option:any):void{
    if(checkBox.checked){
        this.matrix.answers.push(checkBox.source.value);
    }else{
        let index = this.matrix.answers.indexOf(checkBox.source.value);
        if(index!=-1){
            this.matrix.answers.splice(index,1);
        }
    }
    option.isChecked  = checkBox.checked;
    if(this.currentQuestion.matrixOptions.answers.length<1){
      this.currentQuestion.background = "red";
      this.currentQuestion.status = ExamConstants.VISITED;
    }
}
 // for toggle matrix option panel
  public matrixOptionPanel = {
    height:"auto",
    show:true
  };
  public matrixIcon():void{
    if(this.matrixOptionPanel.show){
      this.matrixOptionPanel.show = !this.matrixOptionPanel.show;
      this.matrixOptionPanel.height = "40px";
    }else{
      this.matrixOptionPanel.show = !this.matrixOptionPanel.show;
      this.matrixOptionPanel.height = "auto";
    }
  }
  public saveSplitExamInLocalStorage():void{
    try{
      if(localStorage || window.localStorage){
        let localData:SplitExamLocalStorage = <SplitExamLocalStorage>{};
        localData.submitExam = this.examPapers;
        localData.remainingExam = this.shareData.splitExam;
        localData.userName = this.student.studentLoginData.auth.userName;
        localData.classDetails = this.classDetails;
        localData.strictTime = this.classDetails.strictTime;
        let jsonString = JSON.stringify(localData);
        localStorage.setItem("exam",jsonString);
      }
    }catch(ex){
      console.log(ex);
    }
  }
  public saveTestInLocalStorage():void{
    if(localStorage){
      if(this.remainingTestTime != null && this.remainingTestTime != undefined){
        this.localStorageExam.examData.remainingTime = this.remainingTestTime;
        let userInfo = <StudentLoginData>{};
        userInfo.userName = this.student.studentLoginData.auth.userName;
        this.localStorageExam.userInfo = userInfo;
        this.localStorageExam.strictTime = this.classDetails.strictTime;
      }
      let exam:string =JSON.stringify(this.localStorageExam);
      localStorage.setItem("exam",exam);
    }
  }

  public remainingTestTime:number;

  public tictic = (data: number) => {
    ++this.currentQuestion.timeTaken;
    this.remainingTestTime = data;
    this.localStorageExam.examData.duration = String(this.remainingTestTime);
    if(Array.isArray(this.shareData.splitExam) && this.shareData.splitExam.length > 0){
      this.currentExam.remainingTime = data;
      this.saveSplitExamInLocalStorage();
    }else{
      this.currentExam.remainingTime = data;
      this.saveTestInLocalStorage();
    }
    // this will save exam in localstorage
  };

  private stack: Array<any> = new Array<any>();
  public isLast = false;
  public currentSubject:string = "";
  public next(currentQuestion: Question) {

    if (this.isLast) {
      let message = `This Is The Last Question Of ${ this.subjectName } `;
      if(this.responsiv.isActive("xs") || this.responsiv.isActive("sm")){
        message = `This Is The Last Question Of ${this.subjectName} . Do you want to open Question palette ? `;
        this.dialog.confirmDialog(message,()=>{
          this.togglePallete();
        });
      }else{
        this.dialog.showAlert(message,{height:200,width:500});
      }
    }
    let currIndex = this.allQuestions.indexOf(currentQuestion);
    if ((currIndex + 1) < this.allQuestions.length) {
      let nextQuestion = this.allQuestions[currIndex + 1];
      this.clickOnButton(nextQuestion);
      this.isLast = false;
    } else if ((currIndex + 1) == this.allQuestions.length) {
      this.clickOnButton(this.allQuestions[currIndex]);
      this.isLast = true;
    }
  }
  public clickOnMarkAndReview(): void {
    this.currentQuestion.isMarked = true;

    switch(Number(this.currentQuestion.questionType)){
        case 5:
        case 4:
        case 3:
        case 1:
            if (this.currentQuestion.singleAnswer) {
              this.currentQuestion.background = "purple";
              this.currentQuestion.status = ExamConstants.SOLVED;
            }
            break;
        case 2:
              if(this.currentQuestion.multipleAnswer.length>0){
                this.currentQuestion.background = "purple";
                this.currentQuestion.status = ExamConstants.SOLVED;
              }else{
                this.currentQuestion.background = "red";
              }
            break;
        // case 4:
        //     if(this.currentQuestion.matrixOptions.answers.length>0){
        //       this.currentQuestion.background = "purple";
        //       this.currentQuestion.status = ExamConstants.SOLVED;
        //     }else{
        //       this.currentQuestion.background = "red";
        //       this.currentQuestion.status = ExamConstants.VISITED;
        //     }
        //     break;
        case 6:
              if(this.currentQuestion.singleAnswer!=null && this.currentQuestion.singleAnswer.trim().length > 0){
                this.currentQuestion.background = "purple";
                this.currentQuestion.status = ExamConstants.SOLVED;
              }else{
                this.currentQuestion.status = ExamConstants.VISITED;
              }

            break;
    }
    this.next(this.currentQuestion);
  }
  public clickOnSaveAndNext(): void {
    this.currentQuestion.marked = false;
    switch(Number(this.currentQuestion.questionType)){
      case 5:
      case 4:
      case 3:
      case 1:
          if (this.currentQuestion.singleAnswer) {
            this.currentQuestion.background = "green";
            this.currentQuestion.status = ExamConstants.SOLVED;
          }
          break;
      case 2:
          if(this.currentQuestion.multipleAnswer.length>0){
            this.currentQuestion.background = "green";
            this.currentQuestion.status = ExamConstants.SOLVED;
          }else{
            this.currentQuestion.background = "red";
          }
          break;

      // case 4:
      //     if(this.currentQuestion.matrixOptions.answers.length>0){
      //       this.currentQuestion.background = "green";
      //       this.currentQuestion.status = ExamConstants.SOLVED;
      //     }
      //     break;

      case 6:
          if(this.currentQuestion.singleAnswer !=null && this.currentQuestion.singleAnswer.trim().length > 0){
            this.currentQuestion.background = "green";
            this.currentQuestion.status = ExamConstants.SOLVED;
          }else{
            this.currentQuestion.status = ExamConstants.VISITED;
          }
          break;
    }
    this.next(this.currentQuestion);
  }
  public removeButtonAllBorders(): void {
    this.allQuestions.forEach(question => {
      question.border = "none";
    });
  }
  public pdfSection:HTMLElement = null;

  public adjustHeight(): void {
    let examSection = document.querySelector(".exam-exam-section") as HTMLDivElement;
    let pdfSection = this.pdfSection = document.querySelector(".exam-pdf-section") as HTMLElement;
    let palleteQuestion = document.querySelector(".exam-pallete-question") as HTMLElement;
    let innerHeight =  window.innerHeight ;//  body.offsetHeight;
    if (examSection
        && innerHeight
        && pdfSection
        && palleteQuestion) {
          let extra = 8;
      let viewPortHeight = innerHeight - (60 + extra);
      examSection.style.height =viewPortHeight+"px";
      pdfSection.style.height = (viewPortHeight - 125 ) +"px";
      palleteQuestion.style.height = viewPortHeight +"px";
    }
  }
  public disableSubmitButton:boolean = false;
  public adjustButtonHeight(): void {
    let pallete = document.querySelector(".exam-pallete-question") as HTMLElement;
    let palleteButton = document.querySelector(
      ".exam-button-pallete"
    ) as HTMLElement;
    if (pallete && palleteButton) {
      let palleteHeight = pallete.offsetHeight;
      let pallteNetHeight = palleteHeight - (20 + 30 + 10 + 125);
      palleteButton.style.height =pallteNetHeight +"px";
    }
  }
  public isTimeUp: boolean = false;
  public examStates: string = null;
  public solvePaperCount:number = 0;
  public examPapers:ExamEntity [] = [];
  public timeUp(): void {
    if(Array.isArray(this.shareData.splitExam) && this.shareData.splitExam.length > 0){
      let exam:ExamEntity = this.shareData.splitExam.shift();
      if(exam != undefined){
        exam.remainingTime = 0;
        this.examPapers.push(exam);
      }
      if(this.shareData.splitExam.length == 0){
        this.currentExam = this.integrateFinalExam(this.examPapers);
        this.confirmSubmit();
        return;
      }
      this.startAnotherPaper(this.shareData.splitExam[0]);

    }else{
      this.displayAnswerPallete = false;
      this.currentExam.remainingTime = this.examNavBar.stopTimer();
      this.confirmSubmit();
    }
    // this.isTimeUp = true;
  }

  public integrateFinalExam(source:ExamEntity[]):ExamEntity{
    let questions = [];
    let time = 0;
    let subjects = [];
      for(let paper of source){
          questions = questions.concat(paper.questions);
          time += Number(paper.duration);
          subjects = subjects.concat(paper.subjectList);
      }
      let finalPaper:ExamEntity = source[0];
      finalPaper.questions = questions;
      finalPaper.duration = time.toString();
      finalPaper.subjectList = subjects;
      return finalPaper;
  }

  public exam: Exam = <Exam>{};
  public allSubjects: Array<any> = new Array<any>();
  public subjectName: string;
  public clearAllSubjectBackground(): void {
    this.allSubjects.forEach(subject => {
      subject.background = "lightseagreen";
    });
  }
  public filterCallBack = (question: Question) => {
    //this.clickOnButton(question);
  };
  public clearResponse(): void {
    this.currentQuestion.status = ExamConstants.NOT_VISITED;
    this.currentQuestion.background = "lightgray";
    this.currentQuestion.marked = false;
    this.currentQuestion.visited = false;
    this.currentQuestion.singleAnswer = null;
    this.currentQuestion.noOfVisit = 0;
    this.resetMultipleQuestion(this.currentQuestion);
    switch(Number(this.currentQuestion.questionType)){
        case 5:
        case 4:
        case 3:
        case 1:
            break;
        case 2: // this for multiple type question
                this.resetMultipleTypeQuestion(this.currentQuestion);
            break;
        case 3:
            break;
        // case 4:
        //       this.resetMatrixQuestions();  // this is for matrix type question
        //     break;
        case 5:
            break;
        case 6:
            break;

    }

  }

  public resetMultipleTypeQuestion(question:Question):void{
      question.options.forEach(option=>{
        option.selected = false;
        option.value = null;
      });
      question.status = ExamConstants.NOT_VISITED;
  }
  public resetMatrixQuestions():void{
    this.currentQuestion.matrixOptions.matrix.forEach(row=>{
      row.forEach(column=>{
          column.isChecked = false;
      });
    });
    this.currentQuestion.status = ExamConstants.NOT_VISITED;
    this.currentQuestion.background = "lightgray";
  }
  public resetMultipleQuestion(question:Question):void{
    question.options.forEach(option=>{
      option.selected = false;
    });
  }
  // submit test for confirmation
  public submitTest = () => {
    if(Array.isArray(this.shareData.splitExam) && this.shareData.splitExam.length > 0){
      let message:string = "";
      let subName:string = this.shareData.splitExam[0].questions[0].subjectName;
      if(["physics","chemistry"].indexOf(subName.trim().toLowerCase()) != -1){
        let nextSubject:string = "";
        if(this.shareData.splitExam.length >0){
          nextSubject = this.shareData.splitExam[1].questions[0].subjectName;
          message = "do you want to submit physics and chemistry and display "+nextSubject+" ? ";
        }
      }else{
        message = "do you want to submit "+ subName + " ? ";
      }

      let handler = ()=>{
        let exam :ExamEntity = this.shareData.splitExam.shift();
        if(exam != undefined){
          exam.remainingTime = this.examNavBar.stopTimer();
          this.examPapers.push(exam);
        }
        if(this.shareData.splitExam.length == 0){
          this.currentExam = this.integrateFinalExam(this.examPapers);
          console.log(this.currentExam);



          this.confirmSubmit();
          return;
        }
        this.hidePallete();
        this.startAnotherPaper(this.shareData.splitExam[0]);
      };
      this.dialog.confirmDialog(message, handler);
    }else{
      let message = "do you really want to submit test ?";
      this.dialog.confirmDialog(message, this.confirmSubmit);
    }
  };
  public startAnotherPaper(exam:ExamEntity):void{
    this.examData = exam;
    this.startTest();
    this.examNavBar.startTimer(this.examData);
  }
  public resultType:string = AppConstant.ONLINE_RESULT_MESSAGE;
  public examResult: Array<StudentDetails> = Array<StudentDetails>();
  // this function submit test
  public resetTestData():void{
    this.shareData.splitExam = null;
    this.shareData.ExamStartData = null;
    this.shareData.solvedPapers = null;
    this.shareData.examAttemptedData = null;
  }
  public patternName:string = "";
  public assignmentType:string = "";
  public allBranchId:string = "";

  public confirmSubmit = () => {
    this.examNavBar.stopTimer();  // this is the stop the exam timer
    this.isLoaded = true;
    // this.examResult = this.createUniqueResultRecord(this.claculateResult(this.currentExam));

    this.examResult = this.claculateResult(this.currentExam);

    // let dataForEncryption = {
    //   student:this.student.studentLoginData,
    //   classDetails:this.shareData.ClassDetails,
    //   testResult:this.examResult,
    //   exam:this.currentExam
    // };

    // let text = JSON.stringify(dataForEncryption);
    // let encryptedText = EncryptionDecryption.encrypt(text,Keys.encryptionKey);
    // let blob = new Blob([JSON.stringify(encryptedText)], {
    //   type: "application/json"
    // });
    this.resetTestData(); // restting test data
    const data = {
      testResult: this.examResult,
      assignmentType:this.currentExam.assignmentType,
      allBranchId:this.currentExam.allBranchId,
      testId:this.currentQuestion.testId
    };

    this.disableSubmitButton = true ;

    this.examService.saveTestResult(data).subscribe(
      (res: any) => {
        if (res.result) {
          this.dialog.showAlert(res.message,{height:200,width:500});
          this.removeLocalStorageData("exam");
          this.currentExam.testFile = null;
          this.currentExam.testSubmitedDatetime = res.data.solvedDate;
          this.examStates = JSON.stringify(this.currentExam);
          this.isTimeUp = true;
        } else {
          this.removeLocalStorageData("exam");
          this.saveResultInLocalStorage(this.examResult);
          this.dialog.showAlert(res.message,{height:300,width:500});
          this.displayAnswerPallete = false;
          this.resultType = AppConstant.OFFLINE_RESULT_MESSAGE;
          this.examStates = JSON.stringify(this.currentExam);
          this.isTimeUp = true;
          this.currentExam.testSubmitedDatetime = "N.A.";
          // const error =
          //   "ERROR OCCURED: Your test result may not be saved for some technical reasons, however, your choice is one" +
          //   "Download the encrypted file and then give it to your concerned teacher so that your results can be saved.";
          //saveAs(blob, "result.dat");
          //this.close();
        }
        this.isLoaded = false;
      },
      (error: HttpErrorResponse) => {
        if(error.status == 0){
          this.dialog.showAlert(AppConstant.DONTWORRY_TESTRESULT_MESSAGE,{height:300,width:500});
        }else{
          this.dialog.showAlert(error.message,{height:300,width:500});
        }
        this.removeLocalStorageData("exam");
        this.saveResultInLocalStorage(this.examResult);
        this.displayAnswerPallete = false;
        this.isLoaded = false;
        this.resultType = AppConstant.OFFLINE_RESULT_MESSAGE;
        this.examStates = JSON.stringify(this.currentExam);
        this.isTimeUp = true;
        this.currentExam.testSubmitedDatetime = "N.A.";
          //saveAs(blob, "result.dat");  // this function download encrypted result file
          //this.close(); // this function destroy current window
      }
    );
  };
  public createUniqueResultRecord(result:Array<StudentDetails>):Array<StudentDetails>{
    let data = {}
    let uniqueResult: Array<StudentDetails> = new Array<StudentDetails>();
    result.forEach(record=>{
        if(data[record.subName]== null || data[record.subName] == undefined ){
          data[record.subName] = record;
        }
    });
    for(let key in data){
        uniqueResult.push(data[key]);
    }
    return uniqueResult;
  }


  public displayAnswerPallete:boolean = true;
  public removeLocalStorageData(keyName:string):void{
    if(localStorage){
      try{
        localStorage.removeItem(keyName);
      }catch(ex){
        alert(ex);
      }
    }
  }

  public saveResultInLocalStorage(result:Array<StudentDetails>):void{
    if(localStorage){
      try{
        let resultRecord = {
            testResult: this.createUniqueResultRecord(result),
            assignmentType:this.currentExam.assignmentType,
            allBranchId:this.currentExam.allBranchId,
            testId:this.currentQuestion.testId
        }
        let resultJsonString = JSON.stringify(resultRecord);
        let encryptResult = EncryptionDecryption.encrypt(resultJsonString,Keys.encryptionKey);
        localStorage.setItem("testResult",encryptResult);
      }catch(ex){
        console.log(ex);
      }
    }else{
      this.dialog.showAlert("Your Result Will Be Lost Because Your Device Not Supporting LocalStorage.",{height:300,width:500});
    }
  }
  public home():void{

    this.isTimeUp = false;
  }
  public classDetails: ClassDetails = null;
  public currentExam: ExamEntity = null;
  public allQuestions: Array<Question> = new Array<Question>();
  public allOptions: Array<SingleOption> = new Array<SingleOption>();
  /*------------------ this is exam entry point to start examination -------*/
  public startTest(): void {
    this.currentExam = this.examData;
    if(this.currentExam.testStaus == TestStatus.pending){
      this.totalExamSeconds = Number(this.currentExam.remainingTime);
    }else{
      this.resetDefaultTest(this.currentExam);
      this.totalExamSeconds = 0 ;//Number(this.currentExam.duration);
      this.currentExam.questions.forEach(item => {
        item.background = "lightgray";
      });
    }
    this.isQuestionPaper = false;
    this.pdfSrc = this.questionPaperPDF ;
    this.subjectName = this.currentExam.subjectName;
    this.allQuestions = this.currentExam.questions;
    this.allSubjects = this.currentExam.subjectList;
    if (this.allSubjects.length > 0) {
        this.onSubjectClick(this.allSubjects[0]);
    }
    this.localStorageExam.classDetails = this.classDetails;
    this.localStorageExam.examData = this.examData;
    this.displayTestPage = true;
  }



 public resetDefaultTest(exam: ExamEntity): void {
    exam.questions.forEach((item, index) => {
      item.status = ExamConstants.NOT_VISITED;
    });
  }
  public zoomLevel = 1.5;
  public displayQuestionPaperText: string = "question paper";

  public displayQuestionPaper(): void {
    this.isQuestionPaper = !this.isQuestionPaper;
    this.displayQuestionPaperText = this.isQuestionPaper
      ? "show questions"
      : "question paper";
  }

  // this field store remaining second of exam
  public remainingSecond: number = 0;
  // this function calculate the exam result
  public claculateResult(exam: ExamEntity): Array<StudentDetails> {
    let result: Array<StudentDetails> = new Array<StudentDetails>();
    this.remainingSecond = exam.remainingTime;
    if (exam.doFinalTest) {
      result.push(this.stage1Records(exam));
      exam.subjectList.forEach((subject, index) => {
        if(subject.name.trim().toUpperCase()!="pcm".toUpperCase() && subject.name.trim().toUpperCase()!="pcb".toUpperCase()   ){
          result.push(this.getEachResultRecords(subject.name, exam));
        }
      });

    } else {
      result.push(this.stage1Records(exam));
    }
    return result;
  }
  public applyNegativeMarks(question:Question):boolean{
    if ( question.patternName.trim().toUpperCase() != ExamPatternConstant.MHTCET.toUpperCase().trim()
    && question.patternName.trim().toUpperCase() != ExamPatternConstant.MHTCET_and_MTCET2013.toUpperCase().trim()
    ) {
      return true;

    }
    return false;
  }
  public stage1Records(exam: ExamEntity): StudentDetails {
    let outOfMarks: number = 0;
    let totalQuestion: number = 0;
    let correctQuestion: number = 0;
    let wrongQuestion: number = 0;
    let totalPositiveMarks = 0;
    let totalNegativeMarks = 0;
    let totalAttempted = 0;
    let totalNotAttempted = 0;
    let totalVisitedQuestion = 0;
    let totalNotVisited = 0;
    let totalMarks = 0;
    let endTime = "0";
    let totalTime = 0;
    let date = "";
    let averageTime = 0;
    let percentage = 0;
    let questions = [];
    let timeForSolve:number = 0;

    exam.questions.forEach((question, index) => {
      question.obtainedQuestionMarks = 0;
      timeForSolve += Number(question.timeTaken);
      outOfMarks += Number(question.eachCorrectMarks);
      totalQuestion += 1;
      if (question.status == ExamConstants.SOLVED) {
        let isCorrect:boolean = false;
        let eachRightMarks:number = 0;
        let eachWronMarks:number = 0;
        switch(Number(question.questionType)){
          case 5:
          case 4:
          case 3:
          case 1:
                isCorrect = this.checkIsCorrectQuestion(question);
                eachRightMarks = Number(question.eachCorrectMarks);
                eachWronMarks = Number(question.eachWrongMarks);
                if(isCorrect){
                  question.obtainedQuestionMarks = eachRightMarks;
                }else{
                  question.obtainedQuestionMarks = -eachWronMarks;
                }
              break;
          case 2: // this is multiple select question
                let markIndicator:MarksIndicator = this.calculateMultiChoiceAnswer(question);
                isCorrect = markIndicator.isCorrectQuestion ;//this.checkIsCorrectQuestion(question);
                //Number(question.eachCorrectMarks);
                // eachWronMarks = Number(question.eachWrongMarks);
                if(markIndicator.totalCorrectPairMarks == -1){
                  eachWronMarks = 1;
                }else{
                  eachRightMarks = markIndicator.totalCorrectPairMarks ;
                }
                question.obtainedQuestionMarks = markIndicator.totalCorrectPairMarks;
              break;
          /*case 4: // this is matrix type question
              let result = this.calculateMatrixQuestionMarks(question);
              isCorrect = result.isCorrect;
              eachRightMarks = Number(result.marks);
              eachWronMarks  = Number(question.eachWrongMarks);
              break;*/
          case 6:
              isCorrect = this.checkIsCorrectQuestion(question);
              eachRightMarks =Number(question.eachCorrectMarks);
              eachWronMarks =Number(question.eachWrongMarks);
              if(isCorrect){
                question.obtainedQuestionMarks = eachRightMarks;
              }else{
                question.obtainedQuestionMarks = -eachWronMarks;
              }
              break;
        }
        if (isCorrect) {
          correctQuestion += 1;
          question.correctQuestion = true;
          totalPositiveMarks += eachRightMarks;
        } else {
          question.correctQuestion = false;
          wrongQuestion += 1;
          if (this.applyNegativeMarks(question)){
            totalNegativeMarks += eachWronMarks;
          }
        }
        totalAttempted += 1;
      } else {
        totalNotAttempted += 1;
      }
      if (question.status == ExamConstants.NOT_VISITED) {
        totalNotVisited += 1;
      } else {
        totalVisitedQuestion += 1;
      }
      questions.push(question);
    });
    let result: StudentDetails = <StudentDetails>{};
    // student details default values
    totalTime = timeForSolve;          //Number(exam.duration) - this.remainingSecond;
    //alert(TimeLibrary.convertSecondInToHourFormat(totalTime));
    totalMarks = totalPositiveMarks - totalNegativeMarks;
    if(outOfMarks<=0){
      percentage = 0.00;
    }else{
      percentage = Number(((totalMarks / outOfMarks) * 100).toFixed(2));
    }

    // if (totalMarks <= 0) {
    //   percentage = 0;
    // } else if (totalMarks > 0) {
    //   percentage = Number(((totalMarks / outOfMarks) * 100).toFixed(2));
    // }
    //calculat exam end time
    let totalSecond = TimeLibrary.convertTimeInSecond(exam.startTime);
    let allSecond = totalSecond + totalTime;
    endTime = TimeLibrary.addSecondInTime(allSecond);
    result.id = exam.testId;
    result.userName = this.student.studentLoginData.auth.userName;
    result.subName = exam.subjectName;
    result.chapName = exam.chapterName;
    result.date = date;
    result.startTime = exam.startTime;
    result.endTime = endTime.toString();
    result.totalTime = totalTime.toString();
    result.averageTime = averageTime.toString();
    result.rightQuestion = correctQuestion.toString();
    result.wrongQuestion = wrongQuestion.toString();
    result.totalQuestion = totalQuestion.toString();
    result.percentage = percentage.toString();
    result.type = exam.testType;
    result.questions = JSON.stringify(questions);
    result.isManualTest = false;
    result.academicYear = this.classDetails.batch;// this.shareData.ClassDetails.batch;
    result.isUpload = true;
    result.testIdAliase = null;
    result.newAverageTime = "10";
    result.outOfQuestion = exam.questions.length.toString();
    result.totalPositiveMarks = totalPositiveMarks.toString();
    result.totalNegativeMarks = totalNegativeMarks.toString();
    result.totalVisitedQuestion = totalVisitedQuestion.toString();
    result.totalMarks = totalMarks.toString();
    result.outOfMarks = outOfMarks.toString();
    result.patternName = exam.patternName;
    result.$class = this.examData.className;
    result.isResolve = true;
    result.questionType = "1";
    result.stage = "1";
    result.chapId = null;
    result.subjectGroup = null;
    result.classRoom = true;
    result.chapId = null;
    result.course = this.classDetails.course;
    result.promoteToNextLevel = false;
    result.allBranchRank = "0";
    result.branchRank = "0";
    result.divisionRank = "0";
    result.subDivisionRank = "0";
    result.branchId = "0";
    result.branch = this.classDetails.branch;
    result.allBranchId = this.currentExam.allBranchId;
    result.testSolveStatus = (this.currentExam.testAttemptedData.attempted)?AppConstant.RE_ATTEMPTED : AppConstant.ATTEMPTED;
    result.strVisitCount = null;
    result.physicsTotalMarks = "0";
    result.chemistryTotalMarks = "0";
    result.mathemeticsTotalMarks = "0";
    result.biologyTotalMarks = "0";
    result.testFile = null;
    result.reviewFile = null;
    result.uniqueClassName = exam.uniqueClassName;
    result.outOfTime = exam.duration;
    result.printTestbal = true;
    result.mobileTestbal = true;
    result.dateTimeStamp = "";
    result.visitCount = totalVisitedQuestion.toString();
    result.notVistedQuestion = totalNotVisited.toString();
    result.totalAttemptedQuestion = totalAttempted.toString();
    result.notAttemptedQuestion = totalNotAttempted.toString();
    result.physicsRank = "0";
    result.chemistryRank = "0";
    result.mathemeticsRank = "0";
    result.biologyRank = "0";
    result.className = this.classDetails.className;
    return result;
  }
  public getEachResultRecords(
    subject: string,
    exam: ExamEntity
  ): StudentDetails {
    let outOfMarks: number = 0;
    let totalQuestion: number = 0;
    let correctQuestion: number = 0;
    let wrongQuestion: number = 0;
    let totalPositiveMarks = 0;
    let totalNegativeMarks = 0;
    let totalAttempted = 0;
    let totalNotAttempted = 0;
    let totalVisitedQuestion = 0;
    let totalNotVisited = 0;
    let totalMarks = 0;
    let endTime = "0";
    let totalTime = 0;
    let date = "";
    let averageTime = 0;
    let percentage = 0;
    let questions = [];
    let timeForSolve:number = 0;
    exam.questions.forEach((question, index) => {
      if (!question.subjectName) {
        question.subjectName = "";
      }
      if (
        question.subjectName.toUpperCase().trim() ==
        subject.toUpperCase().trim()
      ) {
        timeForSolve += Number(question.timeTaken);

        outOfMarks += Number(question.eachCorrectMarks);
        totalQuestion += 1;
        if (question.status == ExamConstants.SOLVED) {
          let isCorrect:boolean = false;
          let eachRightMarks:number = 0;
          let eachWronMarks:number = 0;
          switch(Number(question.questionType)){
            case 5:
            case 4:
            case 3:
            case 1:
                  isCorrect = this.checkIsCorrectQuestion(question);
                  eachRightMarks = Number(question.eachCorrectMarks);
                  eachWronMarks = Number(question.eachWrongMarks);
                break;
            case 2:
                  // isCorrect = this.checkIsCorrectQuestion(question);
                  // eachRightMarks = Number(question.eachCorrectMarks);
                  // eachWronMarks = Number(question.eachWrongMarks);
                  let markIndicator:MarksIndicator = this.calculateMultiChoiceAnswer(question);
                  isCorrect = markIndicator.isCorrectQuestion ;//this.checkIsCorrectQuestion(question);
                  if(markIndicator.totalCorrectPairMarks == -1){
                    eachWronMarks = 1;
                  }else{
                    eachRightMarks = markIndicator.totalCorrectPairMarks ;
                  }
              break;
            /*case 4: // this is matrix type question
                let result = this.calculateMatrixQuestionMarks(question);
                isCorrect = result.isCorrect;
                eachRightMarks = Number(result.marks);
                eachWronMarks = Number(question.eachWrongMarks);
                break;*/
            case 6:
                isCorrect = this.checkIsCorrectQuestion(question);
                eachRightMarks = Number(question.eachCorrectMarks);
                eachWronMarks =  Number(question.eachWrongMarks);
                break;

          }
          if (isCorrect) {
            correctQuestion += 1;
            question.correctQuestion = true;
            totalPositiveMarks += Number(eachRightMarks);
          } else {
            wrongQuestion += 1;
            question.correctQuestion = false;
            if (
              question.patternName.trim().toUpperCase() !=
                ExamPatternConstant.MHTCET.toUpperCase().trim() &&
                question.patternName.trim().toUpperCase() !=
                ExamPatternConstant.MHTCET_and_MTCET2013.toUpperCase().trim()
            ) {
              totalNegativeMarks += Number(eachWronMarks);
            }
          }
          totalAttempted += 1;
        } else {
          totalNotAttempted += 1;
        }
        if (question.status == ExamConstants.NOT_VISITED) {
          totalNotVisited += 1;
        } else {
          totalVisitedQuestion += 1;
        }
        questions.push(question);
      }
    });

    let result: StudentDetails = <StudentDetails>{};
    // student details default values
    totalTime = timeForSolve ;// Number(exam.duration) - this.remainingSecond;
    totalMarks = totalPositiveMarks - totalNegativeMarks;
    if(outOfMarks<=0){
      percentage = 0.00;
    }else{
      percentage = Number(((totalMarks / outOfMarks) * 100).toFixed(2));
    }
    // if (totalMarks <= 0) {
    //   percentage = 0;
    // } else if (totalMarks > 0) {
    //   percentage = Number(((totalMarks / outOfMarks) * 100).toFixed(2));
    // }
    //calculat exam end time
    let totalSecond = TimeLibrary.convertTimeInSecond(exam.startTime);
    let allSecond = totalSecond + totalTime;
    endTime = TimeLibrary.addSecondInTime(allSecond);
    result.id = exam.testId;
    result.userName = this.student.studentLoginData.auth.userName;
    result.subName = subject;
    result.chapName = exam.chapterName;
    result.date = date;
    result.startTime = exam.startTime;
    result.endTime = endTime.toString();
    result.totalTime = totalTime.toString();
    result.averageTime = averageTime.toString();
    result.rightQuestion = correctQuestion.toString();
    result.wrongQuestion = wrongQuestion.toString();
    result.totalQuestion = totalQuestion.toString();
    result.percentage = percentage.toString();
    result.type = exam.testType;
    result.questions = JSON.stringify(questions);
    result.isManualTest = false;
    result.academicYear = this.classDetails.batch;
    result.isUpload = true;
    result.testIdAliase = null;
    result.newAverageTime = "10";
    result.outOfQuestion = exam.questions.length.toString();
    result.totalPositiveMarks = totalPositiveMarks.toString();
    result.totalNegativeMarks = totalNegativeMarks.toString();
    result.totalVisitedQuestion = totalVisitedQuestion.toString();
    result.totalMarks = totalMarks.toString();
    result.outOfMarks = outOfMarks.toString();
    result.patternName = exam.patternName;
    result.outOfTime = exam.duration;
    result.$class = this.examData.className;
    result.isResolve = true;
    result.questionType = "1";
    result.stage = "2";
    result.chapId = null;
    result.subjectGroup = null;
    result.classRoom = true;
    result.chapId = null;
    result.course = this.classDetails.course;
    result.promoteToNextLevel = false;
    result.allBranchRank = "0";
    result.branchRank = "0";
    result.divisionRank = "0";
    result.subDivisionRank = "0";
    result.branchId = "0";
    result.branch = this.classDetails.branch;
    result.allBranchId = this.currentExam.allBranchId;
    result.testSolveStatus = ((this.currentExam.testAttemptedData.attempted)?AppConstant.RE_ATTEMPTED : AppConstant.ATTEMPTED);
    result.strVisitCount = null;
    result.physicsTotalMarks = "0";
    result.chemistryTotalMarks = "0";
    result.mathemeticsTotalMarks = "0";
    result.biologyTotalMarks = "0";
    result.testFile = null;
    result.reviewFile = null;
    result.uniqueClassName = exam.uniqueClassName;
    result.printTestbal = true;
    result.mobileTestbal = true;
    result.dateTimeStamp = "";
    result.visitCount = totalVisitedQuestion.toString();
    result.notVistedQuestion = totalNotVisited.toString();
    result.totalAttemptedQuestion = totalAttempted.toString();
    result.notAttemptedQuestion = totalNotAttempted.toString();
    result.physicsRank = "0";
    result.chemistryRank = "0";
    result.mathemeticsRank = "0";
    result.biologyRank = "0";
    result.className = this.classDetails.className;
    return result;
  }
  public calculateMultiChoiceAnswer(question:Question):MarksIndicator{
    let indicator:MarksIndicator = <MarksIndicator>{};
    if(!question.origenalAnswer || question.origenalAnswer.trim().length == 0){
      question.status = ExamConstants.VISITED;
      indicator.totalCorrectPairMarks = 0;
      return indicator;
    }
    let totalCorrectOptions:string[] = question.origenalAnswer.split(",");
    if( !totalCorrectOptions || totalCorrectOptions.length == 0 ){
      question.status = ExamConstants.VISITED;
      question.obtainedQuestionMarks = 0;
      return indicator;
    }
    totalCorrectOptions = totalCorrectOptions.map(option=>option.trim().toLowerCase());
    let chooseOptions = question.options.filter(option=>option.selected);
    let selectedOption:string[] = [];
    for(let option of chooseOptions){
        selectedOption.push(option.name.trim().toLowerCase());
    }


    let correctGivenAnswer:number = 0;
    let noOfWrongAnswer:number = 0 ;
    if(selectedOption.length == 0){
      indicator.totalCorrectPairMarks = 0;
      question.status = ExamConstants.VISITED;
     // alert("not selected = " + selectedOption.length);
      return indicator;
    }
    for(let option of selectedOption){
      noOfWrongAnswer += (totalCorrectOptions.indexOf(option) == -1 )? 1 : 0 ;
    }
    if(noOfWrongAnswer > 0){
      indicator.totalCorrectPairMarks = -1;
      indicator.isCorrectQuestion = false;
      //alert("wrong answer = " + noOfWrongAnswer);
      return indicator;
    }
    for(let option of selectedOption){
      correctGivenAnswer += (totalCorrectOptions.indexOf(option)!= -1 )? 1 : 0 ;
    }
    if(correctGivenAnswer == totalCorrectOptions.length){
      indicator.isCorrectQuestion = true;
      indicator.totalCorrectPairMarks = Math.round(question.eachCorrectMarks);
      return indicator;
    }
    indicator.eachPairMark = Math.round(question.eachCorrectMarks / question.options.length);
    indicator.totalCorrectPairMarks = (indicator.eachPairMark * correctGivenAnswer );
    indicator.isCorrectQuestion = true;
    return indicator;
  }

  public multipleChoiceQuestionCheck(question:Question):MarksIndicator{
    let indicator:MarksIndicator = <MarksIndicator>{};
        try{
            let multiOption = new Array<string>();
            multiOption = question.origenalAnswer.split(",");
            indicator.noOfPairs = multiOption.length;
            if(!multiOption){
              indicator.isCorrectQuestion = false;
            }else{
               let correctCount = 0;
               let selectedCount = 0;
               question.options.forEach(option=>{
                 if((multiOption.indexOf(option.name.toLowerCase())!= -1
                   || multiOption.indexOf(option.name.toUpperCase())!= -1)
                   && option.selected){
                   correctCount++;
                 }

                 if(option.selected){
                    selectedCount++;
                 }
               });
               let eachPairMarks:number = Math.round((question.eachCorrectMarks / multiOption.length));
               let obtainedMarks:number = (eachPairMarks * correctCount );
               indicator.eachPairMark = eachPairMarks;
               indicator.totalCorrectPairMarks = obtainedMarks;
               if(correctCount != 0){
                 indicator.isCorrectQuestion = true;
               }
              //  if(correctCount == multiOption.length && correctCount == selectedCount){
              //    isCorrect = true;
              //  }else{
              //    isCorrect = false;
              //  }
              }

         }catch(e){
              indicator.isCorrectQuestion = false;
              console.log(e);
         }
        return indicator;
  }
  public checkIsCorrectQuestion(question: Question): boolean {
    switch (Number(question.questionType)) {
      case 5:
      case 4:
      case 3:
      case 1:
         if (
          question.origenalAnswer != null
          && question.singleAnswer != null
          && question.origenalAnswer.trim().toUpperCase() == question.singleAnswer.trim().toUpperCase()
        ) {
          return true;
        }
        break;
      case 2:
        // multiple correct
        // let isCorrect = true;
        //  try{
        //       let multiOption = new Array<string>();
        //       multiOption = question.origenalAnswer.split(",");
        //       if(!multiOption){
        //         isCorrect = false;
        //       }else{
        //        let correctCount = 0;
        //        let selectedCount = 0;
        //        question.options.forEach(option=>{
        //          if((multiOption.indexOf(option.name.toLowerCase())!= -1
        //            || multiOption.indexOf(option.name.toUpperCase())!= -1)
        //            && option.selected){
        //            correctCount++;
        //          }

        //          if(option.selected){
        //             selectedCount++;
        //          }
        //        });
        //        let eachPairMarks:number = Math.round((question.eachCorrectMarks / multiOption.length));
        //        let obtainedMarks:number = (eachPairMarks * correctCount );
        //        if(correctCount != 0){
        //          isCorrect = true;
        //        }
        //       //  if(correctCount == multiOption.length && correctCount == selectedCount){
        //       //    isCorrect = true;
        //       //  }else{
        //       //    isCorrect = false;
        //       //  }
        //       }

        //  }catch(e){
        //       isCorrect = false;
        //       console.log(e);
        //  }
        // return isCorrect;
      // case 4:
      //     let result =  this.calculateMatrixQuestionMarks(question);
      //     return result.isCorrect;
      case 6:
            let numberWithNoDecimal = /^\d+$/;
            let numberWith2Decimal = /^\d+(\.).{1,2}$/;
            let numberMorthan3Decimal = /^\d+(\.).{3,}$/;
            if( question.origenalAnswer && numberWithNoDecimal.test(question.origenalAnswer.trim()) || numberWith2Decimal.test(question.origenalAnswer.trim())){
              if (
                question.origenalAnswer != null &&
                question.singleAnswer != null &&
                question.origenalAnswer.toString().trim().toUpperCase() ==
                question.singleAnswer.toString().trim().toUpperCase()
              ) {
                return true;
              }
            }else if(numberMorthan3Decimal.test(question.origenalAnswer)){
                let pattern = /(\d)+(\.).{2}/;
                let result = pattern.exec(question.origenalAnswer);
                let num1 = null;
                let num2 = null;
                if(result != null ){
                    num1 = Number(result[0]);
                    num2 = Number(question.origenalAnswer.trim()).toFixed(2);
                    if(num1 == Number(question.singleAnswer) || num2 == Number(question.singleAnswer)){
                      return true;
                    }
                }
            }else{
                if(question.singleAnswer && question.origenalAnswer
                && question.singleAnswer.trim().toUpperCase() == question.origenalAnswer.trim().toUpperCase()){
                  return true;
                }
            }
          return false;
    }
    return false;
  }
  public integerQuestionInputKeypress(event: KeyboardEvent) {
    const pattern = /^[0-9.-]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if(this.currentQuestion.singleAnswer== null || this.currentQuestion.singleAnswer.trim().length<1){
        if(inputChar=="."){
          event.preventDefault();
          return;
        }
        if(!pattern.test(inputChar)){
          event.preventDefault();
          return;
        }
    }
    if(inputChar == "." && this.currentQuestion.singleAnswer && this.currentQuestion.singleAnswer.trim().indexOf(inputChar) != -1 ){
        event.preventDefault();
        return;
    }
    if(inputChar == "-" && this.currentQuestion.singleAnswer && this.currentQuestion.singleAnswer.trim().indexOf(inputChar) != -1 ){
      event.preventDefault();
      return;
    }
    if(/^.+-$/.test(this.currentQuestion.singleAnswer)){
      event.preventDefault();
      return;
    }
    if(!pattern.test(inputChar)){
      event.preventDefault();
      return;
    }
    if(/^.+(\.(\d){2})$/.test(this.currentQuestion.singleAnswer)){
      event.preventDefault();
    }
  }
  public calculateMatrixQuestionMarks(question:Question):{isCorrect:boolean,marks:number}{
    let matrixCorrectMarks = false;
    try{
      let rows = question.matrixOptions.rows;
      let answer = question.matrixOptions.answers;
      let answerData = {};
      for(let i = 0;i<rows.length;i++){
        answerData[rows[i]]= [];
        let pattern = rows[i]+".*";
        let regex = new RegExp(pattern);
        for(let j=0;j<answer.length;j++){
           if(regex.test(answer[j])){
             answerData[rows[i]].push(answer[j]);
           }
        }
      }

      let questionMarks = question.eachCorrectMarks;
      let markPerCorrectMatch = (questionMarks / rows.length);
      let count = 0;
      let answerRow = question.matrixOptions.answerRow;
      let marks = 0;
      for(let key in answerData){
        let answer = answerRow[count];
        let splitAnswer = answer.split(',');
        let countAns = 0;
        for(let i = 0;i<answerData[key].length;i++){
             let ch = answerData[key][i].charAt(1);
             if(splitAnswer&& splitAnswer.length>0){
                for(let i = 0;i<splitAnswer.length;i++){
                  if(splitAnswer[i]==ch){
                    ++countAns;
                  }
                }
             }
        }
        if(countAns==splitAnswer.length && answerData[key].length==splitAnswer.length){
          marks+=markPerCorrectMatch;
          matrixCorrectMarks = true;
        }
        count++;
      }
      // console.log({isCorrect:matrixCorrectMarks,marks:marks});
      return {isCorrect:matrixCorrectMarks,marks:marks};
    }catch(e){
      matrixCorrectMarks = false;
    }
    return {isCorrect:matrixCorrectMarks,marks:0};
  }
  public multipleOptionChecked(checkBox:MatCheckboxChange,option:SingleOption):void{
    option.selected = checkBox.checked;
    if(checkBox.checked){
        this.currentQuestion.multipleAnswer.push(option.name);
    }else{
      let index = this.currentQuestion.multipleAnswer.indexOf(option.name);
      this.currentQuestion.multipleAnswer.splice(index,1);
    }
    if(this.currentQuestion.multipleAnswer.length>0){
      this.currentQuestion.status = ExamConstants.SOLVED;
      this.currentQuestion.background = "green";
    }else{
       this.currentQuestion.status = ExamConstants.VISITED;
       this.currentQuestion.background = "red";
    }
  }
}
