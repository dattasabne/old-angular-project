import { SingleOption } from "../../../shared/entities/single-option";
export interface Question {
  pkId: string;
  options: Array<SingleOption>;
  section: string;
  origenalAnswer:string;
  subjectName: string;
  userName: string;
  nSquence: number;
  questionId: string;
  chapterId: string;
  questionType: number;
  patternName: string;
  className: string;
  testId: string;
  chapterName: string;
  subGroup: string;
  uniqueClassName: string;
  academicYear: string;
  testType: string;
  dateTimeStamp: string;
  index: string;
  isMarked: boolean;
  marked:boolean;
  background: string;
  status: string;
  singleAnswer: string;
  multipleAnswer: Array<string>;
  noOfVisit: number;

  timeTaken: number;
  border: string;
  color: string;
  visited: boolean;
  pid: string;
  correctQuestion: boolean;
  eachCorrectMarks: number;
  eachWrongMarks: number;
  matrixOptions:any;
  obtainedQuestionMarks:number;
  eachQuestionSec:number;
  questionStatus:number;
  markForReview:boolean;

}
