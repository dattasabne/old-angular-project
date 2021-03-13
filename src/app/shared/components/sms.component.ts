import { Component, Input } from "@angular/core";
import { DialogService } from "../services/dialog.service";
import { ExcelService } from "../excel-service/excel-service";
import { DateTimePipe } from "../../admin/indivisual-report/date-time.pipe";
import { DateConvertPipe } from "../../admin/indivisual-report/date.pipe";
import { TimePipe } from "../../admin/indivisual-report/time.pipe";
@Component({
  selector: "sms-component",
  styleUrls: ["./sms.component.css"],
  templateUrl: "./sms.component.html",
  providers: [DateTimePipe, DateConvertPipe, TimePipe]
})
export class SmsComponent {
  @Input("data") data: Array<any>;
  @Input("header") tableHeader: any;
  @Input("studentData") studentData: any;
  public constructor(
    private dialog: DialogService,
    private xl: ExcelService,
    private dateTime: DateTimePipe,
    private dateCovert: DateConvertPipe,
    private timeConvert: TimePipe
  ) {}
  public export_to_excel(): void {
    this.export_to_excel_attempted();
  }

  public export_to_excel_attempted(): void {
    console.log(this.studentData);
    if (this.data && this.data.length > 0) {
      const rows: Array<Array<any>> = new Array<Array<any>>();
      let colums: Array<any> = new Array<any>();

      colums.push("Student Name");
      colums.push("User Name");
      colums.push("Password");
      colums.push("Mobile No.");
      colums.push("From Date");
      colums.push("To Date.");

      rows.push(colums);
      colums = new Array<any>();
      colums.push(this.studentData.studentName);
      colums.push(this.studentData.userName);
      colums.push(this.studentData.password);
      colums.push(this.studentData.mobileNo);
      colums.push(
        this.dateCovert.transform(this.studentData.fromDate, "dd-mm-yyyy")
      );
      colums.push(
        this.dateCovert.transform(this.studentData.toDate, "dd-mm-yyyy")
      );

      rows.push(colums);

      colums = new Array<any>();
      colums.push("Sr.No.");
      colums.push("Date & Time");
      colums.push("Test Id");
      colums.push("Assignment Date");
      colums.push("Assignment Time");
      colums.push("Assignment Type");
      colums.push("Assignment Description");
      colums.push("Subject");
      this.tableHeader.forExcel.forEach(item => {
        colums.push(item.name.concat(" Correct Question"));
        colums.push(item.name.concat(" Wrong Question"));
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
      this.data.forEach((item, index) => {
        colums = new Array<any>();
        colums.push(item.srNo);
        colums.push(this.dateTime.transform(item.dateTime));
        colums.push(item.assignmnetId);
        colums.push(
          this.dateCovert.transform(item.assignmentDate, "dd-mm-yyyy")
        );
        colums.push(this.timeConvert.transform(item.assignmentTime));
        colums.push(item.assignmentType);
        colums.push(item.assignmentDescription);
        colums.push(item.subName);

        item.forExcel.forEach(item => {
          colums.push(item.correctQuestion);
          colums.push(item.wrongQuestion);
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
        // colums.push(item.time);
        // colums.push(item.avrageTime);
        rows.push(colums);
      });
      this.xl.exportToExcel(rows, "solved-assignemnt-report");
    } else {
      this.dialog.showAlert("Please Search Data First.");
    }
  }
}
