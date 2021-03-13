import { Component, OnInit, AfterViewInit, Inject, Type } from "@angular/core";
import {  MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PrintQuestionPaper, QuestionPaper, PrintingQuestionPaperDetails, QuestionPaperSolution, OwnUploadDocument, OwnUploadResponse } from '../interfaces/question.paper.interface';
import { ClassProfile } from 'src/app/shared/model/class-profile-model';

import { ReprintTestDetailService } from './reprint-test-details.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import { PrintQuestionPaperCommon } from '../print-question-paper/print.questionpaper.component';
import { PapersetData } from './paperset.interface';
import { GeneratedTest } from '../search-generated-test/generated-test-model';
@Component({
    selector:'reprint-test-details',
    templateUrl:'./reprint.test.details.html',
    styleUrls:['./reprint.test.details.css']
})
export class ReprintTestDetailsComponent implements OnInit , AfterViewInit{
    public constructor(@Inject(MAT_DIALOG_DATA) private data:any,
    private service:ReprintTestDetailService,
    private dialog:MatDialog){}
    private mainContainer:HTMLElement = null;
    public questionTableColumn = ['setName','questionPaper','teachersCopy'];
    public assignmentDate:string = "";
    public assignmentId:string = "";
    public solutionTableColumn = ['preparation','questionPaper','solutionPaper','assignmnetId','assignmnetDate'];
    public isLoaded:boolean = false;

    public printQdataSource:MatTableDataSource<PrintingQuestionPaperDetails> = null;
    public testData:PrintQuestionPaper = <PrintQuestionPaper>{};
    public solutionTableDataSource:MatTableDataSource<OwnUploadResponse> = null;
    public classData:ClassProfile = null;
    public testRecord:GeneratedTest = null;

    ngAfterViewInit(){
        this.mainContainer = document.querySelector(".reprint-main-div border");
        window.onresize = (ev)=>{
            this.adjustScreenSize();
        };
    }
    ngOnInit(){
        if(!(this.data && this.data.classData && this.data.testRecord)){
            alert("Data Not Available Please Contact Software vendor..!");
            this.data.close();
            return;
        }
        this.classData  = this.data.classData;
        this.testRecord = this.data.testRecord;
        let record =<PrintQuestionPaper>{};
        this.testData   =  record;
        record.testId   =  this.testRecord.testId.toString();
        record.pattern  =  this.testRecord.patternName;
        record.subject  =  this.testRecord.subject;
        record.testType =  this.testRecord.testType;
        record.testCreatedDate = this.testRecord.date;
        const data ={
            uniqueClassName:this.classData.uniqueClassName,
            patternName:this.testRecord.patternName,
            userName:this.classData.username,
            batch:this.testRecord.batch,
            testId:this.testRecord.testId.toString(),
            subjectName:this.testRecord.subject,
            chapterName:this.testRecord.chapterName,
            uploadType : 'own upload'


        };
        this.isLoaded = true;
        this.service.fetchReprintTest(data).subscribe((res:HttpResponse<any>)=>{
            record.printingQuestionPaper = res.body.data.paperSet;
            record.questionPaperSolution = <OwnUploadResponse> res.body.data.ownUpload;
            if(record.questionPaperSolution){
                this.assignmentId = record.questionPaperSolution.assignmentId;
                this.assignmentDate = record.questionPaperSolution.assignmentDate;
            }
            this.testData = record;
            let x = new Array<OwnUploadResponse>();
            x.push(record.questionPaperSolution);
            this.solutionTableDataSource = new MatTableDataSource<OwnUploadResponse>(x);
            this.printQdataSource = new MatTableDataSource<PrintingQuestionPaperDetails>(record.printingQuestionPaper);

            this.isLoaded = false;
        },(error:HttpErrorResponse)=>{
            console.log(error);
            this.isLoaded = false;
        });
    }
    public close(){
        this.data.close();
    }
    public adjustScreenSize():void{
        if(this.mainContainer){
            this.mainContainer.style.height ="100%";
            this.mainContainer.style.width ="100%";
            this.mainContainer.style.overflow="auto";
        }
    }
    public createQuestionPaperDocx(paperSet:PrintingQuestionPaperDetails):void{
        let data:PapersetData= <PapersetData>{};
        data.paperSet = paperSet;
        data.testRecord = this.testRecord;
        data.classData = this.classData;
        data.mainPaperSet = paperSet.mainSet;
        data.teacherCopy = false;
        data.isWord = true;
        data.isPdf = false;

        this.popup(PrintQuestionPaperCommon,data);
    }
    public createQuestionPaperPdf(paperSet:PrintingQuestionPaperDetails):void{
        let data:PapersetData= <PapersetData>{};
        data.paperSet = paperSet;
        data.testRecord = this.testRecord;
        data.classData = this.classData;
        data.mainPaperSet = paperSet.mainSet;
        data.teacherCopy = false;
        data.isWord = false;
        data.isPdf = true;

        this.popup(PrintQuestionPaperCommon,data);
    }
    public createTeacherCopyDocx(paperSet:PrintingQuestionPaperDetails):void{
        let data:PapersetData= <PapersetData>{};
        data.paperSet = paperSet;
        data.testRecord = this.testRecord;
        data.classData = this.classData;
        data.mainPaperSet = paperSet.mainSet;
        data.teacherCopy = true;
        data.isWord = true;
        data.isPdf = false;

        this.popup(PrintQuestionPaperCommon,data);
    }
    public createTeacherCopyPdf(paperSet:PrintingQuestionPaperDetails):void{
        let data:PapersetData= <PapersetData>{};
        data.paperSet = paperSet;
        data.testRecord = this.testRecord;
        data.classData = this.classData;
        data.mainPaperSet = paperSet.mainSet;
        data.teacherCopy = true;
        data.isWord = false;
        data.isPdf = true;
        console.log(data);
        this.popup(PrintQuestionPaperCommon,data);

    }








    public createSolutionFile(solutionFile:OwnUploadResponse):void{
        this.popup(PrintQuestionPaperCommon,solutionFile);
    }
    private popup(type:Type<any> , recordData:any):void{
        let dialogRef:MatDialogRef<any> = null ;
        if(dialogRef !=null){
            return;
        }
        dialogRef =  this.dialog.open(PrintQuestionPaperCommon,{
            height:"100%",
            width:"100%",
            data:{
                close : ()=>{
                    dialogRef.close();
                    dialogRef = null;
                },
                paperSetData : recordData
            }
        });
    }


}
