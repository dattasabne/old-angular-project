import { PHYSICS, CHEMISTRY, MATHEMATICS, BIOLOGY } from './../../../website/model/subject.constant';
import { BACKSPACE } from './../../../website/model/key.constant';
import { SubjectIdModel } from './../models/subject.id.model';
import { AppConstant } from './../../../shared/app-constant/app-constatnt';
import { HttpErrorResponse } from '@angular/common/http';
import { SubjectNames } from './../../../shared/services/reffdata.model.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AutoComplateContainer } from './../models/autocomplete.container';
import { map } from 'rxjs/operators';
import { startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AdminLoginService } from './../../admin-services/admin-login-service';
import { SearchTest } from './../../../students/analysis-search/search-test';
import { PaperPrintingHttpService } from './../http-services/paper.printing.http.service';
import { MatSelectChange } from '@angular/material';
import { ResponseModel } from './../../../website/model/response.model';
import { HttpResponse } from '@angular/common/http';
import { UPLOAD_DOCX_FILE_MESSAGE, UPLOAD_SUBJECT_FILE_MESSAGE, DOCX_FILE_EXTENSION, FILE_UPLOAD_SUCCESS_MESSAHE } from './../../../website/model/paper.print.constants';
import { QuestionPaperPrintModel } from './../../../website/model/question.paper.print.model';
import { small_dialog } from './../../../website/model/dialog-parameter';
import { DialogService } from './../../../students/shared/services/dialog-service';
import { FileDropModel } from './../../../website/model/file-drop-model';
import { FileService } from './../../../website/model/file-service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Record, Comprehension, Matrix, MultipleCorrect, Numerical, Reasoning, SingleCorrect } from './../models/question.data.model';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
@Component({
  selector: 'app-question-paper-component',
  templateUrl: './question.paper.component.html',
  styleUrls: ['./question.paper.component.css'],
})
export class QuestionPaperComponent implements OnInit , AfterViewInit , OnDestroy{
  public academicYearData:string[] = [];
  public patternData:string[]      = [];
  public classNameData:string[]    = [];
  public testTypeData:string[]     = [];
  public subjectData:string[]      = ['PHYSICS','CHEMISTRY','MATHEMATICS','BIOLOGY'];
  public isLoader:boolean          = false;
  public subjectIds:SubjectIdModel[] = [];
  public allSubjects:Record []    = [];
  public isMobileDevice:boolean   = false;
  public paperModel:QuestionPaperPrintModel = new QuestionPaperPrintModel();
  public subjectIdControl:FormControl = new FormControl();
  public subjectIdFileterData:Observable<SubjectIdModel[]> ;
  public autoContainer:AutoComplateContainer = new AutoComplateContainer();
  public defaultSubjetId:SubjectIdModel = <SubjectIdModel>{};
  public constructor(
    private media:MediaObserver,
    public fileService:FileService ,
    private dialog:DialogService,
    private paerPrintService:PaperPrintingHttpService,
    private classData:AdminLoginService
    ){
    this.paperModel.fileMessage = "Click here or drag here to questions Docx File";
    this.paperModel.fileName = UPLOAD_DOCX_FILE_MESSAGE;
  }
  private initDefaultData():void{
    this.defaultSubjetId.valueString = "Type @ to select chapter";
    this.defaultSubjetId.index = -1;
    this.defaultSubjetId.noBorder = true;
  }
  private removeDefaultId():SubjectIdModel[]{
    return this.paperModel.selectedPaperIds.filter(subId=> subId.index != -1);
  }
  private addDefaultSubjectId():void{
    this.paperModel.selectedPaperIds.push(this.defaultSubjetId);
  }
  private filterSubjectIdFun(value:string):SubjectIdModel[]{
    const filterValue = String(value).trim().toLowerCase();
    if(filterValue){
      return this.paperModel.allChapterIds.filter(option =>(option.valueString.toLowerCase().indexOf(filterValue) !=-1));
    }
    return this.paperModel.allChapterIds;
  }

