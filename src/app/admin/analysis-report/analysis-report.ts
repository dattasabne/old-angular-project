import { ResponseModel } from './../../website/model/response.model';
import { AppConstant } from './../../shared/app-constant/app-constatnt';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  ChangeDetectorRef
} from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { FormControl } from "@angular/forms";
import { AnalysisService } from "./analysis-report.service";
import { GeneralUtility } from "../../shared/utility/general-utility";
import { ExcelService } from "../../shared/excel-service/excel-service";
import { DateTimePipe } from "../indivisual-report/date-time.pipe";
import { DialogService } from "../../shared/services/dialog.service";
import { HttpErrorResponse, HttpResponse} from "@angular/common/http";
import { ClassTemplates } from "../setting/messaging-settings/class_templates";
import { TemplateService } from "src/app/shared/services/template-service";
import { StudentDetails } from "../entity/student-details";
import { FireBaseEntity } from "../firebase/entity/firebase-entity";
import { Data } from "../firebase/entity/data-entity";
import { FireBaseService } from "../firebase/firebase-service";

@Component({
  selector: "common-analysys-report",
  templateUrl: "./analysis-report.html",
  styleUrls: ["./analysis-report.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [DateTimePipe]
})
export class CommonAnalysisReportComponent implements OnInit {
  private readonly all: string;
  public batches: Array<any> = null;
  public courses: Array<any> = null;
  public branches: Array<any> = null;
  public divisions: Array<any> = null;
  public subDivisions: Array<any> = null;
  public students: Array<any> = null;
  public searchName: string;
  public examDates: Array<any> = null;
  public testIds: Array<any> = null;
  public assignmentTypes: Array<any> = null;

  public batchControl: FormControl = null;
  public courseControl: FormControl = null;
  public branchControl: FormControl = null;
  public divisionControl: FormControl = null;
  public assignmentTypeControl: FormControl = null;
  public assignmentDateControl: FormControl = null;
  public assignmentIdControl: FormControl = null;

  public subDivisionControl = null;
  public examDatesControl: FormControl = null;
  public allsearchedCriterialData: Array<any> = new Array<any>();

  public dateList: Array<any> = new Array<any>();
  public testTypeList: Array<any> = new Array<any>();
  public testIdList: Array<any> = new Array<any>();

  public isLoaded: boolean = false;
  public isDateCriteriaLoader = false;
  public radioControl: FormControl = new FormControl("attempted", []);
  public radioOption = {
    attempted: "attempted",
    notAttempted: "not-attempted"
  };
  public displayResult: boolean = false;

  public constructor(
    private http: AnalysisService,
    private change: ChangeDetectorRef,
    private xl: ExcelService,
    private dateTime: DateTimePipe,
    private dialog: DialogService,
    private template: TemplateService,
    private firebase: FireBaseService
  ) {
    this.all = "ALL";
  }
  public get ALL(): string {
    return this.all;
  }
  // this function will called on pagination
  public emit(e: PageEvent): void {}
  public sendFireBaseNotification(): void {
    this.dialog.sendFireBaseNotification(
      this.sendNotificationToFireBase.bind(this)
    );
  }
  public fireBaseEntity: Array<FireBaseEntity> = null;
  public sendNotificationToFireBase(template: ClassTemplates): void {
    this.fireBaseEntity = new Array<FireBaseEntity>();
    this.uniqueSolvedAssignmentRecords.forEach((item, index) => {
      let studentDetails: StudentDetails = this.template.initStudentDataForTemplate(
        item
      );
      const templateText = template.templateText;
      const templateKeys = JSON.parse(template.templateKeys);
      const message = this.template.getStudentMessage(
        templateText,
        templateKeys,
        studentDetails
      );
      item.messages = message;
      if (item.authentication.cloudKey && item.authentication.cloudKey.trim()) {
        let fireBaseData: FireBaseEntity = <FireBaseEntity>{};
        fireBaseData.id = item.id;
        fireBaseData.mobileNo = item.studentInfo.mobileNo;
        fireBaseData.password = item.studentInfo.password;
        fireBaseData.studentName = item.studentInfo.studentName;
        fireBaseData.userName = item.studentInfo.userName;
        fireBaseData.to = item.authentication.cloudKey;
        fireBaseData.data = <Data>{};
        fireBaseData.data.assignmentDate = item.date;
        fireBaseData.data.batch = item.academicYear;
        fireBaseData.data.branch = item.branch;
        fireBaseData.data.course = item.course;
        fireBaseData.data.division = item.studentInfo.division;
        fireBaseData.data.id = item.id;
        fireBaseData.data.message = message;
        fireBaseData.data.subdivision = item.studentInfo.subDivision;
        fireBaseData.data.title = item.uniqueClassName + " Exam Result.";
        this.fireBaseEntity.push(fireBaseData);
      }
    });

    this.dialog.displayPreparedMessage(
      this.uniqueSolvedAssignmentRecords,
      this.displayPreparedMessage.bind(this)
    );
  }
  private sendFirebaseNotification_SuccessHandler(response:HttpResponse<ResponseModel>):void{
    let responseModel:ResponseModel = response.body;
    this.isLoaded = false;
    this.dialog.displayFireBaseResponse(responseModel.data);
  }
  public displayPreparedMessage(): void {
    if (this.fireBaseEntity && this.fireBaseEntity.length > 0) {
      this.isLoaded = true;
      this.firebase.sendFireBaseNotification(this.fireBaseEntity).subscribe({next:this.sendFirebaseNotification_SuccessHandler.bind(this),error: this.httpFailure_Handler.bind(this)});
    } else {
      this.dialog.showAlert("Your Notification Data Has Been Lost Please Regenerate Notification.");
    }
  }
  private logOut_SuccessHandler(response:HttpResponse<ResponseModel>):void{
    this.isLoaded = false;
  }
  public logout(): void {
    this.http.logout().subscribe({next:this.logOut_SuccessHandler.bind(this),error:this.httpFailure_Handler.bind(this)});
  }
   private initializeReactiveFormControls(): void {
    this.batchControl = new FormControl(this.ALL, []);
    this.courseControl = new FormControl(this.ALL, []);
    this.branchControl = new FormControl(this.ALL, []);
    this.divisionControl = new FormControl(this.ALL, []);
    this.subDivisionControl = new FormControl(this.ALL, []);
    this.examDatesControl = new FormControl(this.ALL, []);
    this.assignmentDateControl = new FormControl(this.ALL, []);
    this.assignmentTypeControl = new FormControl(this.ALL, []);
    this.assignmentIdControl = new FormControl(this.ALL, []);
  }
  private getCriteria_SuccessHandler(response:HttpResponse<ResponseModel>):void{
    let responseModel:ResponseModel = response.body;
    this.isLoaded = false;
    this.batches = responseModel.data.batch;
    this.courses = responseModel.data.course;
    this.branches = responseModel.data.branch;
  }
  public getCriteria(): void {
    this.http.getCriteria().subscribe({next:this.getCriteria_SuccessHandler.bind(this),error:this.httpFailure_Handler.bind(this)});
  }
  public getSearchDivision(): void {
    const data = {
      batch: GeneralUtility.getValueFilter(this.batchControl.value, "name"),
      course: GeneralUtility.getValueFilter(this.courseControl.value, "name"),
      branch: GeneralUtility.getValueFilter(this.branchControl.value, "name")
    };

    this.http.getDivisionBySearch(data).subscribe(
      (res:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = res.body;
        this.divisions = responseModel.data.division;
        this.change.detectChanges();
      },
      err => {
        this.dialog.showAlert(err.error.message);
      }
    );
  }
  public searchSubDivision(): void {
    const data = {
      batch: GeneralUtility.getValueFilter(this.batchControl.value, "name"),
      course: GeneralUtility.getValueFilter(this.courseControl.value, "name"),
      branch: GeneralUtility.getValueFilter(this.branchControl.value, "name"),
      division: GeneralUtility.getValueFilter(
        this.divisionControl.value,
        "name"
      )
    };

    this.http.getSubDivisionBySearch(data).subscribe(
      (res:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = res.body;
        this.subDivisions = responseModel.data.subDivision;
        this.change.detectChanges();
      },
      err => {
        this.dialog.showAlert(err.error.message);
      }
    );
  }

  public searchCriteria(): void {
    this.displayResult = false;
    this.isDateCriteriaLoader = true;
    const data = {
      batch: GeneralUtility.getValueFilter(this.batchControl.value, "name"),
      course: GeneralUtility.getValueFilter(this.courseControl.value, "name"),
      branch: GeneralUtility.getValueFilter(this.branchControl.value, "name"),
      division: GeneralUtility.getValueFilter(
        this.divisionControl.value,
        "name"
      ),
      subDivision: GeneralUtility.getValueFilter(
        this.subDivisionControl.value,
        "name"
      )
    };
    this.http.searchAsigment(data).subscribe(
      (res:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = res.body;
        this.allsearchedCriterialData = responseModel.data.searchAssignment as Array<any>;
        this.dateList = this.getUniqueRecords(
          this.allsearchedCriterialData,
          "assignmentDate"
        );
        this.isDateCriteriaLoader = false;
      },
      err => {
        this.isDateCriteriaLoader = false;
        this.dialog.showAlert(err.error.message);
      }
    );
  }
  uniqueSolvedAssignmentRecords: Array<any> = new Array<any>();
  solvedAssignemntTotalRecords: Array<any> = new Array<any>();
  notAttemptedRecords: Array<any> = new Array<any>();

  public getTestNotAttempted(): void {
    const data = {
      batch: GeneralUtility.getValueFilter(this.batchControl.value, "name"),
      course: GeneralUtility.getValueFilter(this.courseControl.value, "name"),
      branch: GeneralUtility.getValueFilter(this.branchControl.value, "name"),
      division: GeneralUtility.getValueFilter(
        this.divisionControl.value,
        "name"
      ),
      subDivision: GeneralUtility.getValueFilter(
        this.subDivisionControl.value,
        "name"
      ),
      testId: GeneralUtility.getValueFilter(this.assignmentIdControl.value,"testId"),
      assignmentDate:GeneralUtility.getValueFilter(this.examDatesControl.value,"assignmentDate")
    };
    // if(data.testId.trim().toUpperCase()=='all'.trim().toUpperCase()){
    //   this.dialog.showAlert("Please Select Test Id.");
    //   return;
    // }
    this.isLoaded = true;
    this.http.getTestNotAttempted(data).subscribe(
      (res:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = res.body;
        this.notAttemptedRecords = responseModel.data.data;
        this.isLoaded = false;
      },
      (err: HttpErrorResponse) => {
        this.dialog.showAlert(err.error.message);
        console.log(err);
        this.isLoaded = false;
      }
    );
  }
  public previousRecord:HTMLElement = null;
  public highlight(ev:Event):void{
    let node:HTMLElement =<HTMLElement> ev.target;
    let parent:HTMLElement = node.parentElement;
    if(parent.style.background=='skyblue'){
      parent.style.background = "none";
    }else{
      parent.style.background = "skyblue";
    }
  }
  public updateRanks(): void {
    const data = {
      batch: GeneralUtility.getValueFilter(this.batchControl.value, "name"),
      course: GeneralUtility.getValueFilter(this.courseControl.value, "name"),
      branch: GeneralUtility.getValueFilter(this.branchControl.value, "name"),
      division: GeneralUtility.getValueFilter(
        this.divisionControl.value,
        "name"
      ),
      subDivision: GeneralUtility.getValueFilter(
        this.subDivisionControl.value,
        "name"
      ),
      testId:GeneralUtility.getValueFilter(this.assignmentIdControl.value,"testId")
    };
    this.isLoaded = true;
    this.http.updateRanks(data).subscribe({next:this.updateRank_SuccessHandler.bind(this),error:this.httpFailure_Handler.bind(this)});
  }

  private updateRank_SuccessHandler(response:HttpResponse<ResponseModel>):void{
    let responseModel:ResponseModel = response.body;
    this.isLoaded = false;
    this.searchAssignmentStudentDetaild();
    this.dialog.showAlert(responseModel.message);
  }
  public searchAssignmentStudentDetaild(): void {
    let data = {
      batch: GeneralUtility.getValueFilter(this.batchControl.value, "name"),
      course: GeneralUtility.getValueFilter(this.courseControl.value, "name"),
      branch: GeneralUtility.getValueFilter(this.branchControl.value, "name"),
      division: GeneralUtility.getValueFilter(
        this.divisionControl.value,
        "name"
      ),
      subDivision: GeneralUtility.getValueFilter(
        this.subDivisionControl.value,
        "name"
      ),
      assignmentDate: GeneralUtility.getValueFilter(
        this.examDatesControl.value,
        "assignmentDate"
      ),
      assignmentType: GeneralUtility.getValueFilter(
        this.assignmentTypeControl.value,
        "assignmentType"
      ),
      assignmentId: GeneralUtility.getValueFilter(this.assignmentIdControl.value,"testId")
    };
    if (
      this.radioControl.value.toUpperCase().trim() !=
      this.radioOption.attempted.toUpperCase().trim()
    ) {
      this.getTestNotAttempted();
      return;
    }
    this.isLoaded = true;
    this.http.searchAssignmentStudentDetaild(data).subscribe({next:this.searchAssignment_SuccessHandler.bind(this) ,error: this.httpFailure_Handler.bind(this)});
  }
  private httpFailure_Handler(error:HttpErrorResponse){
    this.isLoaded = false;
    if(error.status == 0){
      this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE);
    }else{
      this.dialog.showAlert(error.error.message);
    }
  }
  private searchAssignment_SuccessHandler(response:HttpResponse<ResponseModel>):void{
      let responseModel:ResponseModel = response.body;
      this.isLoaded = false;
      this.displayResult = true;
      this.solvedAssignemntTotalRecords = responseModel.data.solvedAssignment;
      this.uniqueSolvedAssignmentRecords = this.generateUniqueRecords(
        this.solvedAssignemntTotalRecords
      );
      this.perpareAssignmentForDisplay();
  }
  public sortByDate(array:Array<any>):void{
    array.sort(function(obj1,obj2){
      let date1:any = new Date(obj1.date);
      let date2:any = new Date(obj2.date);
      return (date1 - date2);
    });
  }
  public displayRecordiv(): boolean {
    let flag = false;
    switch (this.radioControl.value) {
      case this.radioOption.attempted:
        flag = this.allRecords.length > 0;
        break;
      case this.radioOption.notAttempted:
        flag = this.notAttemptedRecords.length > 0;
        break;
    }
    return flag;
  }
  public allTestIds:Array<string> = new Array<string>();
  public createUniqueTestIds(dataSource):Array<string>{
    let set:Set<string> = new Set<string>();
    dataSource.forEach(test=>{
          set.add(test.testId);
    });
    let data = Array.from(set);
    data .sort(function(a:string,b:string){
      return (Number(b) - Number(a));
    });
    return data;
  }


  private getUniqueRecords(array: Array<any>, key: string): Array<any> {
    let record = new Array<any>();
    array.forEach(item => {
      if (item[key] && item[key].trim() && record.indexOf(item[key]) == -1) {
        record.push(item[key]);
      }
    });
    return record;
  }
  allRecords: Array<any> = new Array<any>();
  tableHeader: any = {};
  public createSubjectShortCuts(array: any): string {
    let name: string = "";
    if (array.length == 1) {
      return array[0].name;
    }
    array.forEach((item, index) => {
      if (index == 0) {
        name = name.concat(item.name.charAt(0));
      } else {
        name = name.concat(" / ").concat(item.name.charAt(0));
      }
    });
    return name;
  }

  private isDuplicateStage1Record(array, item): boolean {
    for (let i = 0; i < array.length; i++) {
      if (
        array[i].userName == item.userName &&
        array[i].id == item.id &&
        array[i].date == item.date &&
        array[i].stage == item.stage
      ) {
        return true;
      }
      return false;
    }
  }

  private generateUniqueRecords(array): Array<any> {
    let uniqueRecord = new Array<any>();
    array.forEach((item, index) => {
      if (
        item.stage == 1 &&
        !this.isDuplicateStage1Record(uniqueRecord, item)
      ) {
        uniqueRecord.push(item);
      }
    });
    return uniqueRecord;
  }

  public getSubjectTotalMarks(userName:string , subjectName:string):number{
    let sum = 0;
    const marksRecord = this.solvedAssignemntTotalRecords.filter(item => item.subName.trim().toUpperCase() === subjectName.trim().toUpperCase() && userName.trim().toUpperCase() === item.studentInfo.userName.trim().toUpperCase());
    marksRecord.forEach(item => {
      sum += Number(item.totalMarks);
    });
    return sum;
  }


  private checkHowManysSubjectInTest(source): Array<any> {

 
    console.log(source);

    let subjects = new Array<any>();
    source.forEach(item => {
      if (
        (item.stage == 2 || item.stage == 1) &&
        item.subName &&
        item.subName.trim().toUpperCase() != "pcm".trim().toUpperCase() &&
        item.subName &&
        item.subName.toUpperCase().trim() != "pcb".toUpperCase() &&
        !GeneralUtility.isDuplicateObject(subjects, "name", item.subName)
      ) {
        subjects.push({
          name: item.subName,
          correctQuestion: "Correct Question",
          wrongQuestion: "Wrong Question",
          marks:'Marks'
        });
      }
    });

    return subjects;
  }
  private getTestSubject(source, data): Array<any> {
    let subjects = new Array<any>();
    source.forEach(item => {
      if (
        item.id == data.id &&
        item.userName == data.userName &&
        item.date == data.date &&
        item.subName &&
        item.date == data.date &&
        (item.stage == 1 || item.stage == 2) &&
        item.subName.trim().toUpperCase() != "pcm".trim().toUpperCase() &&
        !GeneralUtility.isDuplicateObject(subjects, "name", item.subName) &&
        item.subName.toUpperCase().trim() != "pcm".trim().toUpperCase()
      ) {
        subjects.push({
          name: item.subName,
          correctQuestion: item.rightQuestion,
          wrongQuestion: item.wrongQuestion,
          totalQuestion:item.totalQuestion
        });
      }
    });
    return subjects;
  }

  private createSubjectHeader(source: Array<any>): Array<any> {
    let subjects = new Array<any>();
    source.forEach(item => {
      subjects.push({
        name: item.name,
        correctQuestion: "Total correct Question",
        wrongQuestion: "Total Wrong Question"
      });
    });
    return subjects;
  }
  public export_to_excel_not_attempted(): void {
    if (this.notAttemptedRecords && this.notAttemptedRecords.length > 0) {
      const rows: Array<Array<any>> = new Array<Array<any>>();
      let colums: Array<any> = new Array<any>();
      colums.push("Sr.No.");
      colums.push("Student Id");
      colums.push("Student Name");
      colums.push("User Name");
      colums.push("Password");
      colums.push("Mobile No.");
      colums.push("Email Id");
      colums.push("Batch");
      colums.push("Course");
      colums.push("Branch");
      colums.push("Division");
      colums.push("Sub-Division");
      rows.push(colums);
      this.notAttemptedRecords.forEach((item, index) => {
        colums = new Array<any>();
        colums.push(index + 1);
        colums.push(item.studentId);
        colums.push(item.studentName);
        colums.push(item.userName);
        colums.push(item.password);
        colums.push(item.mobileNo);
        colums.push(item.emailId);
        colums.push(item.batch);
        colums.push(item.course);
        colums.push(item.branch);
        colums.push(item.division);
        colums.push(item.subDivision);
        rows.push(colums);
      });
      this.xl.exportToExcel(rows, "Not-Solved-Report");
    } else {
      this.dialog.showAlert("Please Search Data First.");
    }
  }
  public export_to_excel(): void {
    switch (this.radioControl.value) {
      case this.radioOption.attempted:
        this.export_to_excel_attempted();
        break;
      case this.radioOption.notAttempted:
        this.export_to_excel_not_attempted();
        break;
    }
  }

  public  getSubjectCount(dataSource:Array<any>,subjectName:string):number {
    let count:number = 0;
    subjectName = (subjectName && subjectName.trim().length !=0 )? subjectName.trim():'';
    subjectName = subjectName.toUpperCase();
    dataSource.forEach(record =>{
        let subName:string = (record.subName && record.subName.trim().length != 0)?record.subName.trim():'';
        subName = subName.toUpperCase();
        if(subName == subjectName){
          count++;
        }
    });
    return count;
  }


  public export_to_excel_attempted(): void {
    if (this.allRecords && this.allRecords.length > 0) {
      const rows: Array<Array<any>> = new Array<Array<any>>();
      let colums: Array<any> = new Array<any>();
      colums.push("Sr.No.");
      colums.push("Student Name");
      colums.push("User Name");
      colums.push("Password");
      colums.push("Mobile No.");
      colums.push("Solved Date & Time");
      this.tableHeader.forExcel.forEach(item => {
        colums.push(item.name.concat(" Correct Question"));
        colums.push(item.name.concat(" Wrong Question"));
        colums.push(item.name.concat(" Total Question"));
      });
      colums.push("Total Percentage");

      colums.push("Total Positive Marks");
      colums.push("Total Negative Marks");
      colums.push("Total Marks");
      colums.push("Out OF Marks");

      colums.push("All Branch Rank");
      colums.push("Branch");
      colums.push("Branch Rank");
      colums.push("Division");
      colums.push("Division Rank");
      colums.push("Sub Division");
      colums.push("Sub Division Rank");
      rows.push(colums);
      this.allRecords.forEach((item, index) => {
        colums = new Array<any>();
        colums.push((index + 1));
        colums.push(item.studentName);
        colums.push(item.username);
        colums.push(item.password);
        colums.push(item.mobileNo);
        colums.push(this.dateTime.transform(item.dateTime));
        let outerItem = item;
        item.forExcel.forEach(item => {
          colums.push(item.correctQuestion);
          colums.push(item.wrongQuestion);
          let totalQuestion:number = item.totalQuestion;
          colums.push(totalQuestion);

        });
        colums.push(item.totalPercentage);
        colums.push(item.totalPositiveMarks);
        colums.push(item.totalNegativeMarks);
        colums.push(item.totalMarks);
        colums.push(item.outOfMarks);
        colums.push(item.allBranchRank);
        colums.push(item.branch);
        colums.push(item.branchRank);
        colums.push(item.division);
        colums.push(item.divisionRank);
        colums.push(item.subDivision);
        colums.push(item.subDivisionRank);
        rows.push(colums);
      });
      this.xl.exportToExcel(rows, "solved-assignemnt-report");
    } else {
      this.dialog.showAlert("Please Search Data First.");
    }
  }
  public getSpecificRecord(source, key): any {
    for (let i = 0; i < source.length; i++) {
      if (source[i].name.toUpperCase().trim() == key.toUpperCase().trim()) {
        return source[i];
      }
    }
    return null;
  }
  private makeupSubjects(source, destination): Array<any> {
    let subjects = new Array<any>();

    source.forEach(item => {
      let obj = this.getSpecificRecord(destination, item.name);

      if (obj != null) {
        subjects.push(obj);
      } else {
        obj = {
          name: "-",
          correctQuestion: "-",
          wrongQuestion: "-",
          totalQuestion:0
        };
        subjects.push(obj);
      }
    });

    return subjects;
  }
  



  private perpareAssignmentForDisplay() {
    this.allRecords = new Array<any>();
    let allTestSubject = this.checkHowManysSubjectInTest(
      this.solvedAssignemntTotalRecords
    );
    // let subjectHeadre = this.createSubjectHeader(allTestSubject);

    this.tableHeader = {
      srNo: "Sr.No.",
      studentName: "Student Name",
      username: "User Name",
      password: "Password",
      mobileNo: "Mobile No.",
      avrageTime: "average Time",
      totalPercentage: "TotalPercentage",
      totalPositiveMarks: "Total Positive Mark",
      totalNegativeMarks: "Total Negative Marks",
      totalMarks: "Total Marks",
      outOfMarks: "Out OF Marks",
      dateTime: "Date & Time",
      allBranchRank: "All Branch Rank",
      branch: "Branch",
      branchRank: "Branch Rank",
      division: "Division",
      divisionRank: "Division Rank",
      subDivision: "Sub Division",
      subDivisionRank: "Sub Division Rank",
      subjects: allTestSubject.length <= 1 ? [] : allTestSubject,
      groups: {
        isSingle: false,
        name: this.createSubjectShortCuts(allTestSubject),
        totalQuestion: "Total Question.",
        correctQuestion: "Total Correct Question",
        wronQuestion: "Total Wrong Question"
      },
      marks: {
        name: this.createSubjectShortCuts(allTestSubject),
        correctQuestion: "Correct Question Marks",
        wrongQuestion: "Wrong Question Marks"
      },
      time: "",
      forExcel: allTestSubject
    };

    console.log(this.uniqueSolvedAssignmentRecords);


    this.uniqueSolvedAssignmentRecords.forEach((item, index) => {
      let getEachStudnetSubject = new Array<any>();
      getEachStudnetSubject = this.getTestSubject(
        this.solvedAssignemntTotalRecords,
        item
      );
      getEachStudnetSubject = this.makeupSubjects(
        allTestSubject,
        getEachStudnetSubject
      );

      let records = {
        pkId:item.pkId,
        srNo: index + 1,
        studentName: item.studentInfo.studentName,
        username: item.studentInfo.userName,
        password: item.studentInfo.password,
        mobileNo: item.studentInfo.mobileNo,
        avrageTime: item.averageTime,
        totalPercentage: item.percentage + "%",
        totalPositiveMarks: item.totalPositiveMarks,
        totalNegativeMarks: item.totalNegativeMarks,
        totalMarks: item.totalMarks,
        outOfMarks: item.outOfMarks,
        dateTime: item.date,
        allBranchRank: item.allBranchRank,
        branch: item.branch,
        branchRank: item.branchRank,
        division: item.studentInfo.division,
        divisionRank: item.divisionRank,
        subDivision: item.studentInfo.subDivision,
        subDivisionRank: item.subDivisionRank,
        //getEachStudnetSubject,
        subjects:
          getEachStudnetSubject.length <= 1 ? [] : getEachStudnetSubject,
        groups: {
          isSingle: false,
          name: this.createSubjectShortCuts(getEachStudnetSubject),
          totalQuestion: item.totalQuestion,
          correctQuestion: item.rightQuestion,
          wronQuestion: item.wrongQuestion
        },
        marks: {
          name: getEachStudnetSubject,
          correctQuestion: item.totalPositiveMarks,
          wrongQuestion: item.totalNegativeMarks
        },
        time: item.totalTime,
        forExcel: getEachStudnetSubject
      };

      this.allRecords.push(records);

    });
    this.allRecords.sort(function(obj1,obj2){
      return (obj1.allBranchRank - obj2.allBranchRank);
    });
  }

  ngOnInit() {
    this.initializeReactiveFormControls();
    this.getCriteria();
    this.branchControl.valueChanges.subscribe(value => {
      this.getSearchDivision();
    });
    this.divisionControl.valueChanges.subscribe(value => {
      this.searchSubDivision();
    });
    this.perpareAssignmentForDisplay();
  }
}
