import { Question } from './question-interface';
export interface Exam{
    examId:number;
    durationInSecond:number;
    subjectName:string;
    startDate:string;
    startTime:string;
    timetaken:string;
    outOfMarks:string;
    obtainedMarks:string;
    questions:Array<Question>;
}