  ngOnInit(){
    window.onkeypress = this.Window_KeypressEvent.bind(this);
    this.initDefaultData();
    this.addDefaultSubjectId();
    this.initTempModel();
    this.isMobileDevice = this.checkDevice();
    this.media.asObservable().subscribe( (value:MediaChange[]) => {
      this.isMobileDevice = this.checkDevice();
    });
    this.subjectIdFileterData = this.subjectIdControl.valueChanges.pipe(
      startWith(''),map(value => this.filterSubjectIdFun(value))
    );
  }
  private checkDevice():boolean{
    return this.media.isActive(['xs','sm']);
  }

  ngAfterViewInit(){

  }
  public onDropFile_Handler(ev:DragEvent):void{
    ev.preventDefault();
    let dataTransfer:DataTransfer = ev.dataTransfer;
    let fileModel:FileDropModel = this.fileService.getFile(dataTransfer,DOCX_FILE_EXTENSION);
    let file:File = null;
    this.paperModel.fileMessage = fileModel.message;
    if(fileModel.success){
      file = fileModel.file;
      this.paperModel.fileName = file.name;
      this.paperModel.uploadedFiles.push(file);
      return;
    }
    this.dialog.showAlert(fileModel.message,small_dialog);
  }





  public removeFile(file:File):void{
    let newFiles:File[] = this.paperModel.uploadedFiles.filter(eachFile=>eachFile!= file);
    this.paperModel.uploadedFiles = newFiles;
    this.valiDateMannualQuestionSelection();
  }

  public onFileChange_Handler(ev:Event):void{
    let inputFile:HTMLInputElement = (<HTMLInputElement>ev.target);
    if(inputFile.files && inputFile.files.length >0){
      for(let index = 0 ; index < inputFile.files.length ; index++ ){
        let file:File = inputFile.files[index];
        let fileModel:FileDropModel = this.fileService.checkFileByExtention(file,DOCX_FILE_EXTENSION);
        this.paperModel.removeAndAddInputFile = false;
        setTimeout(()=>{
          this.paperModel.removeAndAddInputFile = true;
        },50);
        if(fileModel.success){
          this.paperModel.uploadedFiles.push(file);
          this.paperModel.fileName = file.name;
          this.paperModel.fileMessage = `${DOCX_FILE_EXTENSION} ${FILE_UPLOAD_SUCCESS_MESSAHE}`;
        }else{
          this.dialog.showAlert(fileModel.message,small_dialog);
        }
      }
    }
  }
  public closeSelectedId(subject:SubjectIdModel):void{
    let index:number = this.paperModel.selectedPaperIds.indexOf(subject);
    this.paperModel.selectedPaperIds.splice(index,1);
    index = this.paperModel.tabSubjectIds.indexOf(subject);
    this.paperModel.tabSubjectIds.splice(index,1);
  }

  private printModeForTesting(){
    console.log(this.paperModel);
  }

  public academicYear_changeSelect(select:MatSelectChange):void{
    this.isLoader = true;
  }

  public pattern_changeSelect(select:MatSelectChange):void{
    this.isLoader = true;
    this.paperModel.pattern = select.value;
  }
  public className_changeSelect(select:MatSelectChange):void{
    this.isLoader = true;
    this.paperModel.className = select.value;
  }
  public testType_changeSelect(select:MatSelectChange):void{
    this.isLoader = true;
    this.paperModel.testType = select.value;
  }
  public subject_changeSelect(select:MatSelectChange):void{
    this.isLoader   = true;
    this.paperModel.subjects = select.value;
    let search:SearchTest = <SearchTest>{};
    search.subjectName = this.paperModel.subjects.toString();
    search.patternName = "JEE";
    let subjectString:string = '';
    for(let i = 0 ; i < this.paperModel.subjects.length;i++){
      let subject = this.paperModel.subjects[i];
      if(i == 0){
        subjectString += `'${subject}'`;
      }else{
        subjectString += `,'${subject}'`;
      }
    }
    search.subjectName = subjectString;
    this.autoContainer.IsAutoComplate = false;
    this.loadSubjectIds(search);
  }


