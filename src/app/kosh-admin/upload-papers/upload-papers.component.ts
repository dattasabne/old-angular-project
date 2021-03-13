import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UploadTable } from '../upload-table-entity/upload-table';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DialogService } from '../services/dialog-service';
import { PrintPreviewComponent } from '../print-preview/print-preview.component';

@Component({
  selector: 'app-upload-papers',
  templateUrl: './upload-papers.component.html',
  styleUrls: ['./upload-papers.component.css']
})
export class UploadPapersComponent implements OnInit,AfterViewInit {

  public patternControl:FormControl = new FormControl("",[]);
  public subjectControl:FormControl = new FormControl("",[]);
  public standardControl:FormControl = new FormControl("",[]);
  public chapterControl:FormControl = new FormControl("",[]);
  
  constructor() { }
  ngOnInit() {
  this.getAllPatterns();
  this.getAllChapters();
  this.getHeaders();
  }
  ngAfterViewInit() {
    
  }
  public docxSrc:string='';
  public allTableDetails:Array<UploadTable> = new Array<UploadTable>();
  public allHeaders = <UploadTable>{};

  public allSubjects:Array<any> = new Array<any>();
  public standards:Array<any> = new Array<any>();
  public chapters:Array<any> = new Array<any>();

  public getHeaders():void {
    this.allHeaders = <UploadTable>{};
    this.allHeaders.questionNo = "Question No";
    this.allHeaders.dateTime = "Date/Time";
    this.allHeaders.user= "User";
    this.allHeaders.examType = "Exam Type";
  }
  public getAllPatterns() {
    this.patternControl.valueChanges.subscribe(pattern=>{
      this.allSubjects = pattern.subjects;
      this.standards = pattern.standards;
    });
  }
public getAllChapters() {
  this.subjectControl.valueChanges.subscribe(subject=>{
    this.chapters = subject.chapters;
  })
}
  public patterns = [
    {
      name:"JEE",
      standards:["11th","12th"],
      subjects:[
        {
          subjectName:"Physics",
          chapters:["Physics1","Physics2","Physics3"]
        },
        {
          subjectName:"Chemistry",
          chapters:["Chemistry1","Chemistry2","Chemistry3"]
        },
        {
          subjectName:"Mathematics",
          chapters:["Mathematics1","Mathematics2","Mathematics3"]
        }
      ] 
    }, 
    {
      name:"Advance JEE",
      standards:["11th","12th"],
      subjects:[
        {
          subjectName:"Physics",
          chapters:["Physics1","Physics2","Physics3"]
        },
        {
          subjectName:"Chemistry",
          chapters:["Chemistry1","Chemistry2","Chemistry3"]
        },
        {
          subjectName:"Mathematics",
          chapters:["Mathematics1","Mathematics2","Mathematics3"]
        }
      ] 
    },
    {
      name:"NEET",
      standards:["11th","12th"],
      subjects:[
        {
          subjectName:"Physics",
          chapters:["Physics1","Physics2","Physics3"]
        },
        {
          subjectName:"Chemistry",
          chapters:["Chemistry1","Chemistry2","Chemistry3"]
        },
        {
          subjectName:"Bialogy",
          chapters:["Bialogy1","Bialogy2","Bialogy3"]
        }
        
      ] 
    },
    {
      name:"MH-CET",
      standards:["11th","12th"],
      subjects:[
        {
          subjectName:"Physics",
          chapters:["Physics1","Physics2","Physics3"]
        },
        {
          subjectName:"Chemistry",
          chapters:["Chemistry1","Chemistry2","Chemistry3"]
        },
        {
          subjectName:"Bialogy",
          chapters:["Bialogy1","Bialogy2","Bialogy3"]
        },
        {
          subjectName:"Mathematics",
          chapters:["Mathematics1","Mathematics2","Mathematics3"]
        }
      ] 
    }
  ]
}





