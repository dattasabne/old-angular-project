import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MediaObserver } from '@angular/flex-layout';
import { AdminUiSetting } from '../admin-ui-settings/admin-ui-setting-class';
import { ExcelService } from 'src/app/shared/excel-service/excel-service';
import { CellInterface } from './cell-interface';
import { FormControl, Validators } from '@angular/forms';
import { OwntestUploaderJson, OwnUploadQuestions } from './own-test-upload-json';
import { OwntestUploadService } from './owntest-upload-service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DataShareService } from 'src/app/shared/services/data-share-service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { RefferenceModel } from 'src/app/shared/services/reffdata.model.service';
import { UtilityService } from '../admin-utility/utility.service';
import { StringUtility } from 'src/app/website/utility-service/string.utility';
import { MatSelectChange } from '@angular/material';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
import { SearchReffDataService } from 'src/app/website/utility-service/search.reff.data.service';
import { SearchEntity } from 'src/app/students/shared/entity/search-entity';

@Component({
    selector:'own-tes  t-upload',
    templateUrl:"./own-test-upload.html",
    styleUrls:['./own-test-upload.css']
})
export class OwnTestUploader implements OnInit ,AfterViewInit{
    @ViewChild("reviewFile",{read:ElementRef,static:false}) private reviewFile:ElementRef;
    public reviewSection:HTMLElement = null;
    public questionSection:HTMLElement = null;
    public mainSection:HTMLElement = null;
    public content:HTMLEmbedElement = null;
    public excelUploadSection:HTMLElement = null;
    public outerMainSection:HTMLElement = null;
    public ownReviewePdfWraper:HTMLElement = null;
    public ownQuestionPdfWraper:HTMLElement = null;
    public ownExcelThead:HTMLElement = null;
    public ownExcelTbody:HTMLElement = null;
    public base64:any='';
    public showPdf :boolean = false;
    public bodyElement:HTMLElement = null;
    public showQuestionPdf:boolean = false;
    private BASE64_MARKER = ';base64,';
    public patternControl:FormControl = null;
    public classControl :FormControl = null;
    public testTypeControl :FormControl = null;
    public subjectControl :FormControl = null;
    public academicYearControl:FormControl = null;
    public patterList:Array<string> = new Array<string>();
    public classList:Array<string> = new Array<string>();
    public academicYearList:Array<string> = new Array<string>();
    public subjectList:Array<string> = new Array<string>();
    public testTypeList:Array<string> = new Array<string>();
    private convertDataURIToBinary(dataURI) {
        var base64Index = dataURI.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for(var i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }
    public constructor(
        private sanitizer:DomSanitizer,
        private media:MediaObserver,
        private excelService:ExcelService,
        private ownUploadService:OwntestUploadService,
        private dataShare:DataShareService,
        private dialog:DialogService,
        private refModel:RefferenceModel,
        private reffData:SearchReffDataService
     ){     try {
                this.patternControl = new FormControl('MHTCET',[]);
                this.classControl = new FormControl('11th',[]);
                this.testTypeControl  = new FormControl('Final Test',[]);
                this.subjectControl = new FormControl('Physics',[]);
                this.academicYearControl = new FormControl('Target 2020',[]);
            } catch (error) {
                console.log(error);
                alert(error);
            }
        }

    ngAfterViewInit(){
        try {
            this.ownReviewePdfWraper = document.querySelector(".own-review-pdf-wraper") as HTMLElement;
            this.bodyElement = document.querySelector('body');
            this.outerMainSection = document.querySelector(".outer-main-section") as HTMLElement;
            this.excelUploadSection = document.querySelector(".own-xml-uplod") as HTMLElement;
            this.reviewSection = document.querySelector(".own-review-section") as HTMLElement;

            this.mainSection = document.querySelector(".own-main-section") as HTMLElement;
            if(this.reviewSection){
                this.reviewSection.ondragover = this.onDragOverHandler.bind(this);
                this.reviewSection.ondrop = (ev:DragEvent)=>{
                    this.onDropHandler(ev,'review');
                };
            }
            if(this.questionSection){
                this.questionSection.ondragover = this.onDragOverHandler.bind(this);
                this.questionSection.ondrop = (ev:DragEvent)=>{
                    this.onDropHandler(ev,'question');
                };
            }
            if(this.excelUploadSection){
                this.excelUploadSection.ondrop = this.excelDropHandler.bind(this);
                this.excelUploadSection.ondragover = this.onDragOverHandler.bind(this);
            }
            document.ondragover = this.onDragOverHandler.bind(this);
            window.addEventListener("dragover",this.onDragOverHandler.bind(this),false);
            window.addEventListener("drop",(ev:DragEvent)=>{
                ev.preventDefault();
            },false);
           this.responsiveUI();
            this.media.media$.subscribe(value=>{
               this.responsiveUI();
            });
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
    public responsiveUI():void{
      let searchSection:HTMLElement     = <HTMLElement> document.querySelector(".search-section");
      let dataSection:HTMLElement       = <HTMLElement> document.querySelector(".data-section");
      let pdfSection:HTMLElement        = <HTMLElement> document.querySelector(".pdf-section");
      let excelSection:HTMLElement      = <HTMLElement> document.querySelector(".excel-section");
      let screenHeight:number           = (window.innerHeight - AdminUiSetting.adminPanelMenubarHeightPx);
      let submitContainer:HTMLElement   = <HTMLElement> document.querySelector(".bottom-sheet");
      let excelTableHead:HTMLElement    = <HTMLElement> document.querySelector(".own-excel-thead");
      let excelTableBody:HTMLElement    = <HTMLElement> document.querySelector(".own-excel-tbody");
      let questionHeader:HTMLElement    = <HTMLElement> document.querySelector(".question-header");
      let questionBody  :HTMLElement    = <HTMLElement> document.querySelector(".question-body");
      let questionPaperCard:HTMLElement = <HTMLElement> document.querySelector(".own-question-section");
      let questionPdfViewer:HTMLElement = <HTMLElement> document.querySelector(".question-pdf-viewer");
      let questionPdfWraper:HTMLElement = <HTMLElement> document.querySelector(".question-pdf-wraper");
      let reviewPapercard:HTMLElement   = <HTMLElement> document.querySelector(".own-review-section");
      let reviewHeader:HTMLElement      = <HTMLElement> document.querySelector(".review-header");
      let reviewBody:HTMLElement        = <HTMLElement> document.querySelector(".review-body");
      let reviewPdfWraper:HTMLElement   = <HTMLElement> document.querySelector(".review-pdf-wraper");
      if(this.outerMainSection
        && searchSection
        && dataSection
        && pdfSection
        && excelSection
        && submitContainer
        && questionHeader
        && questionBody
        && questionPaperCard
        && questionPdfViewer
        && questionPdfWraper
        && reviewHeader
        && reviewBody){
        let extra:number = 10;
        this.outerMainSection.style.height = screenHeight + "px";
        searchSection.style.height   = screenHeight + "px";
        dataSection.style.height     = (screenHeight) + "px";
        searchSection.style.overflow = "auto";
        dataSection.style.overflow   = "auto";
        let halfHeight:number = Math.floor(screenHeight / 2);
        pdfSection.style.height = halfHeight + "px";
        questionPaperCard.style.height = halfHeight +"px";
        reviewPapercard.style.height   = questionPaperCard.offsetHeight + "px";
        questionBody.style.height = halfHeight - (questionHeader.offsetHeight) +"px";
        reviewBody.style.height   = questionBody.offsetHeight + "px";
        questionPdfWraper.style.height = (questionBody.offsetHeight - 50) +"px"
        questionPdfWraper.style.overflow = "auto";
        reviewPdfWraper.style.height   = questionPdfWraper.offsetHeight + "px";
        reviewPdfWraper.style.overflow = "auto";
        questionBody.style.overflow = "auto";
        questionBody.style.paddingBottom = "8px";
        questionBody.style.boxSizing ="borde-box";
        excelSection.style.height = (halfHeight - submitContainer.offsetHeight) + "px";
        excelTableBody.style.height   = (excelSection.offsetHeight - (excelTableHead.offsetHeight + 20)) + "px";
        excelTableBody.style.overflow = "auto";
      }
    }
    public reviewPdfBase64:any="";
    public questionPdfBase64:any="";

    public initDefaultComponentData():void{
        this.patterList = this.refModel.patternName;
        this.classList = this.refModel.classNames;
        this.academicYearList = this.refModel.academicYearNames;
        this.testTypeList = this.refModel.testTyep;
        if(this.classList.length>0){
            this.classControl.setValue(this.classList[0]);
        }
        if(this.patterList.length>0){
            let patternName:string = this.patterList[0];
            this.patternControl.setValue(patternName);
            this.displaySubject(patternName);
        }
        if(this.academicYearList.length>0){
            this.academicYearControl.setValue(this.academicYearList[0]);
        }
        if(this.testTypeList.length>0){
            this.testTypeControl.setValue(this.testTypeList[0]);
        }
        this.patternControl.valueChanges.subscribe(patter=>{
            this.displaySubject(patter);
        });
        this.testTypeControl.valueChanges.subscribe(value=>{
            this.updateSubjectByType(value);
        });
    }
    public updateSubjectByType(testType:string):void{
      this.subjectList = this.refModel.getSubjectFromPatternAndTestType(testType , this.allSubjects) ;
      if(this.subjectList.length>0){
          this.subjectControl.setValue(this.subjectList[0]);
      }
    }




    public allSubjects:string[] = [];
    public subjectSuccessHandler(response:HttpResponse<any>):void{
      this.isLoaded = false;
      let data:any  = response.body;
      if(data.result){
        this.allSubjects = <string[]>data.data;
        this.allSubjects = this.refModel.createSubjectOrder(this.allSubjects);
        this.subjectList = this.allSubjects;
        this.updateSubjectByType(this.testTypeControl.value);
      }else{
        this.dialog.showAlert(data.message);
      }
    }
    public displaySubject(pattern:string){
        this.isLoaded = true;
        let search:SearchEntity = <SearchEntity>{};
        search.patternName = pattern;
        this.reffData.getSubjectListByPatternName(search).subscribe(this.subjectSuccessHandler.bind(this),this.errorResponse.bind(this));
        // this.subjectList = this.refModel.getSubjectFromPattern(pattern);
        // if(this.subjectList.length>0){
        //     this.subjectControl.setValue(this.subjectList[0]);
        //     if(this.testTypeList.length>0){
        //         this.testTypeControl.setValue(this.testTypeList[0]);
        //     }
        // }
    }
    ngOnInit(){
        try {
            this.initDefaultComponentData();
            this.subjectControl.valueChanges.subscribe(value=>{
               this.subjectChangedHandler(value);
            });
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
    public readFile(file:File,type:string):void{
        try {
            let reader = new FileReader();
            let startHandler:(ev:any)=>void = null;
            let stopHandler :(ev:any)=>void = null;
            if(type=='review'){
                startHandler = (ev)=>{this.isLoadedReview = true;};
                stopHandler = (ev)=>{this.isLoadedReview = false;}
            }else if(type=='question'){
                startHandler = (ev)=>{this.isLoadedQuestionPaper = true};
                stopHandler = (ev)=>{this.isLoadedQuestionPaper = false};
            }
            reader.onloadstart = startHandler;
            reader.onabort =stopHandler;
            reader.onerror = stopHandler;
            reader.onload = (ev:any)=>{
                let data = ev.target.result;
                if(type=='review'){
                    this.reviewPdfBase64 = data;
                    this.showPdf = true;
                }else if(type == 'question'){
                    this.questionPdfBase64 = data;
                    this.showQuestionPdf = true;
                    this.isLoadedQuestionPaper = false;
                }
                stopHandler(null);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
    public questionPaperPdfProgress(progress):void{
        this.isLoadedQuestionPaper  = true;
    };
    public questionPaperPdfStop(pdf:PDFDocumentProxy):void{
        this.isLoadedQuestionPaper  = false;
        this.isUploadQuestionPdfFile = true;
        this.questionPdfPageCount = pdf.numPages;
    };
    public questionPdfError(error):void{
        this.isLoadedQuestionPaper   = false;
        this.isUploadQuestionPdfFile = false;
        this.questionPdfPageCount = 0 ;
        alert(error);
    };
    public reviewPdfProgress(progress):void{
        this.isLoadedReview  = true;
    };
    public reviewPdfStop(pdf:PDFDocumentProxy):void{
        this.isUploadReviewPdfFile = true;
        this.reviewPdfPageCount = pdf.numPages;
        this.isLoadedReview  = false;
    };
    public reviewPdfError(error):void{
        this.isLoadedReview  = false;
        this.isUploadReviewPdfFile = true;
        this.reviewPdfPageCount = 0;
        alert(error);
    };
    public openFile(ev:Event,type:string):void{
        try {
            if(ev.target){
                const input:HTMLInputElement =<HTMLInputElement> ev.target;
                if(input && input['files'] && input.files.length>0){
                    let file:File = input.files[0];
                    if(file){
                        if(file.type=='application/pdf'){
                            this.readFile(file,type);
                        }else{
                            alert("Please Upload Only PDF File.");
                        }
                    }
                }
            }
        } catch (error) {
            alert(error);
        }
    }
    public onDragOverHandler(ev:DragEvent):void{
        ev.preventDefault();
    }
    public excelDropHandler(ev:DragEvent):void{
       try {
            const file = this.getDropedFile(ev);
            if(file!=null){
                this.displayExcelOnScreen(file);
            }
       } catch (error) {
           console.log(error);
           alert(error);
       }
    }
    public excelRecords:Array<Array<string>> = [];
    public allQuestions:Array<Array<CellInterface>> = [];
    public excelHeader:Array<string> =[];
    public isLoaded:boolean = false;
    public isLoadedQuestionPaper:boolean = false;
    public isLoadedReview:boolean = false;
    public openExcelFile(ev:Event):void{
        try {
            let inputFile:HTMLInputElement =<HTMLInputElement> ev.target;
            if(inputFile && inputFile['files'] && inputFile.files.length==1){
                let file:File = inputFile.files[0];
                if(file !=null){
                    let extension = file.name.split(".");
                    if(extension && extension.length>1){
                        let fileExt=extension[1];
                        if(fileExt.trim().toLocaleLowerCase()=='xls'
                        || fileExt.trim().toLocaleLowerCase()=='xlsx'){
                            this.displayExcelOnScreen(file);
                        }else{
                            this.dialog.showAlert("Please Upload Only .xls or .xlsx File.");

                        }
                    }
                }
            }else{
                this.dialog.showAlert("Please Select Only One .xls or .xlsx File.");
            }
        } catch (error) {
            console.log(error);
            this.dialog.showAlert(error);
        }
    }
    private resetAppData():void{
        this.allQuestions            = [];
        this.isValidExcelFile        = false;
        this.reviewPdfBase64         = null;
        this.questionPdfBase64       = null;
        this.questionPdfPageCount    = 0 ;
        this.reviewPdfPageCount      = 0;
        this.isUploadExcelFile       = false;
        this.isUploadQuestionPdfFile = false;
        this.isUploadReviewPdfFile   = false;
    }
    public isUploadExcelFile:boolean       = false;
    public isUploadQuestionPdfFile:boolean = false;
    public isUploadReviewPdfFile:boolean   = false;
    public questionPdfPageCount:number = 0;
    public reviewPdfPageCount:number   = 0;
    public excelRecordCount:number = 0;
    public isValidData():boolean{
      this.excelRecordCount = this.allQuestions.length;
      this.subjectChangedHandler(this.subjectControl.value);
      if(!this.dataShare.ClassProfile || !this.dataShare.ClassProfile.username || this.dataShare.ClassProfile.username.trim().length == 0){
        this.dialog.showAlert("Login username not found. please relogin and upload test again.");
        return false;
      }
      if(!this.isUploadExcelFile){
        this.dialog.showAlert("Please Upload Excel File");
        return false;
      }
      for(let i=0;i<this.excelRecords.length;i++){
        if(this.excelRecords[i] && this.excelRecords[i].length !=5 ){
            this.dialog.showAlert("Please Enter Data In Five Column.");
            return false;
        }
      }
      if(!this.isUploadQuestionPdfFile){
        this.dialog.showAlert("Plese Upload Question Paper Pdf.");
        return false;
      }

      // if(!this.isUploadReviewPdfFile){
      //   this.dialog.showAlert("Plese Upload Solution  File .");
      //   return false;
      // }

      if(this.excelRecordCount != this.questionPdfPageCount){
        this.dialog.showAlert("Question Count In Excel Not Match With Question Paper Pdf Page Count.");
        return false;
      }
      if(this.isUploadReviewPdfFile){
        if(this.excelRecordCount != this.reviewPdfPageCount){
          this.dialog.showAlert("Question Count In Excel Not Match With Solution Paper Pdf Page Count.");
          return false;
        }
        if(this.questionPdfPageCount != this.reviewPdfPageCount){
          this.dialog.showAlert("Question Paper Pdf Page Count Not Match With Solution Paper Pdf Page Count.");
          return false;
        }
      }
      if(!this.isValidExcelFile){
        this.dialog.showAlert("Something Going Wrong In Excel File Please Check It And Enter Correct Data.");
        return false;
      }
      return true;
    }
    public testId:string = "";
    public uploadTestToServer():void{
        try{
            let data =<OwntestUploaderJson>{};
            data.className       = this.classControl.value;
            data.patternName     = this.patternControl.value;
            data.subject         = this.subjectControl.value;
            data.testType        = this.testTypeControl.value;
            data.reviewFile      = (this.isUploadReviewPdfFile) ? this.reviewPdfBase64 : null;
            data.testFile        = this.questionPdfBase64;
            data.academicYear    = this.academicYearControl.value;
            data.username        = this.dataShare.ClassProfile.username;
            data.uniqueClassName = this.dataShare.ClassProfile.uniqueClassName;
            data.questions = new Array<OwnUploadQuestions>();
            this.isLoaded = true;
            this.allQuestions.forEach(row=>{
                if(row && row.length == 5){
                    let eachQuestion =<OwnUploadQuestions>{};
                    eachQuestion.subject = row[0].value;
                    eachQuestion.chapter = row[1].value;
                    eachQuestion.questionType = row[2].value;
                    eachQuestion.questionNumber = row[3].value;
                    eachQuestion.answer = row[4].value;
                    data.questions.push(eachQuestion);
                }
            });
            this.ownUploadService.uploadOwnTest(data).subscribe(this.testSubmitSuccessResponse.bind(this) , this.errorResponse.bind(this));
        }catch(e){
            this.isLoaded = false;
            this.dialog.showAlert(e);
        }
    }
    public testSubmitSuccessResponse(response:any):void{
        this.isLoaded = false;
        this.testId = "";
        if(response && response.result){
            let message =`${response.message}. Test Id = ${response.data.testId}`;
            this.dialog.showAlert(message);
            this.resetAppData();
        }else  if(response &&  response.message){
            this.dialog.showAlert(response.message);
        }
    }
    public errorResponse(error:HttpErrorResponse):void{
      this.isLoaded = false;
      let message:string = "";
      if(error.status == 0){
        message = AppConstant.NOCONNECT_RESPONSE;
      }else{
        message = error.message;
      }
      this.dialog.showAlert(message);
      console.log(error);
    }




    public uploadTest():void{
        if(this.isValidData()){
          this.uploadTestToServer();
        }
    }
    public isValidExcelFile:boolean = false;
    public displayExcelOnScreen(file:File):void{
        let reader:FileReader = new FileReader();
        try {
            reader.onload = (ev:ProgressEvent)=>{
                let excelBase64 = reader.result;
                this.isUploadExcelFile = true;
                this.excelRecords=this.excelService.importExcelAsJson(excelBase64);
                this.plotExcelRow(this.excelRecords);
                this.isValidExcelFile = this.validateExcelRows(this.allQuestions);
            }
            reader.onerror = (error:ProgressEvent)=>{
              this.isValidExcelFile = false;
              this.isValidExcelFile = false;
            }
            reader.readAsBinaryString(file);
        } catch (error) {
            console.log(error);

            this.dialog.showAlert(error);
        }

    }
    public plotExcelRow(excelData:Array<Array<string>>):Array<Array<CellInterface>>{
        this.allQuestions =[];
        try {
            if(excelData && excelData.length>0){
                excelData.forEach((row,index)=>{
                    if(index>0){
                        let eachRecord =[];
                        row.forEach((cell)=>{
                            let icell = <CellInterface>{};
                            icell.error='';
                            icell.expectedValue='';
                            icell.isCorrect=true;
                            icell.value=cell;
                            icell.background ="none";
                            eachRecord.push(icell);
                        });
                        if(row.length>0){
                            this.allQuestions.push(eachRecord);
                        }

                    }else if(index==0){
                        this.excelHeader = row;
                        // console.log(this.excelHeader);
                    }

                });
            }
        } catch (error) {
            console.log(error);

            this.dialog.showAlert(error);
        }
       return this.allQuestions;
    }
    public alphabetOnlyReg:RegExp = /^[A-Za-z]+$/;
    public chapterIdReg:RegExp = /^[A-Za-z]+[0-9]+$/;
    public questionTypeReg:RegExp=/^[123456]$/;
    public numberOnlyNumberReg:RegExp = /^[1-9][0-9]*$/;

    public answerReg:RegExp = /^((([A-Z-a-z])|(,[A-Za-z])*)|([-]?[0-9]+|((\.[0-9]+))*))+$/;

    public getSubjectListByGroup(groupName:string):string[]{
      switch(groupName.toUpperCase()){
        case "PC":
            return ['physics','chemistry'];
        case "PCB":
            return ['physics','chemistry','biology'];
        case "PCM":
            return ['physics','chemistry','mathematics'];
        case "PCMB":
            return ['physics','chemistry','mathematic','biology'];
        case 'PHYSICS':
              return ['physics'];
        case 'CHEMISTRY':
              return ['chemistry'];
        case 'MATHEMATICS':
              return ['mathematics'];
        case 'BIOLOGY':
              return ['biology'];
        default:
            return [];
      }
    }

    public subjectChangedHandler(value:string):void{
      if(this.allQuestions && this.allQuestions.length > 0){
        this.validateExcelRows(this.allQuestions);
      }
    }
    public resetAllRecords(questions:Array<CellInterface[]>):void{
      for(let question of questions){
        for(let sub of question){
          sub.isCorrect = true;
          sub.background = "none";
          sub.error ="";
        }
      }
      this.isValidExcelFile = true;
    }


    public validateExcelRows(records:Array<CellInterface[]>):boolean{
        let isValidExcel:boolean = true;
        try {
          this.resetAllRecords(this.allQuestions);
          let subjects:string[] = this.getSubjectListByGroup(this.subjectControl.value);
            records.forEach(rows=>{
                if(Array.isArray(rows) && rows.length==5){
                    if( !(rows[0].value && rows[0].value.trim().match(this.alphabetOnlyReg))){
                        rows[0].isCorrect=false;
                        rows[0].error="Enter Only Alphabets";
                        rows[0].background="red";
                        isValidExcel = false;
                    }else if(subjects.indexOf(rows[0].value.trim().toLowerCase()) == -1){
                      rows[0].isCorrect = false;
                      rows[0].error="Selected Subject Not Matched.";
                      rows[0].background="red";
                      isValidExcel = false;
                    }
                    if(!(rows[1].value && rows[1].value.trim().match(this.chapterIdReg))){
                        rows[1].isCorrect=false;
                        rows[1].error="Enter Valid Chapter Id. i.e.  P2";
                        rows[1].background="red";
                        isValidExcel= false;
                    }
                    if(!(rows[2].value && rows[2].value.toString().trim().match(this.questionTypeReg))){
                         rows[2].isCorrect=false;
                         rows[2].error="Question Type Should Be Between 1-6.";
                         rows[2].background="red";
                         isValidExcel = false;
                    }
                    if(!(rows[3].value && rows[3].value.toString().match(this.numberOnlyNumberReg))){
                        rows[3].isCorrect=false;
                        rows[3].error="Enter Only Numbers.";
                        rows[3].background="red";
                        isValidExcel = false;
                   }
                   if(!(rows[4].value!=null && rows[4].value!=undefined  && this.answerReg.test(rows[4].value))){
                        rows[4].isCorrect=false;
                        rows[4].error="Enter Valid Answer i.e => a or a,b,c or 1 or 1,2";
                        rows[4].background="red";
                        isValidExcel= false;
                    }
                }
            });
        } catch (error) {
            isValidExcel=false;
            console.log(error);
            this.dialog.showAlert(error);
        }
        this.isValidExcelFile = isValidExcel;
        return isValidExcel;
    }
    // download excel format
    public downloadExcelFormat():void{
        try {
            let rows = [];
            let columns = [
                            'Subject',
                            'Chapter',
                            'Question Type',
                            'Questin Number',
                            'Answer',

                        ];
                rows.push(columns);
            this.excelService.exportToExcel(rows,'KOSH Answersheet Template');
        } catch (error) {
            console.log(error);
            this.dialog.showAlert(error);
        }
    }
    public getDropedFile(ev:DragEvent):File{
        try {
            ev.preventDefault();
            let file:File  = null;
            if(ev.dataTransfer.items){
                if(ev.dataTransfer.items.length>1){
                    this.dialog.showAlert("Please Drag only One File.");
                    return;
                }
                for(let i =0;i<ev.dataTransfer.items.length;i++){
                    if(ev.dataTransfer.items[i].kind=='file'){
                        file = ev.dataTransfer.items[i].getAsFile();
                    }
                    break;
                }
            }else{
                if(ev.dataTransfer.files.length>1){
                    this.dialog.showAlert("Please Drag Only One File.");
                    return;
                }
                for(let i = 0;i<ev.dataTransfer.files.length;i++){
                    file= ev.dataTransfer.files[i];
                    break;
                }
            }
            if(file!=null){
                let ext = this.getFileExtension(file);
                if(ext && (ext.toLocaleLowerCase()=='xls'
                || ext.toLocaleLowerCase()=='xlsx')){
                    return file;
                }
                this.dialog.showAlert("Please Upload Only .xls or .xlsx File.!");
            }
        } catch (error) {
            console.log(error);
            this.dialog.showAlert(error);
        }
        return null;
    }
    public getFileExtension(file:File):string{
        try{
            if(file){
                let split = file.name.split(".");
                if(Array.isArray(split) && split.length>1){
                    return split[1].trim();
                }
            }
        }catch(e){
            this.dialog.showAlert(e);
        }
        return null;
    }
    public onDropHandler(ev:DragEvent,type:string):void{
        try {
            ev.preventDefault();
            let file:File  = null;
            if(ev.dataTransfer.items){
                if(ev.dataTransfer.items.length>1){
                    this.dialog.showAlert("Please Drag only One File.");
                    return;
                }
                for(let i =0;i<ev.dataTransfer.items.length;i++){
                    if(ev.dataTransfer.items[i].kind=='file'){
                        file = ev.dataTransfer.items[i].getAsFile();
                    }
                    break;
                }
            }else{
                if(ev.dataTransfer.files.length>1){
                    this.dialog.showAlert("Please Drag Only One File.");
                    return;
                }
                for(let i = 0;i<ev.dataTransfer.files.length;i++){
                    file= ev.dataTransfer.files[i];
                    break;
                }
            }
            if(file!=null){
                if(file.type=='application/pdf'){
                    this.readFile(file,type);
                    return;
                }
                this.dialog.showAlert("Please Upload Only PDF File.!");
            }
        } catch (error) {
            console.log(error);
            this.dialog.showAlert(error);
        }
    }
    public downloadQuestionPaperSolutionDocx():void{
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = 'assets/docx/KOSH Question Paper  Solution Word Template File.docx';
        link.download = "KOSH Question Paper  Solution Word Template File.docx"
        document.body.appendChild(link);
        link.click();
        link.remove();
    }


}