  public academicYear_HttpSuccessHandler(response:HttpResponse<ResponseModel>):void{
    this.isLoader = false;
    let responseModel:ResponseModel = <ResponseModel> response.body;
    if(responseModel.result){
      this.academicYearData = <string[]> responseModel.data;
      return;
    }
    this.dialog.showAlert(responseModel.message,small_dialog);
  }
  public pattern_HttpSuccessHandler(response:HttpResponse<ResponseModel>):void{
    this.isLoader = false;
    let responseModel:ResponseModel = <ResponseModel> response.body;
    if(responseModel.result){
      this.patternData = <string[]> responseModel.data;
      return;
    }
    this.dialog.showAlert(responseModel.message,small_dialog);
  }
  public className_HttpSuccessHandler(response:HttpResponse<ResponseModel>):void{
    this.isLoader = false;
    let responseModel:ResponseModel = <ResponseModel> response.body;
    if(responseModel.result){
      this.classNameData = <string[]> responseModel.data;
      return;
    }
    this.dialog.showAlert(responseModel.message,small_dialog);
  }
  public testType_HttpSuccessHandler(response:HttpResponse<ResponseModel>):void{
    this.isLoader = false;
    let responseModel:ResponseModel = <ResponseModel> response.body;
    if(responseModel.result){
      this.testTypeData = <string[]> responseModel.data;
      return;
    }
    this.dialog.showAlert(responseModel.message,small_dialog);
  }
  public subject_HttpSuccessHandler(response:HttpResponse<ResponseModel>):void{
    this.isLoader = false;
    let responseModel:ResponseModel = <ResponseModel> response.body;
    if(responseModel.result){
      this.subjectData = <string[]> responseModel.data;
      return;
    }
    this.dialog.showAlert(responseModel.message,small_dialog);
  }
  private valiDateMannualQuestionSelection():boolean{
    let isValid :boolean = true;
    if(!this.paperModel.uploadedFiles || this.paperModel.uploadedFiles.length == 0){
      this.paperModel.fileMessage = UPLOAD_SUBJECT_FILE_MESSAGE;
      this.paperModel.fileName    = UPLOAD_DOCX_FILE_MESSAGE;

      isValid = false;
    }
    return isValid;
  }
  private initTempModel():void{
    let subject1 = <Record>{};
    subject1.comprehension = <Comprehension>{};
    subject1.matrix = <Matrix>{};
    subject1.multipleCorrect = <MultipleCorrect>{};
    subject1.numerical = <Numerical>{};
    subject1.reasoning = <Reasoning>{};
    subject1.singleCorrect = <SingleCorrect>{};
    subject1.topicName = "Physics";
    subject1.total = 50;

    subject1.singleCorrect.singleNumber = 10;
    subject1.singleCorrect.singleTheory = 20;
    subject1.comprehension.paragraph = 25;
    subject1.comprehension.questions = 30;

    subject1.matrix.singleNumber = 41;
    subject1.multipleCorrect.multipleNumber = 50;
    subject1.multipleCorrect .multipleTheory = 56;
    subject1.numerical.singleNumber = 98;
    subject1.reasoning .singleNumber = 52;
    subject1.subTopics = [];

    let topic1:Record = <Record>{};
    topic1.comprehension = <Comprehension>{};
    topic1.matrix = <Matrix>{};
    topic1.multipleCorrect = <MultipleCorrect>{};
    topic1.numerical = <Numerical>{};
    topic1.reasoning = <Reasoning>{};
    topic1.singleCorrect = <SingleCorrect>{};
    topic1.topicName = "Chemistry";
    topic1.total = 50;

    topic1.singleCorrect.singleNumber = 10;
    topic1.singleCorrect.singleTheory = 20;
    topic1.comprehension.paragraph = 25;
    topic1.comprehension.questions = 30;

    topic1.matrix.singleNumber = 41;
    topic1.multipleCorrect.multipleNumber = 50;
    topic1.multipleCorrect .multipleTheory = 56;
    topic1.numerical.singleNumber = 98;
    topic1.reasoning .singleNumber = 52;


    let subject2 = <Record>{};
    subject2.comprehension = <Comprehension>{};
    subject2.matrix = <Matrix>{};
    subject2.multipleCorrect = <MultipleCorrect>{};
    subject2.numerical = <Numerical>{};
    subject2.reasoning = <Reasoning>{};
    subject2.singleCorrect = <SingleCorrect>{};
    subject2.topicName = "Chemistry";
    subject2.total = 50;
    subject2.singleCorrect.singleNumber = 10;
    subject2.singleCorrect.singleTheory = 20;
    subject2.comprehension.paragraph = 25;
    subject2.comprehension.questions = 30;

    subject2.matrix.singleNumber = 41;
    subject2.multipleCorrect.multipleNumber = 50;
    subject2.multipleCorrect .multipleTheory = 56;
    subject2.numerical.singleNumber = 98;
    subject2.reasoning .singleNumber = 52;
    subject2.subTopics = [];

    let marks1 = <Record>{};
    marks1.comprehension = <Comprehension>{};
    marks1.matrix = <Matrix>{};
    marks1.multipleCorrect = <MultipleCorrect>{};
    marks1.numerical = <Numerical>{};
    marks1.reasoning = <Reasoning>{};
    marks1.singleCorrect = <SingleCorrect>{};
    marks1.topicName = "Marks";
    marks1.total = 50;
    marks1.singleCorrect.singleNumber = 10;
    marks1.singleCorrect.singleTheory = 20;
    marks1.comprehension.paragraph = 25;
    marks1.comprehension.questions = 30;

    marks1.matrix.singleNumber = 41;
    marks1.multipleCorrect.multipleNumber = 50;
    marks1.multipleCorrect .multipleTheory = 56;
    marks1.numerical.singleNumber = 98;
    marks1.reasoning .singleNumber = 52;
    marks1.subTopics = [];
    subject1.subTopics = [];
    subject1.subTopics.push(marks1);

    this.allSubjects.push(subject1);
    this.allSubjects.push(subject2);
}
private loadSubjectIds(searchData:SearchTest):void{
    this.paerPrintService.getSubjectIds(searchData).subscribe({next:this.LoadSubjectId_SuccessHandler.bind(this),error:this.ErrorResponse_Handler.bind(this)});
}
private ErrorResponse_Handler(error:HttpErrorResponse):void{
    this.isLoader = false;
    if(error.status == 0){
      this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,small_dialog);
      return;
    }
    this.dialog.showAlert(error.message,small_dialog);
}
private LoadSubjectId_SuccessHandler(response:HttpResponse<ResponseModel>):void{
  this.isLoader = false;
  let responseModel:ResponseModel = response.body;
  if(responseModel.result){
    this.paperModel.allChapterIds = <SubjectIdModel[]>responseModel.data;
    console.log( this.paperModel.allChapterIds);
    return;
  }
  this.dialog.showAlert(responseModel.message,small_dialog);
}

