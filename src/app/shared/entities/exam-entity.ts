import { Question } from "../../students/library/interfaces/question-interface";
import { TestAttempted } from 'src/app/website/model/test.attempted';
export interface ExamEntity {
  allBranchId:string;
  examId: string;
  testId: string;
  userName: string;
  subjectName: string;
  chapterName: string;
  date: string;
  startTime: string;
  startDate: string;
  duration: string;
  testType: string;
  academicYear: string;
  course: string;
  outOfMarks: string;
  patternName: string;
  testFile: string;
  uniqueClassName: string;
  dateTimeStamp: string;
  questions: Array<Question>;
  doFinalTest: boolean;
  subjectList: Array<any>;
  testStaus:string;
  remainingTime:number;
  className:string;
  assignmentType:string;
  testSubmitedDatetime:string;
  limitedTime:boolean;
  testAttemptedData:TestAttempted;
  testSolveStatus:string;
  assignmentDate:string;
  assignmentTime:string;
  answerList:AnswerList[];
  origenalAnswer:string;
}
export interface AnswerList{
  pkId:string;
	answer:string;
}
