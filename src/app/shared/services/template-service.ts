import { Injectable } from "@angular/core";
import { StudentDetails } from "src/app/admin/entity/student-details";
import { ClassTemplates } from "src/app/admin/setting/messaging-settings/class_templates";

@Injectable({
  providedIn: "root"
})
export class TemplateService {
  public constructor() {}
  public getDefaultTemplateValues(): StudentDetails {
    let studentDetails = <StudentDetails>{};
    studentDetails.$class = "11th";
    studentDetails.academicYear = "Target 2020";
    studentDetails.address = "Kothrud Pune.";
    studentDetails.allBranchId = "42";
    studentDetails.allBranchRank = "2";
    studentDetails.allChapId = "PP3";
    studentDetails.assignmentDate = "10 March 2019";
    studentDetails.assignmentTime = "20:10";
    studentDetails.assignmentType = "Test";
    studentDetails.averageTime = "11";
    studentDetails.batch = "Target 2020";
    studentDetails.biologyRank = "1";
    studentDetails.biologyTotalMarks = "90";
    studentDetails.bloodGroup = "B+";
    studentDetails.branch = "Main";
    studentDetails.branchId = "0";
    studentDetails.branchRank = "2";
    studentDetails.category = "OBC";
    studentDetails.chapId = "P3";
    studentDetails.chapName = "Circular Motion";
    studentDetails.chemistryRank = "2";
    studentDetails.chemistryTotalMarks = "140";
    studentDetails.city = "Pune";
    studentDetails.cloudKey =
      "fIn64fYC-ko:APA91bFVLRds6-nPtoDqrlDDnHIU6wDDv-8IT5GmbTve1eefX_mMbmDpjBsDVBF9vU5c8KJn8g3rajjC4GNf-uSBqxVuzlGQWW9sK9ZPOtyEC7Lxk0aum9WxzFAfaYdxakaaX5pmmyg0";
    studentDetails.course = "Regular 2020";
    studentDetails.date = "2019-02-10 16:28:15.0";
    studentDetails.dateOfBirth = "07-05-1990";
    studentDetails.division = "A";
    studentDetails.divisionRank = "2";
    studentDetails.emailId = "kosh@gmail.com";
    studentDetails.endTime = "10:20:25";
    studentDetails.gender = "Male";
    studentDetails.id = "25";
    studentDetails.mathemeticsRank = "25";
    studentDetails.mathemeticsTotalMarks = "50";
    studentDetails.mobileNo = "9764263610";
    studentDetails.newAverageTime = "25";
    studentDetails.notAttemptedQuestion = "20";
    studentDetails.notVistedQuestion = "14";
    studentDetails.outOfMarks = "240";
    studentDetails.outOfQuestion = "60";
    studentDetails.password = "2030";
    studentDetails.patternName = "JEE/NEET";
    studentDetails.percentage = "56";
    studentDetails.physicsRank = "2";
    studentDetails.physicsTotalMarks = "120";
    studentDetails.pkId = "164167";
    studentDetails.rightQuestion = "38";
    studentDetails.solutionDate = "22 MARCH 2019";
    studentDetails.solutionTime = "12:20:45";
    studentDetails.stage = "1";
    studentDetails.startTime = null;
    studentDetails.studentId = "54845";
    studentDetails.studentName = "Nithul Sawantkumar";
    studentDetails.subDivision = "A1";
    studentDetails.subDivisionRank = "2";
    studentDetails.subName = "BIOLOGY";
    studentDetails.subjectGroup = "PCM";
    studentDetails.subjectName = "Physics";
    studentDetails.testDescription = "This Is Final Test.";
    studentDetails.testId = "10";
    studentDetails.timeSpend = "120";
    studentDetails.totalAttemptedQuestion = "0";
    studentDetails.totalMarks = "135";
    studentDetails.totalNegativeMarks = "17";
    studentDetails.totalPositiveMarks = "152";
    studentDetails.totalQuestion = "60";
    studentDetails.totalTime = "624";
    studentDetails.totalVisitedQuestion = "0";
    studentDetails.type = "Chapterwise";
    studentDetails.uniqueClassName = "Kosh Edutech";
    studentDetails.userName = "8625978092";
    studentDetails.visitCount = "10";
    studentDetails.wrongQuestion = "17";

    return studentDetails;
  }
  public getTemplatePreView(text: string, keys: any, data: any): string {
    keys.forEach((key: string) => {
      let pattern = "(\\{\\s*" + key.trim() + "\\s*\\})";
      if (/[\$]+/.test(key)) {
        pattern = "(\\{\\s*\\" + key.trim() + "\\s*\\})";
      }
      text = text.replace(new RegExp(pattern), data[key]);
    });
    return text;
  }
  public getStudentMessage(text: string, keys: any, data: any): string {
    keys.forEach((key: string) => {
      let pattern = "(\\{\\s*" + key.trim() + "\\s*\\})";
      if (/[\$]+/.test(key)) {
        pattern = "(\\{\\s*\\" + key.trim() + "\\s*\\})";
      }
      text = text.replace(new RegExp(pattern), data[key.trim()]);
    });
    return text;
  }
  public initStudentDataForTemplate(data: any): StudentDetails {
    let source: StudentDetails = <StudentDetails>{};
    for (let key in data) {
      if (
        key != "studentInfo" &&
        key != "assignment" &&
        key != "authentication"
      ) {
        source[key] = data[key];   
      }
    }
    for (let key in data.studentInfo) {
      if (!(source[key] && source[key].trim())) {
        source[key] = data.studentInfo[key];
      }
    }
    for (let key in data.assignment) {
      if (!(source[key] && source[key].trim())) {
        source[key] = data.assignment[key];
      }
    }
    for (let key in data.authentication) {
      if (!(source[key] && source[key].trim())) {
        source[key] = data.authentication[key];
      }
    }
    return source;
  }
}
