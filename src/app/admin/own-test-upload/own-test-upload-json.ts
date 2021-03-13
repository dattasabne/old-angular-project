export interface OwntestUploaderJson{
    patternName:string;
    className:string;
    testType:string;
    subject:string; 
    questions:Array<OwnUploadQuestions>;
    testFile:string;
    reviewFile:string;
    username:string,
    uniqueClassName:string,
    academicYear:string
}
export interface OwnUploadQuestions{
    subject:string;
    chapter:string;
    questionType:string;
    questionNumber:string;
    answer:string;
}