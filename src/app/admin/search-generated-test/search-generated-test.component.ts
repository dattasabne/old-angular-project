
import { StringUtility } from 'src/app/website/utility-service/string.utility';
import { TimeLibrary } from './../../students/shared/library/time.library';
import { TestCenterAssignmentModel } from './test.center.assignment';
import { AssignmentAssignedDataModel } from './../student-assignmnet/data-model/assignment.assignform.model';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GeneratedTest, GeneratedTestHeader } from './generated-test-model';
import { MessageService } from 'src/app/admin/services/message.service';
import { RefferenceModel } from 'src/app/shared/services/reffdata.model.service';
import { ReprintTestDetailsComponent } from 'src/app/admin/reprint-test-details/reprint.test.details.component';
import { SearchGeneratedTestService } from './search.generated.test.service';
import { DataShareService } from 'src/app/shared/services/data-share-service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'src/app/kosh-admin/services/dialog-service';
import { MediaObserver } from '@angular/flex-layout';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { MatExpansionPanel } from '@angular/material';
@Component({
  selector: 'app-search-generated-test',
  templateUrl: './search-generated-test.component.html',
  styleUrls: ['./search-generated-test.component.css']
})
export class SearchGeneratedTestComponent implements OnInit,AfterViewInit {
  @ViewChild("searchExpansion",{static:true})public expansionPanel:MatExpansionPanel
  public loaderActivate:boolean = false;
  public patternList:Array<string> = new Array<string>();
  public standaredList:Array<string> = new Array<string>();
  public testTypeList:Array<string> = new Array<string>();
  public subjectList:Array<string> = new Array<string>();
  public academicList:Array<string> = new Array<string>();
  public patternControl:FormControl = new FormControl('All',[Validators.compose([Validators.required])]);
  public standaredControl:FormControl = new FormControl('All',[Validators.compose([Validators.required])]);
  public subjectControl:FormControl = new FormControl('All',[Validators.compose([Validators.required])]);
  public testTypeControl:FormControl = new FormControl('All',[Validators.compose([Validators.required])]);
  public academicYearControl:FormControl =  new FormControl('All',[Validators.compose([Validators.required])]);
  constructor(
      private dialog:DialogService,
      private message:MessageService ,
      private refData:RefferenceModel,
      private service:SearchGeneratedTestService ,
      private dataShare:DataShareService,
      private media:MediaObserver ) {
      this.subjectControl = new FormControl('Physics',[]);
  }
  ngOnInit() {
    this.getAllSubjects();
    this.getHeaders();
    this.defultInitComponentData();
  }
  public isMobileView:boolean = false;
  public disableExpansion:boolean;
  public mobileViewSearchCriteriaExpansion(breakPoint:string):void{
    if(this.checkIsMobileDevice(breakPoint)){
      this.disableExpansion = false;
      this.expansionPanel.close();
    }else{
      this.disableExpansion = true;
      this.expansionPanel.open();
    }
  }
  public evenOddBackGroundColor():void{
    let expansion:NodeList = <NodeList> document.querySelectorAll(".search-mat-expansion-panel");
    for(let i = 0 ; i <expansion.length;i++){
      let element:HTMLElement = <HTMLElement>expansion[i];
        if(i%2 == 0){
          element.classList.add("even-row");
        }else{
          element.classList.add("odd-row");
        }
    }
  }

