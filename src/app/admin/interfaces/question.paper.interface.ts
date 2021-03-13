
export interface PrintQuestionPaper{
    testId:string;
    pattern:string;
    subject:string;
    testType:string;
    testCreatedDate:string;
    printingQuestionPaper:Array<PrintingQuestionPaperDetails>
    questionPaperSolution:OwnUploadResponse;
}
export interface PrintingQuestionPaperDetails{
    srNo:string;
    setName:string;
    mainSet:boolean;
    questionPaper:QuestionPaper;
    teachersCopy:QuestionPaper;
}
export interface QuestionPaper{
    wordFile:string;
    pdfFile:string;
    wordFileAvailable:boolean;
    pdfFileAvailable:boolean;
    wordCreatedOn:string;
    pdfCreatedOn:string;
    testId:string;
} 
export interface QuestionPaperSolution{
    preparation:string;
    testId:string;
    subjectName:string;
    testType:string;
    questionPaperPdf:string;
    solutionPdf:string;
    testCreatedOn:string;
    isQuestionPdfExist:boolean;
    isSolutionPdfExist:boolean;
}
export interface  OwnUploadResponse{
    preparation:string;
    questionPaper:OwnUploadDocument;
    solutionPaper:OwnUploadDocument;
    action:string;
    assignmentId:string;
    assignmentDate:string;
   
}
export interface OwnUploadDocument{
    paperName:string;
    pdfFileExist:string;
    pdfFile:string;
    fileName:string;
}


