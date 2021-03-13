import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { GeneratedTestHeader } from '../admin/search-generated-test/generated-test-model';

@Component({
  selector: 'app-view-testpdf-files',
  templateUrl: './view-testpdf-files.component.html',
  styleUrls: ['./view-testpdf-files.component.css']
})
export class ViewTestpdfFilesComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) private data:any,) { }
  public tableHeader =  <GeneratedTestHeader>{};
  public tableHeaderData =  <GeneratedTestHeader>{};
  public randomManualTest:boolean;
  public ownTest:boolean;
  ngOnInit() {
    this.getHeaders();
    this.getHeadersData();
  }
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
  public getHeadersData() {
    this.tableHeaderData.testId = "20",
    this.tableHeaderData.totQues = "80",
    this.tableHeaderData.pattern = "JEE",
    this.tableHeaderData.standard = "12TH",
    this.tableHeaderData.subject = "Physics",
    this.tableHeaderData.testType = "Final",
    this.tableHeaderData.testGenerationType = "Random",
    this.tableHeaderData.totalMarksOfTest = "200",
    this.tableHeaderData.onlineStatus = "Online"
  }

  public viewQuesPdfFile() {

  }
  public viewsolnPdfFile() {}
  public viewAnswersFile() {}
  public viewAllQuestions() {}

  public close():void{
    this.data.close();
  }
}
