import { Component, OnInit, AfterViewInit, OnChanges } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { Keys } from "src/app/shared/application/keys";
import { EncryptionDecryption } from "src/app/shared/application/encryption";
import { exhaustMap } from "rxjs/operators";
import { StudentDetails } from "../entity/student-details";
import { StudentsModule } from "src/app/students/students.module";
import { DialogService } from "src/app/shared/services/dialog.service";
import { AdminUiSetting } from "../admin-ui-settings/admin-ui-setting-class";
import { UploadResultService } from "./upload-file.service";
import { HttpErrorResponse } from "@angular/common/http";
@Component({
    selector:'upload-result',
    templateUrl:'./upload-result.html',
    styleUrls:['./upload-result.css']
})
export class UploadResult implements OnInit, AfterViewInit,OnChanges{
    private file:HTMLInputElement = null;
    public examResult:any= {};
    private mainDiv:HTMLElement = null;
    public isResult:boolean=false;
    public isLoaded:boolean = false;
    public constructor(
        private dialog:DialogService,
        private uploadResult:UploadResultService
    ){}
    ngAfterViewInit(){
        this.file = document.querySelector("input[type='file']") as HTMLInputElement; 
        this.mainDiv = document.querySelector(".upload-main-div") as HTMLElement;
    }
    ngOnInit(){

    }
    ngOnChanges(){

    }
    public onDisplayFile(result:boolean):void{
        this.isAllRight = result;
        this.isResult = result;
    }
    public adjustHeight():void{
        //AdminUiSetting.adminPanelMenubarHeightPx
    }
    public isAllRight:boolean = true;
    public uploadResultToServer():void{
        if(this.isAllRight &&  this.examResult['testResult'] 
            && this.examResult['exam']
            && this.examResult['classDetails']
            && this.examResult['student']){
            let exam = this.examResult;
            let resultsList = exam.testResult;
            let totalMarks = 0;
            let outOfMarks = 0;
            let percentage = 0;
            for(let i =0 ;i<resultsList.length;i++){
                totalMarks = resultsList[i].totalMarks;
                outOfMarks = resultsList[i].outOfMarks;
                percentage = resultsList[i].percentage;
                break;
            }
            let data ={
                testId :exam.exam.testId,
                studentName:exam.student.info.studentName,
                className:exam.classDetails.className,
                testType:exam.exam.testType,
                subjectName:exam.exam.subjectName,
                totalMarks:totalMarks,
                outOfMarks:outOfMarks,
                percentage:percentage,
                cloudKey:exam.student.auth.cloudKey,
                results:resultsList
            } 
            this.isLoaded = true;
            this.uploadResult.uploadResult(data).subscribe((res)=>{
                this.isLoaded = false;
                this.dialog.showAlert(res.message);
                
            },(error:HttpErrorResponse)=>{
                console.log(error);
                this.isLoaded = false;
                this.dialog.showAlert(error.message);
            });
        }else{
            this.isLoaded = false;
            this.dialog.showAlert("Upload Correct File.");
        }
    }
    public uploadFile():void{
        this.readFile();
    }
    public readFile(){
        if(this.file && this.file['files'] && this.file.files.length>0){
            var reader = new FileReader();
            reader.onload = ()=>{
                let blob:any = reader.result;
                let str_split = blob.split("base64,");
                let fileData = window.atob(str_split[1]);
                try{
                    let json = EncryptionDecryption.decrypt(fileData.replace("\"",''),Keys.encryptionKey);
                    let examResult = JSON.parse(json); 
                    this.examResult = examResult;  
                    this.isResult = true;
                    this.isAllRight = true;
                }catch(e){
                    this.isResult = false;
                    this.isAllRight = false;
                    this.dialog.showAlert("Invalid Encrypted File.");
                }
            };
            reader.readAsDataURL(this.file.files[0]);
        }else{
            this.isAllRight = false;
            this.dialog.showAlert("Please Select File First.");
        }
    }
}