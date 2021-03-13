import { ClassDetails } from "./class-detail";

export interface StudentLoginData {
  studentId: string;
  studentName: string;
  userName: string;
  emailId: string;
  mobileNo: string;
  passwor: string;
  cloudKey: string;
  uniqueClassName: string;
  address: string;
  batch: string;
  course: string;
  dateOfBirth: string;
  division: string;
  subDivision: string;
  gender: string;
  studentLock: boolean;
  classList: Array<ClassDetails>;
}
