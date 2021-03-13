import { FunctionReffernceModel } from './../../website/model/function.refference.model';

import { SearchReffDataService } from 'src/app/website/utility-service/search.reff.data.service';
import { RefferenceModel } from './../../shared/services/reffdata.model.service';

import { GeneralUtility } from 'src/app/shared/utility/general-utility';
import { CreateAssignmentModel } from './../../website/model/student.assignmnet.database.model';
import { ClassProfile } from './../../shared/model/class-profile-model';
import { DataShareService } from './../../shared/services/data-share-service';
import { SearchEntity } from './../../students/shared/entity/search-entity';
import { Component, AfterViewInit, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { MediaObserver } from '@angular/flex-layout';
import { BranchNode, BranchControls } from 'src/app/website/model/branch.node';
import { StringUtility } from 'src/app/website/utility-service/string.utility';
import { DataService } from 'src/app/website/data-service/data.service';
import { AssignmentService } from 'src/app/website/utility-service/assignment.service';
import { StudentAssignmentDataBaseModel, TestBranchId } from 'src/app/website/model/student.assignmnet.database.model';
import { AssignmentAssignedDataModel } from './data-model/assignment.assignform.model';
import { AssignmentHttpService } from '../services/assignment.http.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { DialogService } from 'src/app/students/shared/services/dialog-service';
import { SearchTest } from 'src/app/students/analysis-search/search-test';

@Component({
  selector:'assignment-assign',
  templateUrl:'./assignment.assign.html',
  styleUrls:['./assignment.assign.css']
})
export class AssignmentAssignComponent implements OnInit , AfterViewInit{
  public criteriaSection:HTMLElement = null;
  public branchSection:HTMLElement   = null;
  public actionSection:HTMLElement   = null;
  public assignmentRoot:HTMLElement  = null;
  public dekstopSection:HTMLElement  = null;
  public descriptionBox:HTMLElement  = null;
  public questionPaperIds:string[]   = ['100','200','250','354'];
  public onlineExamIds:string[]      = ['12','452','365','410'];
  public batches:string[]            = ['Target 2020','Target 2021','Target 2022','Target 2023'];
  public isLoader:boolean = false;
  public classProfile:ClassProfile   = null;
  public functionRefModel:FunctionReffernceModel = <FunctionReffernceModel>{};
  public constructor(
    private media:MediaObserver ,
    private dataService:DataService,
    private assignmentService:AssignmentService,
    private http:AssignmentHttpService,
    private dialog:DialogService ,
    private admin:DataShareService,
    private reffData:SearchReffDataService){}
    ngAfterViewInit(){

    this.createUIDom();
    this.media.media$.subscribe(size=>{
      this.adjustScreen();
    });
  }
  public assignmentDataModel:AssignmentAssignedDataModel = <AssignmentAssignedDataModel>{};
  ngOnInit(){
    this.functionRefModel.validate = this.validate.bind(this);
    this.classProfile = this.admin.ClassProfile;
    this.decideTestData();  // this function decide assignment loading operation

    //this.createBranchTree(); // this is temporary create branch tree
    // this is temporarary data . actual data will be taken from @Input decorator
    // this is actual get branches from server
    // this.assignmentDataModel.duration = (60 * 3);
    // this.assignmentDataModel.onlineExamId = 2012;
    // this.assignmentDataModel.batch = "Target 2020";
    // this.assignmentDataModel.questionPaperId = "PPS12";
    // this.assignmentDataModel.patternName = "JEE";
    // this.assignmentDataModel.subjectName = "PCM";
    // this.assignmentDataModel.totalQuestion = 180;
    // this.assignmentDataModel.totalMarks = 320;
    // this.assignmentDataModel.description = "this is JEE examination for preparing to student for actual Examination Taken By JEE.";
    // this.assignmentDataModel.hourFormat = this.assignmentService.createHourFormatFromTotalMinutes(this.assignmentDataModel.duration);
  }
  private classCourses:string[] = []; // class courses
  public course_successHandler(response:HttpResponse<any>):void{
    this.isLoader = false;
    try {
      let body = response.body;
      if(body.result){
        this.classCourses = <string[]>body.data;
      }else{
        this.dialog.showAlert(body.message,{height:300,width:500});
      }
    } catch (error) {
      this.dialog.showAlert(error,{height:300,width:500});
    }
  }
  private getClassCourses(uniqueClassName:string,academicYear:string):void{
    this.isLoader = true;
     let data:SearchEntity = <SearchEntity>{};
     data.uniqueClassName = uniqueClassName;
     data.batch = academicYear;
     this.reffData.getClassCourses(data).subscribe(this.course_successHandler.bind(this),this.htt_FailureeHandler.bind(this));
  }


  private getBranchTreeNodes():void{
      this.isLoader = true;
      let param:SearchEntity = <SearchEntity>{};
      param.uniqueClassName = this.classProfile.uniqueClassName ; // "kosh edutech shrikrishna";
      this.http.getBranchTree(param).subscribe(this.branchTreeNode_SuccesHandler.bind(this),this.htt_FailureeHandler.bind(this));
  }

  // this is entry point


  private loadAssignmentJsonSuccessHandler(response:HttpResponse<any>):void{
      this.isLoader = false;
      let body = response.body;
      if(body.result){
        let json: string = body.data;
        this.assignmentJson = json;  // keep for load initial state
        let branches: BranchNode[] = JSON.parse(json);
        this.allBranches = branches;
      }else{
        this.dialog.showAlert(body.message,{height:300,width:500});
      }
  }
  public assignmentJson:string = null;
  private loadAssignmentJsonData():void{
    this.isLoader = true;
    let data:SearchEntity = <SearchEntity>{};
    data.uniqueClassName  = this.classProfile.uniqueClassName;
    data.batch            = this.assignmentDataModel.batch;
    data.course           = this.assignmentDataModel.course;
    data.testId           = this.assignmentDataModel.questionPaperId;
    let onlineId:string   = String(this.assignmentDataModel.onlineExamId);
    data.allBranchId      = String(GeneralUtility.getDefaultNumberValue (onlineId));
    this.http.getAssignmentJsonData(data).subscribe(this.loadAssignmentJsonSuccessHandler.bind(this),this.htt_FailureeHandler.bind(this));

  }
  private decideTestData():void{
    if(this.assignmentDataModel.doCreate){
      this.getClassCourses(this.classProfile.uniqueClassName,this.assignmentDataModel.batch);
      this.getBranchTreeNodes();
    }else{
      this.loadAssignmentJsonData();
    }
  }
  private branchTreeNode_SuccesHandler(response:HttpResponse<any>):void{
    this.isLoader = false;
    let data:any = response.body;

    if(data.result){
      let payLoad:BranchNode[] = <BranchNode[]>data.data;
      this.allBranches = payLoad;
      this.recursiveInitNode(this.allBranches);
      return;
    }
    this.dialog.showAlert(data.message,{height:300,width:500});
  }

  @Output("save")
  public save:EventEmitter<any> = new EventEmitter<any>(); // save event on component selector
  @Input("assignmentData")
  public set assignmentDataSetter(assignmentData:AssignmentAssignedDataModel){
      this.assignmentDataModel = assignmentData;
  }
  @Output("closeSelf")
  public closeSelf:EventEmitter<void> = new EventEmitter<void>();
  public allBranches:BranchNode[] = [];
  public createBranchTree():void{
    // let all:BranchNode            = <BranchNode>{};
    // let pune  :BranchNode         = <BranchNode>{};
    // let mumbai:BranchNode         = <BranchNode>{};
    // let nashik:BranchNode         = <BranchNode>{};
    // let aurangabad:BranchNode     = <BranchNode>{};
    // let pimpri:BranchNode         = <BranchNode>{};
    // let kothrud:BranchNode        = <BranchNode>{};
    // let bhusariColony:BranchNode  = <BranchNode>{};

    // all.name ="All";
    // all.children = [];
    // all.parentId = "-1";
    // all.id = "7";
    // all.showChangeOption = false;


    // all.doChange = true;
    // all.expandControls = true;
    // all.sameAsParent = false;

    // pune.children = [];
    // pune.name = "pune";
    // pune.id ="1";
    // pune.parentId = "7";

    // mumbai.children = [];
    // mumbai.name = "mumbai";
    // mumbai.id = "2";
    // mumbai.parentId = "7";

    // nashik.children = [];
    // nashik.name = "nashik";
    // nashik.id = "3";
    // nashik.parentId = "7";

    // aurangabad.children = [];
    // aurangabad.name = "aurangabad";
    // aurangabad.id = "4";
    // aurangabad.parentId = "7";

    // pimpri.name = "Pune A";
    // pimpri.children = [];
    // pimpri.id ="5";
    // pimpri.parentId = "1";

    // kothrud.name = "Pune B";
    // kothrud.children = [];
    // kothrud.id = "6";
    // kothrud.parentId = "1";

    // let puneA1:BranchNode = <BranchNode>{};
    // puneA1.name ="Pune A1";
    // puneA1.children = [];
    // puneA1.id = "8";
    // puneA1.parentId = "5";

    // let puneA2:BranchNode = <BranchNode>{};
    // puneA2.name ="Pune A2";
    // puneA2.children = [];
    // puneA2.id = "9";
    // puneA2.parentId = "5";
    // pimpri.children.push(puneA1);
    // pimpri.children.push(puneA2);
    // pune.children.push(pimpri);
    // pune.children.push(kothrud);

    // all.children.push(pune);
    // all.children.push(mumbai);
    // all.children.push(nashik);
    // all.children.push(aurangabad);
    // this.allBranches = [all];
    // this.recursiveInitNode(this.allBranches);
  }
  public recursiveInitNode(root:BranchNode[]){
    for(let branch of root){
      branch.height ="0px";
      branch.overflow = "hidden";
      branch.selected = true;
      branch.partialSelect = false;
      branch.doChange = false;
      branch.expand   = false;
      branch.isDirty  = false;
      branch.course = (this.classCourses.length == 1 ) ? [this.classCourses[0]]:[];
      branch.courses = this.classCourses;
      branch.assignmentDate      = new Date().toISOString();
      branch.availableTillDate   = new Date().toISOString();
      branch.solutionReleaseDate = new Date().toISOString();
      branch.autoSubmitTestDate  = new Date().toISOString();
      branch.controls = <BranchControls>{};
      branch.autoSubmitTestDuration  = this.dataService.autoSubmitOption[0];
      branch.solutionReleaseDuration = this.dataService.testReleaseDate[0];
      branch.availabaleTillDuration  = this.dataService.testAvailableTill[0];
      branch.type = this.dataService.testType[0];
      if(branch.parentId != "-1"){
        branch.showChangeOption = true;
      }else if(branch.parentId == "-1"){
        branch.doChange = true;
        branch.selected = true;
        branch.expandControls = true;
      }
      this.recursiveInitNode(branch.children);
    }
  }
  public delete_successHandler(response:HttpResponse<any>):void{
      this.isLoader = false;
      let body = response.body;
      if(body.result){
        this.assignmentDataModel.doCreate = true;
        this.decideTestData();
        this.save.emit();
        this.dialog.showAlert(body.message,{height:300,width:500});
      }else{
        this.dialog.showAlert(body.message,{height:300,width:500});
      }
  }
  public deleteAssignment():void{
    try{
      this.dialog.confirmDialog("Do You Really Want To Delete This Assignment Schedule ?",()=>{
        let data:CreateAssignmentModel = <CreateAssignmentModel>{};
        data.uniqueClassName = this.classProfile.uniqueClassName;
        data.allBranchId     = String(this.assignmentDataModel.onlineExamId);
        data.testId          = this.assignmentDataModel.questionPaperId;
        data.batch           = this.assignmentDataModel.batch;
        this.isLoader = true;
        this.http.deleteAssignment(data).subscribe(this.delete_successHandler.bind(this),this.htt_FailureeHandler.bind(this));
      });
    }catch(e){
      this.dialog.showAlert(e,{height:300,width:500});
    }
  }
  public closeCurrentForm():void{
   // this.dialog.showAlert("Form Is Closed.",{height:300,width:500});
   this.closeSelf.emit();
  }
  public resetData():void{
    this.allBranches.forEach((branch,index)=>{});
  }
  public createUIDom():void{
    try{
      this.assignmentRoot  = <HTMLElement> document.querySelector(".assignment-root");
      this.criteriaSection = <HTMLElement> document.querySelector(".criteria-section");
      this.branchSection   = <HTMLElement> document.querySelector(".branch-section");
      this.actionSection   = <HTMLElement> document.querySelector(".action-section");
      this.dekstopSection  = <HTMLElement> document.querySelector(".desktop-section");
      this.descriptionBox  = <HTMLElement> document.querySelector(".description-box");
    }catch(ex){
      alert(ex);
    }
  }
  public adjustScreen():void{
    if(!this.isFrameDomExist()){
      return;
    }
    if(this.media.isActive("xs")){
      this.extraSmallDevice();
    }else if(this.media.isActive("sm") || this.media.isActive("md")){
      this.mobileAndTabView();
    }else{
      this.dekstopView();
    }
  }
   public setSize(criteriaSize:number ,actionSize:number):void{
    let extra:number = 3;
    let totalScreenHeight:number      = window.innerHeight;
    this.assignmentRoot.style.height  = (totalScreenHeight + "px");
    this.criteriaSection.style.height = ( criteriaSize + "px");
    this.criteriaSection.style.boxSizing = "border-box";
    this.actionSection.style.height   = ( actionSize   + "px");
    this.actionSection.style.boxSizing = "border-box";
    let branchSize:number = (totalScreenHeight - (criteriaSize + actionSize + extra));
    this.branchSection.style.height = (branchSize + "px");
    this.branchSection.style.boxSizing = "border-box";
  }
  public extraSmallDevice():void{
    this.commonSetting();
    this.descriptionBox.style.maxHeight = "100px";
  }
  public mobileAndTabView():void{
      this.commonSetting();
      this.descriptionBox.style.maxHeight = "100px";
  }
  public commonSetting():void{
    this.criteriaSection.style.height = "auto";
    this.branchSection.style.height   = "auto";
    this.actionSection.style.height   = "auto";
    this.assignmentRoot.style.height  = "auto";
    this.dekstopSection.classList.remove("desktop-view");
    this.dekstopSection.classList.add("mobile-view");
  }
  public dekstopView():void{
    this.setSize(120,70);
    this.dekstopSection.classList.add("desktop-view");
    this.dekstopSection.classList.remove("mobile-view");
  }
  public isFrameDomExist():boolean{
    return ( this.dekstopSection != null
      || this.assignmentRoot != null
      && this.criteriaSection != null
      && this.branchSection != null
      && this.actionSection != null);
  }
  public slelectedBranchName:string = "selected branch is : ";
  public checkSelectedBranch(branches:BranchNode[]):string{
    branches.forEach((branch,index)=>{
      if(branch.selected){
        if(index == 0){
          this.slelectedBranchName = this.slelectedBranchName.concat(branch.name);
        }else{
          this.slelectedBranchName = this.slelectedBranchName.concat(", ").concat(branch.name);
        }
      }
      this.validate(branch.children);
    });
    return this.slelectedBranchName;
  }
  private prepareForTestBranchIdData(testBranchId:TestBranchId[] , branchNode:BranchNode[]):TestBranchId[]{
    for(let node of branchNode){
      if(node.selected){
        if(node.id !="0"){
          let branchIdRecord:TestBranchId =<TestBranchId> {};
          branchIdRecord.academicYear = this.assignmentDataModel.batch;
          branchIdRecord.branch       = "datta";
          branchIdRecord.branchID     = "12";
          branchIdRecord.id           = this.assignmentDataModel.questionPaperId;
          branchIdRecord.uniqueclassname = this.classProfile.uniqueClassName;
          branchIdRecord.batchMasterId   = node.id;
          branchIdRecord.childId    = "12";
          branchIdRecord.course     = this.assignmentDataModel.course;
          testBranchId.push(branchIdRecord);
        }
        if(node.children.length > 0 ){
          this.prepareForTestBranchIdData(testBranchId,node.children);
        }
      }
    }
    return testBranchId ;
  }
  private saveCreatedTest(createTest:CreateAssignmentModel):void{
    this.http.saveBulkAssignment(createTest).subscribe(this.saveBulkAssignment_SuccessHandler.bind(this),this.htt_FailureeHandler.bind(this));
  }
  private saveUpdatedTest(createTest:CreateAssignmentModel):void{
    this.http.updateAssignment(createTest).subscribe(this.updateAssignmentSuccessHandler.bind(this),this.htt_FailureeHandler.bind(this));
  }
  public updateAssignmentSuccessHandler(response:HttpResponse<any>):void{
    this.isLoader = false;
    let payLoad = response.body;
    if(payLoad.result){
      this.dialog.showAlert(payLoad.message,{height:300,width:500});
      this.save.emit();
    }else{
      this.dialog.showAlert(payLoad.message,{height:300,width:500});
    }
  }
  public saveTest():void{
    this.allSelectedTest = [];
    this.validate(this.allBranches);
    let everyThingIsFine:boolean = this.displayErrorBranch(this.allBranches);
    if(everyThingIsFine){
      let jsonString:string = JSON.stringify(this.allBranches);
      let testBranch:TestBranchId[] =new Array<TestBranchId>();
      let testBranches:TestBranchId [] = this.prepareForTestBranchIdData(testBranch , this.allBranches);
      this.copyAllParentDataToAllChild(this.allBranches[0]);
      this.selectRecords(this.allBranches[0]);
      let assignmentData:StudentAssignmentDataBaseModel[] = this.createAssignmnetDatabaseRecords(this.allSelectedTest);
      if(assignmentData.length == 0){
        this.dialog.showAlert("Assign At Least One Assignmentg. Current Assigned Assignment Count Is 0 .",{height:200,width:500});
        return;
      }
      let createTest:CreateAssignmentModel = <CreateAssignmentModel>{};
      createTest.testBranches    = testBranches;
      createTest.assignments     = assignmentData;
      createTest.testCreatedJSON = jsonString;
      createTest.uniqueClassName = this.classProfile.uniqueClassName;
      createTest.testId          = this.assignmentDataModel.questionPaperId; // test id
      createTest.allBranchId     = String(this.assignmentDataModel.onlineExamId); // all branch id
      createTest.batch           = this.assignmentDataModel.batch;
      this.isLoader = true;
      if(this.assignmentDataModel.doCreate){
        createTest.scheduleUpdate = false;
        this.saveCreatedTest(createTest);
      }else{
        createTest.scheduleUpdate = true;
        this.saveUpdatedTest(createTest);
      }
    }
  }
  public reset():void{
    this.decideTestData();
  }
  public saveBulkAssignment_SuccessHandler(response:HttpResponse<any>):void{
      this.isLoader = false;
      let responseBody = response.body;
      this.save.emit(); // reload assignment
      this.dialog.showAlert(responseBody.message,{height:200,width:500});
   }
   public htt_FailureeHandler(error:HttpErrorResponse):void{
      this.isLoader = false;
      let message = "";
      if(error.status == 0){
        message = AppConstant.NOCONNECT_RESPONSE;
      }else{
        message = error.message;
      }
      this.dialog.showAlert(message,{height:300,width:500});
   }
   public validate(branches:BranchNode[]):boolean{
    if(branches == null
      || branches == undefined
      || !Array.isArray(branches)
      || branches.length == 0){
        return false;
      }
    for(let branch of branches){
      if(branch.partialSelect  && branch.doChange == true){
        this.assignmentService. isValidCourse(branch);
        this.assignmentService. isValidTestType(branch);
        this.assignmentService. isValidTestDate(branch);
        this.assignmentService. isValidTestDateTimeFormat(branch);
        this.assignmentService. isValidTestAutoSubmitTimeFormat(branch);
        this.assignmentService. isValidAvailableTillHourFormat(branch);
        this.assignmentService. isValidSolutionReleaseHourFormat(branch);
        branch.isValidBranch = ( branch.controls.isValidCourse
                              && branch.controls.isValidTestType
                              && branch.controls.isValidTestTime
                              && branch.controls.isValidTestAutoSubmitTime
                              && branch.controls.isValidAvailableTillTime
                              && branch.controls.isValidSolutionReleaseTime);
        return false;
      }
      if(branch.selected  && branch.doChange == true){
        this.assignmentService. isValidCourse(branch);
        this.assignmentService. isValidTestType(branch);
        this.assignmentService. isValidTestDate(branch);
        this.assignmentService. isValidTestDateTimeFormat(branch);
        this.assignmentService. isValidTestAutoSubmitTimeFormat(branch);
        this.assignmentService. isValidAvailableTillHourFormat(branch);
        this.assignmentService. isValidSolutionReleaseHourFormat(branch);
        branch.isValidBranch = ( branch.controls.isValidCourse
                              && branch.controls.isValidTestType
                              && branch.controls.isValidTestTime
                              && branch.controls.isValidTestAutoSubmitTime
                              && branch.controls.isValidAvailableTillTime
                              && branch.controls.isValidSolutionReleaseTime);
      }
      this.validate(branch.children);
    }
    return true;
  }
  public copyAllParentDataToAllChild(parent:BranchNode):void{
    if(parent.partialSelect && parent.parentId == "-1"){ //changes
      for(let child of parent.children){
        if(child.doChange == false){
          this.assignmentService.copyParentDataToChild(parent,child);
        }
      }
    }
    if(parent.selected && parent.doChange){
      for(let child of parent.children){
        if(child.doChange == false){
          this.assignmentService.copyParentDataToChild(parent,child);
        }
        this.copyAllParentDataToAllChild(child);
      }
    }else if(parent.doChange && parent.parentId != "-1"){
        for(let child of parent.children){
          if(child.doChange == false){
            this.assignmentService.copyParentDataToChild(parent,child);
          }
          this.copyAllParentDataToAllChild(child);
        }
      }else{
        let root = parent;
        while((root = this.assignmentService.getBranchById(root,this.allBranches))!= null){
            if(root.doChange){
              break;
            }
        }
        for(let child of parent.children){
          if(child.selected){
            if(child.doChange == false){
              if(root != null){
                this.assignmentService.copyParentDataToChild(root,child);
              }
            }
          }
          this.copyAllParentDataToAllChild(child);
      }
    }
  }
  public isDochange(parent:BranchNode):boolean{
    for(let child of parent.children){
      if(child.doChange){
        return true;
      }
      this.isDochange(child);
    }
    return false;
  }
  public selectRecords(branch:BranchNode){
    if(branch.selected && (!this.isDochange(branch))){
        this.allSelectedTest.push(branch);
      }else if(branch.selected && branch.doChange && !this.isDochange(branch)){
        this.allSelectedTest.push(branch);
      }else{
        for(let child of branch.children){
          this.selectRecords(child);
        }
      }
  }
public displayErrorBranch(branches:BranchNode[]):boolean{
    let isValid:boolean = true;
    for(let branch of branches){
      if((branch.selected || branch.partialSelect) && !branch.isValidBranch && branch.doChange){
         this.assignmentService.shrinkAllControls(branches);
         branch.expandControls = true;
         return branch.isValidBranch;
      }
      isValid = this.displayErrorBranch(branch.children);
      if(isValid == false){
        return false;
      }
    }
    return isValid;
  }
  public allSelectedTest:BranchNode[] = [];

  // this code working successfully for retriing selected assignments
  public createAassignmentRecordForSave(branches:BranchNode[]):void{
    for(let branch of branches){
      if(branch.parentId == "-1" && branch.selected && branch.doChange){
        this.allSelectedTest.push(branch);
        return;
      }
      if(branch.selected){
        if(branch.doChange){
          this.allSelectedTest.push(branch);
          return;
        }else{
          let parent:BranchNode = branch;
          while((parent = this.assignmentService.getBranchById(parent,this.allBranches) ) != null){
              if(parent.doChange){
                this.assignmentService.copyParentDataToChild(parent,branch);
                this.allSelectedTest.push(branch);
                break;
              }
          }
        }
      }else{
        this.createAassignmentRecordForSave(branch.children);
      }
    }
  }
  public getAllSelectedNodes(branches:BranchNode[]):BranchNode[]{ // collect all child id
    return null;
  }
  public createAssignmnetDatabaseRecords(allSelectedTest:BranchNode[]):StudentAssignmentDataBaseModel[]{
    let assArray:StudentAssignmentDataBaseModel[] = [];
    if(StringUtility.isEmpty(allSelectedTest)){
      return assArray;
    }
    allSelectedTest.forEach(branch=>{
      for(let c of branch.course){
        let assignment:StudentAssignmentDataBaseModel = <StudentAssignmentDataBaseModel>{};
        assignment.testId          = Number(this.assignmentDataModel.questionPaperId);
        assignment.allBranchId     = String(this.assignmentDataModel.onlineExamId);
        assignment.batchMasterId   = Number(branch.id);
        assignment.batch           = this.assignmentDataModel.batch;
        assignment.patternName     = this.assignmentDataModel.patternName;
        assignment.subjectName     = this.assignmentDataModel.subjectName;
        assignment.testDescription = this.assignmentDataModel.description;
        assignment.branch          = branch.name;
        assignment.course = c;
        assignment.assignmentType = branch.type;
        assignment.assignmentDate = StringUtility.createDataBaseDateByDateString(branch.assignmentDate);
        assignment.assignmentTime = StringUtility.createAssignmentDataBaseTime(branch.assignmentTime);
        assignment.availableTillDuration = branch.availabaleTillDuration;
        assignment.division    =  branch.name ;
        assignment.availableTillDate = StringUtility.createDataBaseDateByDateString(branch.availableTillDate);
        assignment.availableTillTime = StringUtility.createAssignmentDataBaseTime(branch.availableTillTime);
        assignment.solutionReleaseDuration = branch.solutionReleaseDuration;
        assignment.solutionDate = StringUtility.createDataBaseDateByDateString(branch.solutionReleaseDate);
        assignment.solutionTime = StringUtility.createAssignmentDataBaseTime(branch.solutionReleaseTime);
        assignment.testAutoSubmitDate = StringUtility.createDataBaseDateByDateString(branch.autoSubmitTestDate);
        assignment.testAutoSubmitDuration = branch.autoSubmitTestDuration;
        assignment.testAutoSubmitTime = StringUtility.createAssignmentDataBaseTime(branch.autoSubmitTestTime);
        assignment.isShuffle = branch.isShuffle;
        assignment.isReAttempt = branch.isReAttempt;
        assignment.uniqueClassName = this.admin.ClassProfile.uniqueClassName;
        assArray.push(assignment);
      }
    });

    return assArray;
  }
  public validateControlData(branch:BranchNode):boolean{
      return false;
  }
  public isEmptyArray(array:any):boolean{
    return (array == null || array == undefined || !Array.isArray(array) || array.length == 0);
  }
}
