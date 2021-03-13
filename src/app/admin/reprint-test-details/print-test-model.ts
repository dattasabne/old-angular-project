
export class PrintTestModel{
    public watermark:boolean;
    public professorName:string;
    public questionString:string = null;
    public className:string = null;
    public userName:string = null;
    public uniqueClassName:string = null;
    public batch:string = null;
    public course:string = null;
    public branch:string = null;
    public patternName:string = null;
    public subjectName:string = null;
    public testId:string = null;
    public paperVersionName:string = null;
    public teacherCopy:boolean = false;
    public mainPaperSet:boolean = false;
    public testType:string = null;


    public pdfFormat:boolean = false;
    public docxFormat:boolean = false;
    public testIdForPrinting:string ;
    public instituteName:string = '';
    public printProfessorName:boolean = false;
    public instituteSlogan:string = '';
    public printTestHeading:boolean = false;
    public testHeading:string = '';
    public printAddress:boolean = false;
    public address1:string = '';
    public address2:string = '';
    public printDate:boolean = false;
    public date:string = '';
    public startNumber:string = '';
    public printOptionAs:boolean = false;
    public printQuestionWithFourOption:boolean = false;
    public printExamYearAfterQuestion:boolean = false;
    public addOneSpaceAfterEachQuestion:boolean = false;
    public matrixNewPattern:boolean = false;
    public textWaterMark:boolean = false;
    public watermarkText:string = '';
    public pictureWatermark:boolean = false;
    public watermarkPicture:string = '';
    public watermarkSemiTransparent:boolean = false;
    public printClassLogo:boolean=false;
    public alignmentLeft:boolean=false;
    public alignmentRight:boolean = false;
    public classLogoImage:string = '';
    public singleColum:Columns;
    public doubleColumn:Columns;
    public printSolutionInOneColumn:boolean;
    public constructor(){
        this.singleColum = <Columns>{};
        this.doubleColumn = <Columns>{};
        this.doubleColumn.autoSetting = false;
        this.doubleColumn.fourOptionInOneLine = false;
        this.doubleColumn.oneOptionInOneLine = false;
        this.doubleColumn.twoOptionInOneLine = false;

        this.singleColum.autoSetting = false;
        this.singleColum.fourOptionInOneLine = false;
        this.singleColum.oneOptionInOneLine = false;
        this.singleColum.twoOptionInOneLine = false;
    }
}
export interface Columns{
    autoSetting:boolean;
    oneOptionInOneLine:boolean;
    twoOptionInOneLine:boolean;
    fourOptionInOneLine:boolean;
}

