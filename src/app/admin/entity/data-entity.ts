import { StudentDetails } from "./student-details";
import { StudentAssignment } from "./student-assignment";
import { ClassDetails } from "./class-details";
export interface DataEntity {
  studentDetails: StudentDetails;
  studentAssignment: StudentAssignment;
  classDetails: ClassDetails;
}
