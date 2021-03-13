export interface GeneratedTest {
  patternName:string;
  standard:string;
  testType:string;
  subject:string;
  testId:number;
  noOfQuestions:number;
  totalMarksOfTest:number;
  testGenerationType:string;
  onlineStatus:string;
  batch:string;
  chapterName:string;
  date:string;
  course:string;
  branch:string;
  questionString:string
  className:string;
  testdescription:string;
  testDuration:number;
  assigned:boolean;
  onlineId:string;
  timeFormat:string;
  testUploadedType:string;
  status:string;
  courses:string[];
}

export interface GeneratedTestHeader {
pattern:string;
standard:string;
testType:string;
subject:string;
testId:string;
totQues:string;
totalMarksOfTest:string;
testGenerationType:string;
onlineStatus:string;
}



