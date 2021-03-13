import { Injectable } from "@angular/core";
import { ExamEntity } from "../entities/exam-entity";
import { BehaviorSubject } from "rxjs";
import { ClassDetails } from "../../students/studenthomepage/class-detail";
import { ClassProfile } from "../model/class-profile-model";
import { TestAttempted } from 'src/app/website/model/test.attempted';

@Injectable({
  providedIn: "root"
})
export class DataShareService {
  public splitExam:ExamEntity[] = [];
  public get solvedPapers(): ExamEntity[] {
		return this._solvedPapers;
	}
  public set solvedPapers(value: ExamEntity[]) {
		this._solvedPapers = value;
	}
  private _solvedPapers:ExamEntity[];
  private examStartData: ExamEntity;
  private _examAttemptedData:TestAttempted;

  public get examAttemptedData(): TestAttempted {
		return this._examAttemptedData;
  }
  public set examAttemptedData(data:TestAttempted){
    this._examAttemptedData = data;
  }

  // public get splitExam(): ExamEntity[] {
	// 	return this._splitExam;
	// }
  // public set splitExam(value: ExamEntity[]) {
	// 	this._splitExam = value;
  // }




  private classDetails: ClassDetails;
  private classProfile:ClassProfile;
  private loginType = "web";
  public get LoginType():string{
    return this.loginType;
  }
  public set LoginType(type:string){
    this.loginType = type;
  }

  private goToHomePageByStudent:()=>void;
  public set GotoHomePageByStudents(fun:()=>void){
    this.goToHomePageByStudent = fun;
  }
  public get GotoHomePageByStudents():()=>void{
    return this.goToHomePageByStudent;
  }
  public set ClassProfile(profile:ClassProfile){
    this.classProfile = profile;
  }
  public get ClassProfile():ClassProfile{
    return this.classProfile;
  }

  public set ClassDetails(classDetails: ClassDetails) {
    this.classDetails = classDetails;
  }
  public get ClassDetails(): ClassDetails {
    return this.classDetails;
  }
  public classDetailsSubject: BehaviorSubject<
    ClassDetails
  > = new BehaviorSubject(null);
  public constructor() {
    this.examStartData = null;
  }
  public set ExamStartData(data: ExamEntity) {
    this.examStartData = data;
  }
  public get ExamStartData(): ExamEntity {
    return this.examStartData;
  }

}
