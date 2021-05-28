import { small_dialog } from 'src/app/website/model/dialog-parameter';
import { ResponseModel } from './../../website/model/response.model';
import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ViewEncapsulation,
  Inject,
  LOCALE_ID,
  ChangeDetectorRef,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ElementRef
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { SearchTest } from "../analysis-search/search-test";
import { ExamReviewService } from "./exam-review-service";
import { SearchEntity } from "../shared/entity/search-entity";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { StudentDetails } from "../../admin/entity/student-details";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { Question } from "../library/interfaces/question-interface";
import { ExamConstants } from "../library/interfaces/exam-constants";
import { SelectionModel, ArrayDataSource } from "@angular/cdk/collections";
import { SortingMenu } from "../library/enums/sorting-menu-enum";
import { SortingClass } from "../library/sorting-class";
import { formatDate } from "@angular/common";
import { DialogService } from "../shared/services/dialog-service";
import { DataShareService } from "src/app/shared/services/data-share-service";
import { AppConstant } from "src/app/shared/app-constant/app-constatnt";
import { StudentAccountService } from '../shared/services/student-account-service';
import { SafeUrl } from '@angular/platform-browser';
import { ExamUtility } from '../exam-start/matrix-option/exam.utility';
@Component({
  selector: "app-exam-review",
  templateUrl: "./exam-review.component.html",
  styleUrls: ["./exam-review.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class ExamReviewComponent implements OnInit, AfterViewInit , OnDestroy {
  public footerData = { name: "datta", address: "parli" };
  public testPdf: string = "";
  public reviewPdf: string = "";
  public pallete: any;
  public totalQuestion:number = 0;
  @ViewChild("paginator", { read: MatPaginator ,static:false})
  private paginator: MatPaginator;
  public pageNo: number = 0;
  public zoomLevel: number = 1.5;
  public isQuestionPaper: boolean = true;
  public isLoaded: boolean = false;
  public classData: SearchTest = <SearchTest>{};
  public solvedDatesControl: FormControl = new FormControl({}, []);
  public allSolvedTest: Array<any> = new Array<any>();
  public reviewData: any = {};

  public ascQuestionNo: boolean = true;
  public ascRightOrWrong = true;
  public ascTimeTaken: boolean = true;
  public ascVisitCount: boolean = true;
  public ascSubject: boolean = true;
  public totalQustion: number = 0;
  public koshBrandLogo:SafeUrl = null;//AppConstant.KoshBrandingLogo;
  public sortField: SortingMenu = SortingMenu.None;
  public ascOrDesc: boolean = true;
  public className:string = '';
  public studentName:string = "";
  public testSolveStatus:string = "";
  @ViewChild("parent",{read:ElementRef, static:true}) private pdfSection:ElementRef ;
  constructor(
    private render2: Renderer2,
    private examReviewService: ExamReviewService,
    @Inject(LOCALE_ID)  private locale:string,
    private dialog:DialogService,
    private student:StudentAccountService
  ) {}
  public getFormatedDate(date:string):string{
    return formatDate(date,"EEEE, MMMM d, y hh:mm:ss",this.locale);
  }
  public nextQuestion():void{
      let index = this.currentSubjectQuestion.indexOf(this.currentQuestion);
      index++;
      if(index>=this.currentSubjectQuestion.length){
        this.dialog.showAlert(`this is the last question of ${this.currentQuestion.subjectName}`,{height:200,width:500});
        return;
      }
      let question = this.currentSubjectQuestion[index];
      this.displayQuestionData(question);
  }
  public previousQuestion():void{
    let index = this.currentSubjectQuestion.indexOf(this.currentQuestion);
    index--;
    if(index<0){
      this.dialog.showAlert("this is first question",{height:200,width:500});
      return;
    }
    let question = this.currentSubjectQuestion[index];
    this.displayQuestionData(question);
  }
  @Input("reviewSearchData")
  public set analysisTestData(searchData:SearchTest){
    this.classData = searchData;
  }
  @Output("close")
  public closeEventEmmiter:EventEmitter<void> = new EventEmitter<void>();
  public close():void{
    this.closeEventEmmiter.emit();
  }
  ngOnInit() {
    this.koshBrandLogo = AppConstant.instituteLogo ;//this.student.studentLoginData.loginClass.classLogo;
    this.isQuestionPaper = false;
    this.studentName = this.student.studentLoginData.info.studentName;
    // let reviewCriterial = localStorage.getItem("reviewCriterial");
    if (!this.classData) {
      this.dialog.showAlert("Invalid Data Passes. Please Contact Your Website Administrator.",{height:200,width:500});
    } else {
      // this.classData = <SearchTest>JSON.parse(reviewCriterial);
      this.className = this.classData.className;
      // localStorage.removeItem("reviewCriterial");
      this.startExecution();
    }

    this.solvedDatesControl.valueChanges.subscribe(test => {
      this.displayTestDataOnView(test);
    });



  }


  ngOnDestroy(){

  }














  public sortByNsequence() {
    this.ascQuestionNo = !this.ascQuestionNo;
    this.ascOrDesc = this.ascQuestionNo;
    this.sortField = SortingMenu.QuestionNo;
    let questions = <Array<Question>>(
      JSON.parse(this.currentSelectedSubjectTest.questions)
    );
    this.displaySortedData(questions);
  }
  public sortByTimeTaken() {
    this.ascOrDesc = !this.ascTimeTaken;
    this.sortField = SortingMenu.TimeTaken;
    this.ascTimeTaken = !this.ascTimeTaken;
    let questions = <Array<Question>>(
      JSON.parse(this.currentSelectedSubjectTest.questions)
    );
    this.displaySortedData(questions);
  }
  private displaySortedData(questions: Array<Question>): void {
    let data = SortingClass.sort(questions, this.ascOrDesc, this.sortField);
    this.generateQuesionColor(data);
    this.questionDataSource = new MatTableDataSource<Question>(data);
    //this.questionDataSource.paginator = this.paginator;
    this.currentSubjectQuestion = data;
    this.clearAllRowsColor(this.currentSubjectQuestion);
    if (this.currentSubjectQuestion.length > 0) {
      this.displayQuestionData(this.currentSubjectQuestion[0]);
    }
  }
  public sortByRightOrWrong() {
    this.ascRightOrWrong = !this.ascRightOrWrong;
    this.ascOrDesc = this.ascRightOrWrong;
    this.sortField = SortingMenu.RightOrWrong;
    let questions = <Array<Question>>(
      JSON.parse(this.currentSelectedSubjectTest.questions)
    );
    this.displaySortedData(questions);
  }

  public sortByNoOfVisit() {
    this.ascVisitCount = !this.ascVisitCount;
    this.ascOrDesc = this.ascVisitCount;
    this.sortField = SortingMenu.VisitCount;
    let questions = <Array<Question>>(
      JSON.parse(this.currentSelectedSubjectTest.questions)
    );
    this.displaySortedData(questions);
  }
  public togglePalleteInitialize(): void {
    this.pallete = document.querySelector(".pallete") as HTMLElement;
  }
  // this is the application entrypoint to start execution !.
  private startExecution(): void {
    this.getReviewData();
  }

  public getReviewData(): void {
    this.isLoaded = true;
    try{
      const data = <SearchEntity>{};
      data.uniqueClassName = this.classData.uniqueClassName;
      data.batch = this.classData.batch;
      data.course = this.classData.course;
      data.branch = this.classData.branch;
      data.division = this.classData.division;
      data.subDivision = this.classData.subDivision;
      data.testId = this.classData.testId;
      data.pkId = this.classData.pkId;
      this.examReviewService.getReviewData(data).subscribe( {next:this.reviewDataSuccess_Handler.bind(this) , error:this.httpErrorResponse_Handler.bind(this)});
    }catch(error){
      this.isLoaded = false;
      this.dialog.showAlert("getReviewData : "+error,{height:300,width:500});
    }
  }
  public reviewResponse:Question[] = [];
  public reviewDataSuccess_Handler(response:HttpResponse<ResponseModel>):void{
      this.isLoaded = false;
      let responseModel:ResponseModel = response.body;

      if(responseModel.result){
        this.reviewResponse = responseModel.questionData;
        
        // console.log(this.reviewResponse);

        this.reviewData = responseModel.data;
        this.displayFirstRecordOfReview();
      }else{
        this.dialog.showAlert(responseModel.message,small_dialog);
      }
  }

  public httpErrorResponse_Handler(error:HttpErrorResponse):void{
    this.isLoaded = false;
    if(error.status == 0){
      this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,{height:300,width:500});
      return;
    }
    this.dialog.showAlert(error.message,{height:300,width:500});
  }

   public displayedColumns: string[] = [
    "nSquence",
    "mark",
    "correctQuestion",
    "timeTaken",
    "noOfVisit",
    "subjectName"
  ];
  public questionDataSource: MatTableDataSource<Question> = null;
  public allOptions = [];
  public allSubjects: Array<StudentDetails> = new Array<StudentDetails>();
  public selection = new SelectionModel<Question>(true, []);

  public displayTestDataOnView(testData: any): void {
    this.allSubjects = testData.subjects;
    this.clickOnEachSubject(testData.subjects[0]);

  }
  public currentSelectedSubjectTest: StudentDetails = <StudentDetails>{};
  public currentSubjectName:string = "";
  public getColorMarks(question:Question):string{
    return ExamUtility.getColorByMarks(question);
  }
  public PdfLoad_SuccessHandler(message:any):void{
    // this.dialog.showAlert(message,small_dialog);
  }
  public PdfLoad_FailedHandler(error:any):void{
    this.dialog.showAlert(error,small_dialog);
  }


  public clickOnEachSubject(test: StudentDetails): void {
    this.testSolveStatus = test.testSolveStatus;
    this.currentSubjectName = test.subName;
    this.currentSelectedSubjectTest = test;
    let questions = <Question[]>JSON.parse(test.questions);
    this.clearAllSubjectBackground();
    test.background = "#6495ED";
    if (questions) {
      this.questionDataSource = new MatTableDataSource<Question>(questions);
     // this.questionDataSource.paginator = this.paginator;
      this.generateQuesionColor(questions);
      this.currentSubjectQuestion = questions;
      this.displayQuestionData(questions[0]);
    }
  }
  private clearAllSubjectBackground():void{
    this.allSubjects.forEach(subject=>{
      subject.background = "lightseagreen";
    });
  }
  public currentSubjectQuestion: Question[] = [];
  public clearAllRowsColor(dataSource: Array<Question>): void {
    dataSource.forEach(question => {
      question.background = "#fff";
    });
  }
  public generateQuesionColor(question: Question[]): void {
    question.forEach(q => {
      this.displayQuestionColor(q);
    });
  }
  public correctAnswer: string = "";
  public givenAnswer: string = "";
  public currentQuestion: Question = <Question>{};
  public isCheckRightWrongAttempted: number = 2;
  public questionType:number = 0;

  public clickOnTableRow(question:Question):void{
    this.questionType = Number( question.questionType);
    this.chooseQuestionAnswer(question);
    this.displayQuestionData(question);

    this.togglePallete();

  }
  public createMatrixReview(question:Question):void{
      let matrix = question.matrixOptions.matrix;
      let matrixAnswerArray = [];
      for(let i=0;i<matrix.length;i++){
        for(let j=0;j<matrix[i].length;j++){
          if(matrix[i][j].isChecked){
            matrixAnswerArray.push(matrix[i][j].value);
          }
        }
      }
      // calculate origenal matrix answers
      let matrixRows = question.matrixOptions.rows;
      let answerRow = question.matrixOptions.answerRow;
      let matrixOrigenalAns = [];
      for(let row=0;row<matrixRows.length;row++){
          let ans = answerRow[row];
          let splitAns = ans.split(",");
          if(Array.isArray(splitAns)){
              for(let op=0;op<splitAns.length;op++){
                let option = matrixRows[row]+splitAns[op];
                matrixOrigenalAns.push(option);
              }
          }
      }
      this.matrixGivenAnswers = matrixAnswerArray.join();
      this.matrixOrigenalAnswerText = matrixOrigenalAns.join();
  }
  public  chooseQuestionAnswer(question:Question):void{
     switch(Number(question.questionType)){
       case 5:
       case 4:
       case 3:
       case 1:
              this.correctAnswer = question.origenalAnswer;


              this.givenAnswer   = question.singleAnswer;
              if(String(this.correctAnswer).trim().toUpperCase() == String(this.givenAnswer).trim().toUpperCase()){
                question.correctQuestion = true;
              }else{
                question.correctQuestion = false;
              }
              this. displayQuestionColor(question);
              break;
      case 2: // this is multiple question
              this.correctAnswer  =  question.origenalAnswer;
              this.multipleAnswer = this.formatMultipleAnswerInSequesnce(question.origenalAnswer , question.multipleAnswer);

            break;
      // case 4: // this is matrix type question
      //     this.createMatrixReview(question);
      //   break;
      case 6:
          this.correctAnswer = question.origenalAnswer;
          this.givenAnswer = question.singleAnswer;

          break;
     }
  }

  public multipleAnswer:string = "";
  public matrixGivenAnswers = '';
  public matrixOrigenalAnswerText = '';

  public displayQuestionData(question: Question): void {
    (<HTMLElement>this.pdfSection.nativeElement).scrollTop = 0;
    this.questionType =Number(question.questionType);
    this.displayQuestionPaperText = "show review";
    this.isQuestionPaper = false;
    this.currentQuestion = question;
    this.pageNo = Number(question.nSquence);

    


    this.clearAllRowsColor(this.currentSubjectQuestion);
    question.background = "skyblue";
    this.displayRightWrongSymbol();
    this.chooseQuestionAnswer(question);

  }
  public displayQuestionColor(question: Question): void {
    if (this.isCorrectQuestion(question)) {
      question.color = "#66CD00";
    } else if (this.isWrongQuestion(question)) {
      question.color = "red";
    } else {
      question.color = "purple";
    }
  }
  public rightOrWrongSymbolIndicator:number = 2;
  public displayRightWrongSymbol(): number {
    if (this.isCorrectQuestion(this.currentQuestion)) {
      this.rightOrWrongSymbolIndicator = 1;
      return 1;
    } else if (this.isWrongQuestion(this.currentQuestion)) {
      this.rightOrWrongSymbolIndicator = 0;
      return 0;
    } else {
      this.rightOrWrongSymbolIndicator = 2;
      return 2;
    }
  }
  public checkIsCorrectAnswer(givenQuestion:Question):boolean {
    let origenalAnswer:string = givenQuestion.origenalAnswer.trim().toUpperCase();
    let givenAnswer:string    = String(givenQuestion.singleAnswer).trim().toUpperCase();
    return (origenalAnswer == givenAnswer);
  }


  public isCorrectQuestion(question: Question): boolean {
     if (question.status && question.status == ExamConstants.SOLVED && this.checkIsCorrectAnswer(question)) {
      this.isCheckRightWrongAttempted = 1;
      return true;
    }
    return false;
  }
  public isWrongQuestion(question: Question): boolean {
    if (question.status && question.status == ExamConstants.SOLVED && this.checkIsCorrectAnswer(question) == false) {
       this.isCheckRightWrongAttempted = 0;
      return true;
    }
    return false;
  }
  public isNotAttemptedQuestion(question: Question): boolean {
    if (question.status && question.status != ExamConstants.SOLVED && this.checkIsCorrectAnswer(question) != true) {
     this.isCheckRightWrongAttempted = 2;
      return true;
    }
    return false;
  }
  // this function execute only ones
  public allBranchId:string = "";
  public patternName:string = "";
  public assignmentType:string = "";
  public formatMultipleAnswerInSequesnce(correctAnswer:string , givenAnswer:string[]):string{
    try{
      if(!givenAnswer || !Array.isArray(givenAnswer) || givenAnswer.length == 0){
        return "";
      }
      let comparator:(first:string,second:string)=>number = (first:string,second:string)=>{
        if(first > second){
          return -1;
        }
        if(second > first){
          return 1;
        }
        return 0;
      };
      return givenAnswer.sort(comparator).join();
    }catch(ex){
      this.dialog.showAlert(ex,{height:200, width:500});
    }
    return "";
  }
  public displayFirstRecordOfReview(): void {
    try {
      if (this.reviewData.solvedTest.length > 0) {
        let testData = this.reviewData.solvedTest[0].subjects;
        this.allBranchId = testData[0].allBranchId;
        this.patternName = testData[0].patternName;
        this.assignmentType = testData[0].assignmentType;
        
      


        if(testData.length == 1 || testData.length > 3 ){
          this.totalQuestion = JSON.parse(testData[0].questions).length;
        }else{
          for(let i = 0; i<testData.length ; i++){
            let subject = testData[i];
            this.totalQuestion += JSON.parse(subject.questions).length;
          }
        }
        this.testPdf = this.reviewData.testPdf;
        this.reviewPdf = this.reviewData.reviewPdf;

        

        this.allSolvedTest = this.reviewData.solvedTest;
        this.solvedDatesControl.setValue(this.allSolvedTest[0]);
        this.displayTestDataOnView(this.allSolvedTest[0]);
      } else {
        this.dialog.showAlert("Review Not Available. Please Solve Test First.",{height:200,width:500});
      }
    } catch (error) {
      this.dialog.showAlert("displayFirstRecordOfReview : "+error,{height:300,width:500});
    }
  }
  public togglePallete(): void {
    let isSmall = window.matchMedia("(max-width:900px)").matches;
    if (this.pallete != null && isSmall) {
      this.pallete.classList.toggle("active-pallete");

    }
  }
  ngAfterViewInit() {
    this.adjustHeight();
    this.adjustButtonHeight();
    this.togglePalleteInitialize();
    this.render2.listen(window, "resize", () => {
      this.adjustHeight();
      if (
        !window.matchMedia("max-width:900px").matches &&
        this.pallete != null
      ) {
        this.pallete.classList.remove("active-pallete");
      }
      this.adjustButtonHeight();
    });
  }
  public adjustHeight(): void {
    let examSection = document.querySelector(".exam-section") as HTMLDivElement;
    let pdfSection = document.querySelector(".pdf-section") as HTMLElement;
    let pallete = document.querySelector(".pallete") as HTMLElement;
    let questionPallete = document.querySelector(".pallete-question") as HTMLElement;
    let body = document.querySelector("body");
    let innerHeight = body.offsetHeight;
    if (examSection
       && body
       && innerHeight
       && questionPallete
       && pdfSection
       && pallete
       && questionPallete) {
      let navbarSize:number = 60;
      let viewPortHeight = innerHeight - (navbarSize);
      let perPerPixel = 100 / innerHeight;
      let heightInPercent = perPerPixel * viewPortHeight;
      let pdfSectionHeight = innerHeight - (navbarSize + 100 + 5);
      examSection.style.height = heightInPercent + "%";
      pallete.style.height = viewPortHeight+"px";
      pdfSection.style.height = pdfSectionHeight+"px";
      let questionPalleteHeight = (viewPortHeight - 54);
      questionPallete.style.height = questionPalleteHeight +"px";
    }
  }


  public adjustButtonHeight(): void {
    let pallete = document.querySelector(".pallete-question") as HTMLElement;
    let palleteButton = document.querySelector(
      ".button-pallete"
    ) as HTMLElement;
    if (pallete && palleteButton) {
      let palleteHeight = pallete.offsetHeight;
      let perPerPixel = 100/ palleteHeight;
      let pallteNetHeight = palleteHeight - (20 + 30 + 10);
      let finalHeight = perPerPixel * pallteNetHeight;
      palleteButton.style.height = palleteHeight+"px";
    }
  }
  public displayQuestionPaperText: string = "show review";
  public displayQuestionPaper(): void {
    this.isQuestionPaper = !this.isQuestionPaper;
    this.displayQuestionPaperText = this.isQuestionPaper
      ? "show question "
      : "show review";
  }
  public onSubjectClick(index: number): void {}
}
