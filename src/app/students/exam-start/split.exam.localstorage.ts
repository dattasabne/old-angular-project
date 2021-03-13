import { ExamEntity } from 'src/app/shared/entities/exam-entity';
import { ClassDetails } from '../studenthomepage/class-detail';

export interface SplitExamLocalStorage{
  submitExam :ExamEntity[],
  remainingExam:ExamEntity[],
  userName:string;
  classDetails:ClassDetails;
  strictTime:boolean;
}
