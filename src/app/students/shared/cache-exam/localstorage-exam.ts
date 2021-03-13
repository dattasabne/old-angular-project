import { ClassDetails } from "../../studenthomepage/class-detail";
import { ExamEntity } from "src/app/shared/entities/exam-entity";
import { StudentLoginData } from "../../studenthomepage/student-login-model";

export interface LocalStorageExam{
    classDetails:ClassDetails;
    examData:ExamEntity;
    userInfo:StudentLoginData;
    strictTime:boolean;
}