  ngAfterViewInit(){
    this.selfRefference = this;
    this.media.media$.subscribe(breakPoint=>{
      this.isMobileView = this.checkIsMobileDevice(breakPoint.mqAlias);
      this.responsiveScreen();
      this.mobileViewSearchCriteriaExpansion(breakPoint.mqAlias);
    });
  }
  public checkIsMobileDevice(breakPoint:string):boolean{
    return (breakPoint.trim().toLowerCase() == "xs" || breakPoint.trim().toLowerCase() == "sm");
  }
  public getMediaBreakPoint(media:MediaObserver):string{
      if(media.isActive("xs"))return "xs";
      else if(media.isActive("sm"))return "sm";
      else if(media.isActive("md"))return "md";
      else if(media.isActive("lg"))return "lg";
      else if(media.isActive("xl"))return "xl";
  }
  public checkIsMediaMobileDevice(media:MediaObserver):boolean{
    if(media.isActive("xs") || media.isActive("sm")){
      return true;
    }
    return false;
  }
  public defultInitComponentData():void{
    this.patternList = this.refData.patternName;
    this.standaredList = this.refData.classNames;
    this.testTypeList = this.refData.testTyep;
    this.academicList = this.refData.academicYearNames;
    this.patternList.unshift("All");
    this.standaredList.unshift("All");
    this.testTypeList.unshift("All");
    this.academicList.unshift("All");
    this.subjectControl.setValue("All");
    if(this.patternList.length>0){
      this.patternControl.setValue(this.patternList[0]);
    }
    if(this.standaredList.length>0){
      this.standaredControl.setValue(this.standaredList[0]);
    }
    if(this.testTypeList.length>0){
      this.testTypeControl.setValue(this.testTypeList[0]);
    }
    this.patternControl.valueChanges.subscribe(pattern=>{
        this.subjectList = this.refData.getSubjectFromPattern(pattern);
        this.subjectList.unshift("All");
        if(this.subjectList.length>0){
          this.testTypeControl.setValue(this.testTypeList[0]);
        }
    });
    this.testTypeControl.valueChanges.subscribe(type=>{
      let pattrn = this.patternControl.value;
      this.subjectList = this.refData.getSubjectFromPatternAndTestType(pattrn,type);
      this.subjectList.unshift("All");
      if(this.subjectList.length>0){
        this.subjectControl.setValue(this.subjectList[0]);
      }
    });
}
  public allSubjects:Array<any> = new Array<any>();
  public standards:Array<any> = new Array<any>();
  public chapters:Array<any> = new Array<any>();
  public tableHeader =  <GeneratedTestHeader>{};
  public table = <GeneratedTest>{};
  public getHeaders() {
    this.tableHeader.testId = "TestId",
    this.tableHeader.totQues = "TotQues",
    this.tableHeader.pattern = "Pattern",
    this.tableHeader.standard = "Standard",
    this.tableHeader.subject = "Subject",
    this.tableHeader.testType = "TestType",
    this.tableHeader.testGenerationType = "GenType",
    this.tableHeader.totalMarksOfTest = "TotMarks",
    this.tableHeader.onlineStatus = "OnlineStatus"
  }
  public allTests:GeneratedTest[] = [];
  public showTests:boolean = false;
  public showAssignTestForm:boolean = false;
  public assignmentAssignedDataModel:AssignmentAssignedDataModel = <AssignmentAssignedDataModel>{};
  public assignTest_Click(test:GeneratedTest):void{
    let assignTest:boolean = true;
    this.openAssignmentAssignedForm(test,assignTest) ;
  }
  public viewAssignedTest_Click(test:GeneratedTest){
    let assignTest:boolean = false;
    this.openAssignmentAssignedForm(test,assignTest) ;
  }
  private openAssignmentAssignedForm(test:GeneratedTest , assignTest:boolean):void{
    if(!this.showAssignTestForm){
      this.assignmentAssignedDataModel.batch         = test.batch;
      this.assignmentAssignedDataModel.course        = test.course;
      this.assignmentAssignedDataModel.description   = test.testdescription;
      this.assignmentAssignedDataModel.duration      = test.testDuration;
      this.assignmentAssignedDataModel.patternName   = test.patternName;
      this.assignmentAssignedDataModel.subjectName   = test.subject;
      this.assignmentAssignedDataModel.totalMarks    = test.totalMarksOfTest;
      this.assignmentAssignedDataModel.totalQuestion = test.noOfQuestions;
      this.assignmentAssignedDataModel.assigned      = test.assigned;
      this.assignmentAssignedDataModel.assigned      = test.assigned;
      this.assignmentAssignedDataModel.doCreate      = assignTest;
      this.assignmentAssignedDataModel.hourFormat    = test.timeFormat;
      this.assignmentAssignedDataModel.duration      = test.testDuration;



      this.assignmentAssignedDataModel.questionPaperId =  test.testId.toString();
      if(StringUtility.getDefaultString(test.onlineId).length != 0){
        this.assignmentAssignedDataModel.onlineExamId = Number(test.onlineId);
      }else{
        this.assignmentAssignedDataModel.onlineExamId = 0;
      }
      this.showAssignTestForm = true;
    }
  }
  public selfRefference:SearchGeneratedTestComponent = null;
  public closeAssignTestForm():void{
    this.showAssignTestForm = false;
  }
  public testResult_OnSuccessResponse(response:HttpResponse<any>):void{
    let responseBody = response.body;
    let testList:TestCenterAssignmentModel[] = <TestCenterAssignmentModel[]> responseBody.data;
    this.allTests = [];
    this.loaderActivate = false;
    this.showTests = true;
    console.log(testList);
    for(let i = 0 ;i < testList.length;i++ ){
      let item:TestCenterAssignmentModel = testList[i];
      let test:GeneratedTest = <GeneratedTest>{};
      test.batch = item.studentDetails.academicYear;
      test.noOfQuestions = item.studentDetails.totalQuestion;
      test.courses = item.courses;
      test.testId = item.studentDetails.id;
      test.patternName = item.studentDetails.patternName;
      test.standard = item.studentDetails.$class;
      test.testType = item.studentDetails.type;
      test.subject = item.studentDetails.subName;
      test.totalMarksOfTest = Number(item.studentDetails.outOfMarks);
      test.chapterName = item.studentDetails.chapName;
      test.testGenerationType = item.studentDetails.testUploadedType;
      test.date = item.studentDetails.date;
      test.course = item.studentAssignment.course;
      test.branch = item.studentDetails.branch;
      test.questionString = item.studentDetails.questions;

      test.onlineId = item.studentAssignment.allBranchId;

      test.testdescription = item.studentAssignment.testDescription;
      test.assigned = item.assigned;
      test.testType = item.studentDetails.type;
      test.testUploadedType = item.studentDetails.testUploadedType;
      test.status = (item.assigned)?"Test Assigned":"Test Not Assigned";
      test.testDuration =  Number(item.studentDetails.totalTime);
      if(item.studentDetails.totalTime && item.studentDetails.totalTime.trim().match(/^[0-9]+$/)){
        test.timeFormat = TimeLibrary.convertSecondInToHourFormat( Number (item.studentDetails.totalTime));
      }else{
        test.timeFormat = "0";
      }
      this.allTests.push(test);
    }
    if(testList.length > 0){
      this.evenOddBackGroundColor();
    }
    let breakPoint = this.getMediaBreakPoint(this.media);
    this.mobileViewSearchCriteriaExpansion(breakPoint);
  }
  public http_OnFailureResponse(error:HttpErrorResponse):void{
    this.loaderActivate = false;
    let message:string = "";
    if(error.status == 0){
      message = AppConstant.NOCONNECT_RESPONSE;
    }else{
      message = error.message;
    }
    this.dialog.showAlert(message,{height:300,width:500},()=>{});
  }
  public searchTest():void {
    if(this.validaData()){
      this.loaderActivate = true;
      let classData = this.dataShare.ClassProfile;
      const data = {
        uniqueClassName: classData.uniqueClassName,
        username:classData.username,
        batch:this.academicYearControl.value,
        patternName:this.patternControl.value,
        className:this.standaredControl.value,
        testType:this.testTypeControl.value,
        subjectName:this.subjectControl.value
      };
      this.service.getGeneratedTest(data).subscribe({next:this.testResult_OnSuccessResponse.bind(this),error:this.http_OnFailureResponse.bind(this)});
    }
  }
  public responsiveScreen():void{
    let mainContainer:HTMLElement = <HTMLElement>document.querySelector(".main-container");
    if(mainContainer){
      mainContainer.style.height = window.innerHeight+"px";
    }
  }
  public getAllSubjects():void {
    this.patternControl.valueChanges.subscribe(pattern=>{
      this.allSubjects = pattern.subjects;
    });
  }
  public clickOnRecord(table:GeneratedTest):void {
    this.dialog.viewTestPdfFiles(
      ReprintTestDetailsComponent,
      this.dataShare.ClassProfile,
      table);
  }
  private validaData():boolean{
    return (
              this.patternControl.valid
              && this.standaredControl.valid
              && this.testTypeControl.valid
              && this.subjectControl.valid);
  }
}
