import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormControlName } from '@angular/forms';
import { Component, Inject, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatCheckboxChange, MatDialog, MAT_DIALOG_DATA, MatRadioChange } from '@angular/material';
import { ImageService } from 'src/app/shared/utility/image-service';
import { ImageInterface } from 'src/app/shared/interfaces/image-interface';
import { ImagePopup } from 'src/app/shared/image-popup/image.popup.component';
import { PrintTestModel } from '../reprint-test-details/print-test-model';
import { DataShareService } from 'src/app/shared/services/data-share-service';
import { PapersetData } from '../reprint-test-details/paperset.interface';
import { ReprintTestDetailService } from '../reprint-test-details/reprint-test-details.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ClassDetails } from 'src/app/students/studenthomepage/class-detail';
import { ClassDetailsForReprint } from '../entity/class-details-reprint';
import { DialogService } from "src/app/shared/services/dialog.service";
import { AdminLoginService } from "../admin-services/admin-login-service";
import { ClassDetailModal } from "src/app/shared/model/class-detail-model";



@Component({
    selector:'print-question-paper',
    styleUrls:['./print.questionpaper.component.css'],
    templateUrl:'./print.questionpaper.component.html',
})
export class PrintQuestionPaperCommon implements OnInit , AfterViewInit{
    public isTexWaterMark:boolean = true;
    public isClassLogoSelected:boolean = false;
    public waterMarkImageBase64:string = "";
    public classLogoBase64:string = "";
    public testModel:PrintTestModel = new PrintTestModel();
    public paperSetData:PapersetData = null;
    public isLoaded:boolean = false;
    public constructor(private imageService:ImageService ,
        private dialog:DialogService,
        private datashare:DataShareService,
        private http:ReprintTestDetailService,
        private adminLogin:AdminLoginService,
        @Inject(MAT_DIALOG_DATA) private data:any
        ){
            this.testModel.instituteName

        }
    public isLogoChecked(checkBox:MatCheckboxChange):void{
        this.isClassLogoSelected = checkBox.checked;
    }
    ngAfterViewInit(){}
    ngOnInit(){
        this.paperSetData = <PapersetData>this.data.paperSetData;

        let classData:ClassDetailModal = this.adminLogin.adminLoginData;
        this.defaultPaperSetting(classData);
    }
    public pdfRadioChange(radio:MatRadioChange){
        this.testModel.pdfFormat = radio.source.checked;
        this.testModel.docxFormat = false;
    }
    public docxRadioChange(radio:MatRadioChange){
        this.testModel.docxFormat = radio.source.checked;
        this.testModel.pdfFormat  = false;
    }
    public professorNameCheckBox(checkBox:MatCheckboxChange):void{
        this.testModel.printProfessorName = checkBox.checked;
    }
    public printTestHeadingCheckBox(checkBox:MatCheckboxChange):void{
        this.testModel.printTestHeading = checkBox.checked;
    }
    public printAddress1CheckBox(checkBox:MatCheckboxChange):void{
        this.testModel.printAddress= checkBox.checked;
    }
    public printDateCheckBox(checkBox:MatCheckboxChange):void{
        this.testModel.printDate= checkBox.checked;
    }
    public printClassLogoCheckBox(checkBox:MatCheckboxChange):void{
        this.testModel.printClassLogo = checkBox.checked;
        this.isClassLogoSelected = checkBox.checked;
    }
    public alignLeftRadioChange(radio:MatRadioChange):void{
        this.testModel.alignmentLeft = radio.source.checked;
        this.testModel.alignmentRight = false;
    }
    public alignRightRadioChange(radio:MatRadioChange):void{
        this.testModel.alignmentRight = radio.source.checked;
        this.testModel.alignmentLeft = false;
    }
    public printOptionAsCheckBoxChange(checkBox:MatCheckboxChange):void{
        this.testModel.printOptionAs = checkBox.checked;
    }
    public printQuestionWithOnlyFourOptionCheckBoxChange(checkBox:MatCheckboxChange):void{
        this.testModel.printQuestionWithFourOption = checkBox.checked;
    }
    public printExamYearAfterQuestionCheckBoxChange(checkBox:MatCheckboxChange):void{
        this.testModel.printExamYearAfterQuestion = checkBox.checked;
    }
    public addOneSpaceAfterEachQuestionCheckBoxChange(checkBox:MatCheckboxChange):void{
        this.testModel.addOneSpaceAfterEachQuestion = checkBox.checked;
    }
    public matrixNewPatternCheckBoxChange(checkBox:MatCheckboxChange):void{
        this.testModel.matrixNewPattern = checkBox.checked;
    }
    public waterMarkTextRadioChange(radio:MatRadioChange):void{
        this.testModel.textWaterMark = radio.source.checked;
        this.testModel.pictureWatermark = false;
        this.isTexWaterMark = true;
    }
    public pictureWaterMarkTextRadioChange(radio:MatRadioChange):void{
        this.testModel.textWaterMark =false;
        this.testModel.pictureWatermark =  radio.source.checked;
        this.isTexWaterMark = false;
    }
    public waterMarkSemiTransparentCheckBoxChnage(checkBox:MatCheckboxChange):void{
        this.testModel.watermarkSemiTransparent = checkBox.checked;
    }
    public doubleColumAutoSettingRadioChange(radio:MatRadioChange):void{
        this.testModel.doubleColumn.autoSetting = radio.source.checked;
        this.testModel.doubleColumn.fourOptionInOneLine = false;
        this.testModel.doubleColumn.oneOptionInOneLine = false;
        this.testModel.doubleColumn.twoOptionInOneLine = false;
        this.testModel.singleColum.autoSetting = false;
        this.testModel.singleColum.oneOptionInOneLine = false;
        this.testModel.singleColum.twoOptionInOneLine = false;
        this.testModel.singleColum.fourOptionInOneLine = false;
    }
    public doubleColumOneOptionInOneLineRadioChange(radio:MatRadioChange):void{
        this.testModel.doubleColumn.oneOptionInOneLine = radio.source.checked;
        this.testModel.doubleColumn.autoSetting = false;
        this.testModel.doubleColumn.fourOptionInOneLine = false;
        this.testModel.doubleColumn.twoOptionInOneLine = false;
        this.testModel.singleColum.autoSetting = false;
        this.testModel.singleColum.oneOptionInOneLine = false;
        this.testModel.singleColum.twoOptionInOneLine = false;
        this.testModel.singleColum.fourOptionInOneLine = false;
    }
    public doubleColumTowOptionInOneLineRadioChange(radio:MatRadioChange):void{
        this.testModel.doubleColumn.twoOptionInOneLine = radio.source.checked;
        this.testModel.doubleColumn.oneOptionInOneLine = false;
        this.testModel.doubleColumn.autoSetting = false;
        this.testModel.doubleColumn.fourOptionInOneLine = false;
        this.testModel.singleColum.autoSetting = false;
        this.testModel.singleColum.oneOptionInOneLine = false;
        this.testModel.singleColum.twoOptionInOneLine = false;
        this.testModel.singleColum.fourOptionInOneLine = false;
    }
    public doubleColumFourOptionInOneLineRadioChange(radio:MatRadioChange):void{
        this.testModel.doubleColumn.fourOptionInOneLine = radio.source.checked;
        this.testModel.doubleColumn.twoOptionInOneLine = false;
        this.testModel.doubleColumn.oneOptionInOneLine = false;
        this.testModel.doubleColumn.autoSetting = false;

        this.testModel.singleColum.autoSetting = false;
        this.testModel.singleColum.oneOptionInOneLine = false;
        this.testModel.singleColum.twoOptionInOneLine = false;
        this.testModel.singleColum.fourOptionInOneLine = false;
    }
    public singleColumAutoSettingRadioChange(radio:MatRadioChange):void{
        this.testModel.singleColum.autoSetting = radio.source.checked;
        this.testModel.singleColum.oneOptionInOneLine = false;
        this.testModel.singleColum.twoOptionInOneLine = false;
        this.testModel.singleColum.fourOptionInOneLine = false;

        this.testModel.doubleColumn.fourOptionInOneLine = false;
        this.testModel.doubleColumn.twoOptionInOneLine = false;
        this.testModel.doubleColumn.oneOptionInOneLine = false;
        this.testModel.doubleColumn.autoSetting = false;
    }
    public singleColumOneOptionInOneLineRadioChange(radio:MatRadioChange):void{
        this.testModel.singleColum.oneOptionInOneLine = radio.source.checked;
        this.testModel.singleColum.autoSetting = false;
        this.testModel.singleColum.twoOptionInOneLine = false;
        this.testModel.singleColum.fourOptionInOneLine = false;
        this.testModel.doubleColumn.fourOptionInOneLine = false;
        this.testModel.doubleColumn.twoOptionInOneLine = false;
        this.testModel.doubleColumn.oneOptionInOneLine = false;
        this.testModel.doubleColumn.autoSetting = false;
    }
    public singleColumTowOptionInOneLineRadioChange(radio:MatRadioChange):void{
        this.testModel.singleColum.twoOptionInOneLine = radio.source.checked;
        this.testModel.singleColum.autoSetting = false;
        this.testModel.singleColum.oneOptionInOneLine = false;
        this.testModel.singleColum.fourOptionInOneLine = false;

        this.testModel.doubleColumn.fourOptionInOneLine = false;
        this.testModel.doubleColumn.twoOptionInOneLine = false;
        this.testModel.doubleColumn.oneOptionInOneLine = false;
        this.testModel.doubleColumn.autoSetting = false;
    }
    public singleColumFourOptionInOneLineRadioChange(radio:MatRadioChange):void{
        this.testModel.singleColum.fourOptionInOneLine = radio.source.checked;
        this.testModel.singleColum.autoSetting = false;
        this.testModel.singleColum.oneOptionInOneLine = false;
        this.testModel.singleColum.twoOptionInOneLine = false;

        this.testModel.doubleColumn.fourOptionInOneLine = false;
        this.testModel.doubleColumn.twoOptionInOneLine = false;
        this.testModel.doubleColumn.oneOptionInOneLine = false;
        this.testModel.doubleColumn.autoSetting = false;
    }
    public  getOnlyDate(strDate:string):string{
        let spliStr = strDate.split(" ");
        if(spliStr){
            let dateStr = spliStr[0];
            let dateSplit = dateStr.split("-");
            if(dateSplit){
                let dbDate = dateSplit[0]+"/"+dateSplit[1]+"/"+dateSplit[2];
                return dbDate;
            }
        }
        return "";
    }
    public printSolutionInOneColumn(checkBox:MatCheckboxChange):void{
        this.testModel.printSolutionInOneColumn = checkBox.checked;
    }
    public currentDateTime:FormControl = new FormControl('');
    public defaultPaperSetting(details:ClassDetailModal):void{
        this.testModel.textWaterMark = Boolean(details.waterMark);

        this.testModel.printProfessorName = Boolean(details.printProfessor);
        this.testModel.professorName = details.professorName;
        this.testModel.instituteName = details.classAppName;
        this.testModel.testIdForPrinting =String(this.paperSetData.testRecord.testId);
        this.testModel.startNumber = String(1); // alway default set 1
        this.testModel.className = details.classAppName;
        this.testModel.address1 = details.addressLineOne;
        this.testModel.address2 = details.addressLineTwo;
        this.testModel.date = new Date(details.currentDateTime).toISOString();
        this.testModel.printAddress = Boolean(details.chkPrintClass);
        this.testModel.printClassLogo = details.printLogo;
        this.testModel.pdfFormat                        = Boolean(details.pdfFormat);
        this.testModel.docxFormat                       = Boolean(details.docFormat);
        this.testModel.doubleColumn.autoSetting         = Boolean(details.dblColAuto);
        this.testModel.doubleColumn.oneOptionInOneLine  = Boolean(details.dciOneOne);
        this.testModel.doubleColumn.fourOptionInOneLine = Boolean(details.dciFourOne);
        this.testModel.doubleColumn.twoOptionInOneLine  = Boolean(details.dclTwoOne);
        this.testModel.singleColum.autoSetting          = Boolean(details.singleAutos);
        this.testModel.singleColum.oneOptionInOneLine   = Boolean(details.optsNoneOne);
        this.testModel.singleColum.twoOptionInOneLine   = Boolean(details.optsnTwoOne);
        this.testModel.singleColum.fourOptionInOneLine  = Boolean(details.optSnFourOne);
        this.testModel.printDate                        = Boolean(details.chkPrintdate);
        this.testModel.printExamYearAfterQuestion       = Boolean(details.chkPrintExamYear);
        this.testModel.addOneSpaceAfterEachQuestion     = Boolean(details.chkAddSpace);
        this.testModel.watermarkSemiTransparent         = Boolean(details.chkSemiTransparent);
        this.testModel.alignmentLeft                    = Boolean( details.leftAllAlignmentLogo);
        this.testModel.alignmentRight                   = Boolean(details.rightAlignment);
        this.testModel.watermarkText = details.watermark;
        this.testModel.testHeading = details.testHeading;
        this.testModel.printTestHeading                 = Boolean(details.printTestHeading);

        this.testModel.printOptionAs                    = Boolean(details.printOptionAs);
        this.testModel.printQuestionWithFourOption      = Boolean(details.printQuestions);
        this.testModel.uniqueClassName = details.uniqueClassName;
        this.testModel.matrixNewPattern                 = Boolean(details.matrixPattern);

    }
    public isValidData():boolean{
        if(this.testModel.printClassLogo){
            if( (!this.testModel.classLogoImage)
            ||  this.testModel.classLogoImage.trim().length<1
            ||  this.testModel.classLogoImage.indexOf(";base64,")== -1){
                this.dialog.showAlert("Please Select Class Logo Image.");
                return false;
            }
        }
        if(this.testModel.pictureWatermark){
            if((!this.testModel.watermarkPicture)
            || this.testModel.watermarkPicture.trim().length<1
            || this.testModel.watermarkPicture.indexOf(";base64,")== -1){
                this.dialog.showAlert("Please Select Watermark Image");
                return false;
            }
        }
        if(this.testModel.textWaterMark){
            if((!this.testModel.watermarkText)
            || this.testModel.watermarkText.trim().length < 1 ){
                this.dialog.showAlert("Please Enter Watrmark text");
                return false;
            }
        }
        if(this.testModel.printTestHeading){
            if((!this.testModel.testHeading) || this.testModel.testHeading.trim().length < 1){
                this.dialog.showAlert("Please Enter Test Heading");
                return false;
            }
        }
        if(this.testModel.printAddress){
            if((!this.testModel.address1) || this.testModel.address1.trim().length < 1){
                this.dialog.showAlert("Please Enter Address 1");
                return false;
            }
        }
        if(this.testModel.printDate){
            if( (!this.testModel.date) || this.testModel.date.length < 1 ){
                this.dialog.showAlert("Please Select Date");
                return false;
            }
        }
        if((!this.testModel.startNumber) || this.testModel.startNumber.trim().length < 1 ){
            this.dialog.showAlert("Please Enter Start No.");
            return false;
        }else{
            let regexp = /^(\d)+$/;
            if(!regexp.test(this.testModel.startNumber)){
                this.dialog.showAlert("Please Enter Only Number");
                return false;
            }
        }
        if(!this.paperSetData){
            this.dialog.showAlert("Test Data Available");
            return false;
        }
        return true;
    }
    public createFile():void{
        if(this.isValidData()){
            this.isLoaded = true;
            this.testModel.userName = this.paperSetData.classData.username;
            this.testModel.uniqueClassName = this.paperSetData.classData.uniqueClassName;
            this.testModel.batch = this.paperSetData.testRecord.batch;
            this.testModel.branch = this.paperSetData.testRecord.branch;
            this.testModel.course = this.paperSetData.testRecord.course;
            this.testModel.subjectName = this.paperSetData.testRecord.subject;
            this.testModel.patternName = this.paperSetData.testRecord.patternName;
            this.testModel.testId = this.paperSetData.testRecord.testId.toString();
            this.testModel.testType = this.paperSetData.testRecord.testType;
            this.testModel.mainPaperSet = this.paperSetData.mainPaperSet;
            this.testModel.paperVersionName = this.paperSetData.paperSet.setName;
            this.testModel.teacherCopy = this.paperSetData.teacherCopy ;
            this.testModel.questionString = this.paperSetData.testRecord.questionString;
            this.testModel.className = this.paperSetData.testRecord.standard;
            this.testModel.date = "";
            if(this.testModel.date){
                let date = new Date(this.testModel.date);
                let testDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} `;
                this.testModel.date = testDate;
            }
            this.http.printDocument(this.testModel).subscribe((res:HttpResponse<any>)=>{
                this.dialog.showAlert("Reprint Paper SuccessFully..!");
                this.isLoaded = false;
            },(err:HttpErrorResponse)=>{
                this.isLoaded = false;
                this.dialog.showAlert(err.error);
            });
        }
    }
    public close():void{
        this.data.close();
    }
    public uploadWatermarkImage(watermarkImage:HTMLInputElement):void{
        if('files' in watermarkImage){
            let file:File = watermarkImage.files[0];
            if(this.imageService.isImageFile(file)){
                this.imageService.uploadImage(file).then((success:ImageInterface)=>{
                    this.waterMarkImageBase64 = success.data;
                    this.testModel.watermarkPicture = success.data;
                },(error:ImageInterface)=>{
                    alert(error.message);
                    this.testModel.watermarkPicture = '';
                });
            }else{
                this.testModel.watermarkPicture = '';
                this.dialog.showAlert("Please Upload Only Image File..!");
            }
        }
    }
    public uploadClassLogo(watermarkImage:HTMLInputElement):void{
        if('files' in watermarkImage){
            let file:File = watermarkImage.files[0];
            if(this.imageService.isImageFile(file)){
                this.imageService.uploadImage(file).then((success:ImageInterface)=>{
                    this.classLogoBase64 = success.data;
                    this.testModel.classLogoImage = success.data;
                },(error:ImageInterface)=>{
                    this.testModel.classLogoImage = '';
                    alert(error.message);
                });
            }else{
                this.testModel.classLogoImage = '';
                this.dialog.showAlert("Please Upload Only Image File..!");
            }
        }
    }

    public clickOnImage(based64:string):void{
        //this.dialog.open(ImagePopup);
    }
}
