import { HttpErrorResponse } from '@angular/common/http';

import { HttpResponse } from '@angular/common/http';

import {
  Component,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnInit
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { AppComponent } from "../../app.component";
import { AppConstant } from "../../shared/app-constant/app-constatnt";
import { AnalysisService } from "../analysis-report/analysis-report.service";
import { ExcelService } from "../../shared/excel-service/excel-service";
import { GeneralUtility } from "../../shared/utility/general-utility";
import { IndividualReportService } from "./individual-report.service";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { ResponseModel } from "src/app/website/model/response.model";
@Component({
  selector: "indivisual-report",
  templateUrl: "./indivisual-report.html",
  styleUrls: ["./indivisual-report.css"],
  encapsulation: ViewEncapsulation.None
})
export class IndivisualReportComponent implements OnInit {
  public batches: Array<any> = new Array<any>();
  public courses: Array<any> = new Array<any>();
  public branches: Array<any> = new Array<any>();
  public divisions: Array<any> = new Array<any>();
  public subDivisions: Array<any> = new Array<any>();
  public students: Array<any> = new Array<any>();
  public batchControl: FormControl = new FormControl(AppConstant.ALL, []);
  public courseControl: FormControl = new FormControl(AppConstant.ALL, []);
  public branchControl: FormControl = new FormControl(AppConstant.ALL, []);
  public divisionControl: FormControl = new FormControl(AppConstant.ALL, []);
  public subDivisionControl: FormControl = new FormControl(AppConstant.ALL, []);
  public fromDateControl: FormControl = new FormControl("", []);
  public toDateControl: FormControl = new FormControl("", []);
  public nameControl: FormControl = new FormControl("", []);
  public printRecords: Array<any> = new Array<any>();
  public allStudentNames: Array<any> = new Array<any>();
  public allRecords: Array<any> = new Array<any>();

  public isLoaded: boolean = false;
  public isNameLoaded = false;
  public studentInfoData: any = {};
  public isRecordLoaded = false;
  public constructor(
    private http: AnalysisService,
    private change: ChangeDetectorRef,
    private xl: ExcelService,
    private individualService: IndividualReportService
  ) {}

  ngOnInit() {
    this.getCriteria();
    this.branchControl.valueChanges.subscribe(value => {
      this.getSearchDivision();
    });
    this.divisionControl.valueChanges.subscribe(value => {
      this.searchSubDivision();
    });
    this.perpareAssignmentForDisplay();
  }

  public displayName(value: any): string {
    if (typeof value == "object") {
      return value.studentName;
    }
    return "";
  }
  public getAutocompleteValue(data: MatAutocompleteSelectedEvent): void {
    this.studentInfoData = data.option.value;
    this.allRecords = new Array<any>();
  }

  public getCriteria(): void {
    this.isLoaded = true;
    this.http.getCriteria().subscribe(
      (rd:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = rd.body;
        this.batches = responseModel.data.batch;
        this.courses = responseModel.data.course;
        this.branches = responseModel.data.branch;
        //this.change.detectChanges();
        this.isLoaded = false;
      },
      err => {
        this.isLoaded = false;
        alert(err.error.message);
      }
    );
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
      },
      err => {
        alert(err.error.message);
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
      },
      err => {
        alert(err.error.message);
      }
    );
  }



  public searchStudentName(): void {
    this.isNameLoaded = true;
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
    this.individualService.getStudentExamList(data).subscribe(
      (res:HttpResponse<ResponseModel>)=> {
        let responseModel:ResponseModel = <ResponseModel>res.body;
        this.allStudentNames = responseModel.data.solvedAssignment;
        this.isNameLoaded = false;
      },
      err => {
        alert(err.error.message);
      }
    );
  }
  public searchStudentRecords(): void {
    if (
      (typeof this.nameControl.value == "object" &&
        this.nameControl.value["studentId"] != null) ||
      this.nameControl.value["studentId"] != undefined
    ) {
      this.isRecordLoaded = true;
      const data = {
        fromDate: GeneralUtility.dateFilter(
          GeneralUtility.convertDateIntoDbDate(this.fromDateControl.value)
        ),
        toDate: GeneralUtility.dateFilter(
          GeneralUtility.convertDateIntoDbDate(this.toDateControl.value)
        ),
        studentId: this.nameControl.value.studentId,
        studentUserName: this.nameControl.value.userName,
        studentName: this.nameControl.value.studentName
      };
      this.individualService.getStudentExamRecords(data).subscribe(
        (res:HttpResponse<ResponseModel>) => {
          let responseModel:ResponseModel = res.body;
          this.solvedAssignemntTotalRecords = responseModel.data.data;
          this.uniqueSolvedAssignmentRecords = this.generateUniqueRecords(
            this.solvedAssignemntTotalRecords
          );
          this.perpareAssignmentForDisplay();
          this.studentInfoData.fromDate = data.fromDate;
          this.studentInfoData.toDate = data.toDate;
          this.isRecordLoaded = false;
        },
        (err:HttpErrorResponse) => {
          this.isRecordLoaded = false;

          alert(err.error.message);
        }
      );
    }
  }

  public tableHeader: any = {};
  public solvedAssignemntTotalRecords: Array<any> = new Array<any>();
  public uniqueSolvedAssignmentRecords: Array<any> = new Array<any>();

  private checkHowManysSubjectInTest(source): Array<any> {
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
          wrongQuestion: "Wrong Question"
        });
      }
    });

    return subjects;
  }
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
          wrongQuestion: item.wrongQuestion
        });
      }
    });

    return subjects;
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
          wrongQuestion: "-"
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
      assignmnetId: "Test Id",
      assignmentDate: "Assignment Date",
      assignmentTime: "Assignment Time",
      assignmentType: "Assignment Type",
      assignmentDescription: "Assignmnet Description",

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
      subName: "Subject",
      subjects: allTestSubject, //allTestSubject.length <= 1 ? [] : allTestSubject,
      groups: {
        isSingle: false,
        name: "Question Marks ", //this.createSubjectShortCuts(allTestSubject),
        totalQuestion: "Total Question.",
        correctQuestion: "Total Correct Question",
        wronQuestion: "Total Wrong Question"
      },
      marks: {
        name: "Questions Count", //this.createSubjectShortCuts(allTestSubject),
        correctQuestion: "Correct Question Marks",
        wrongQuestion: "Wrong Question Marks"
      },
      time: "",
      forExcel: allTestSubject
    };
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
        srNo: index + 1,
        studentName: item.studentInfo.studentName,
        username: item.studentInfo.userName,
        password: item.studentInfo.password,
        assignmnetId: item.assignment.testId,
        assignmentDate: item.assignment.assignmentDate,
        assignmentTime: item.assignment.assignmentTime,
        assignmentType: item.assignment.assignmentType,
        assignmentDescription: item.assignment.testDescription,
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
        subName: item.subName,
        subjects: getEachStudnetSubject,
        allBranchId:item.allBranchId,
        //getEachStudnetSubject.length <= 1 ? [] : getEachStudnetSubject,
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
  }
}
