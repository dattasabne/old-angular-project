import { Question } from '../../library/interfaces/question-interface';
import { ExamConstants } from '../../library/interfaces/exam-constants';

export class ExamUtility{
  public constructor(){}
  public static getColorByMarks(question:Question):string{
    if(question.obtainedQuestionMarks > 0){
      return "#66CD00";
    }else if(question.obtainedQuestionMarks < 0){
      return "red";
    }else{
      return "black";
    }
  }
}