public SubjectIds_ChangeHandler(input:MatAutocompleteSelectedEvent):void{
  let index:number = <number>input.option.value;
  let option:SubjectIdModel = this.paperModel.allChapterIds[index];
  this.autoContainer.IsAutoComplate = false;
  let cssClassName:string = this.findCssClassName(option);
  option.cssClassName = cssClassName;
  this.paperModel.selectedPaperIds = this.removeDefaultId();
  this.paperModel.selectedPaperIds.push(option);
  this.paperModel.tabSubjectIds    = this.removeDefaultId();
  this.addDefaultSubjectId();
}

private findCssClassName(subjetIdModel:SubjectIdModel):string {
  const subject:string = subjetIdModel.subjectName.toUpperCase();
  let className:string = "";
  switch(subject){
    case PHYSICS:
                className = 'red';
                break;
    case CHEMISTRY:
                className = 'blue';
                break;
    case MATHEMATICS:
                className = 'green';
                break;
    case BIOLOGY:
                className = 'pink';
                break;
  }
  return className;
}
public Window_KeypressEvent(ev:KeyboardEvent):void{
  let char:string = ev.key;
  if(ev.shiftKey && char == '@'){
    this.autoContainer.IsAutoComplate = true;
    ev.preventDefault();
  }
}
ngOnDestroy(){
  window.onkeypress = null;
}

















  // public doughnutChartLabels: Label= ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  // public doughnutChartLabels: Label= [];
  // public doughnutChartData: MultiDataSet = [
  //   [350, 450, 100],
  // ];
  // public doughnutChartType: ChartType = 'doughnut';




}
