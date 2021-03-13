import { Injectable } from "@angular/core";

@Injectable({
  providedIn:'root'
})
export class DataService{
  private _autoSubmitOption:string[] = null;
  private _instituteCourses:string[] = null;
  private _testType:string[]         = null;
  private _testAvailableTill:string[] = null;
  private _testReleaseDate:string[] = null;
  public constructor(){
    this._autoSubmitOption = ['Test End Time','Strict End Time','End Time +15 Mins','End Time +30 Mins','Custom'];
    this._instituteCourses = ['Regular 2020','Regular 2021']; // should be dynamic



    this._testType = ['Test','Homework Test','Class Work Test'];
    this._testAvailableTill = ['Forever','15 Mins','30 Mins','1 Hour','2 Hour','3 Hour','12 Hour','1 Day','2 Days','3 Days','1 Week','2 Weeks','1 Month','Custom'];
    this._testReleaseDate = ['After Test','Any Time','After 1hr','After 3hr','After 12hr','After 1 Day','Custom'];
  }
  public get autoSubmitOption(): string[]  {
		return this._autoSubmitOption;
	}
  public set autoSubmitOption(value: string[] ) {
		this._autoSubmitOption = value;
  }
  public get instituteCourses(): string[]  {
		return this._instituteCourses;
	}

  public get testType(): string[]          {
		return this._testType;
	}
  public get testAvailableTill(): string[]  {
		return this._testAvailableTill;
	}
  public get testReleaseDate(): string[]  {
		return this._testReleaseDate;
	}
  public set instituteCourses(value: string[] ) {
		this._instituteCourses = value;
	}
  public set testType(value: string[]         ) {
		this._testType = value;
	}
  public set testAvailableTill(value: string[] ) {
		this._testAvailableTill = value;
	}
  public set testReleaseDate(value: string[] ) {
		this._testReleaseDate = value;
	}


}
