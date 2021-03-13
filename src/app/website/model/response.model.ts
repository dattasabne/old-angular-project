import { Question } from './../../students/library/interfaces/question-interface';
import { TestAttempted } from './test.attempted';

export interface ResponseModel{
  result:boolean;
  message:string;
  data:any;
  error_type:string;
  testAttemptedData:TestAttempted;
  questionData:Question[];
  topperData:any;

}
