import { Injectable } from "@angular/core";
import { BranchNode } from '../model/branch.node';
import { StringUtility } from './string.utility';
import { FieldValidator } from '../model/field-validator';
import { AppPattern } from './app-pattern';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn:'root'
})
export class AssignmentService{
  public constructor(){}
  public shrinkAllControls(branches:BranchNode[]):void{
    if(!branches == null ){
      return;
    }
    for(let branch of branches ){
      branch.expandControls = false;
      if(branch.children.length > 0 ){
        this.shrinkAllControls(branch.children);
      }
    }
  }
  public getBranchById(branch:BranchNode ,branches:BranchNode[]):BranchNode{
    if(branch == null){
      return null;
    }
    let parent:BranchNode = null;
    for(let bran of branches){
      if(bran.id == branch.parentId){
        return bran;
      }
      if(bran.children.length != 0){
        parent =  this.getBranchById(branch,bran.children);
        if(parent != null && parent.id != "0"){
          return parent;
        }
      }
    }
    return parent;
  }
  public resetBranchData(branch:BranchNode):void{
    branch.course                  = [];
    branch.type                    = null;
    branch.assignmentDate          = null;
    branch.assignmentTime          = null;
    branch.availabaleTillDuration  = null;
    branch.availableTillDate       = null;
    branch.availableTillTime       = null;
    branch.isShuffle               = false;
    branch.isReAttempt             = false;
    branch.autoSubmitTestDuration  = null;
    branch.autoSubmitTestDate      = null;
    branch.autoSubmitTestTime      = null;
    branch.solutionReleaseDate     = null;
    branch.solutionReleaseDuration = null;
    branch.solutionReleaseTime     = null;
   }
   public copyParentDataToChild(parent:BranchNode, child:BranchNode):void{
    child.course = parent.course;
    child.type = parent.type;
    child.assignmentDate = parent.assignmentDate;
    child.assignmentTime = parent.assignmentTime;
    child.availabaleTillDuration = parent.availabaleTillDuration;
    child.availableTillDate = parent.availableTillDate;
    child.availableTillTime = parent.availableTillTime;
    child.isShuffle = parent.isShuffle;
    child.isReAttempt = parent.isReAttempt;
    child.autoSubmitTestDuration = parent.autoSubmitTestDuration;
    child.autoSubmitTestDate = parent.autoSubmitTestDate;
    child.autoSubmitTestTime = parent.autoSubmitTestTime;
    child.solutionReleaseDate = parent.solutionReleaseDate;
    child.solutionReleaseDuration = parent.solutionReleaseDuration;
    child.solutionReleaseTime = parent.solutionReleaseTime;
    //child.id = parent.id;
    //child.parentId = parent.parentId;
  }


  public isValidAvailableTillHourFormat(branch:BranchNode):boolean{

    if(StringUtility.isEmpty(branch.availableTillTime)){
      branch.controls.isValidAvailableTillTime = false;
      branch.controls.errorAvailableTillTime   = "Please Enter Test Available Till Time.";
      return false;
    }

    let validator = this.isNotZeroHour(branch.availableTillTime);
    if(validator.isValid == false){
      branch.controls.isValidAvailableTillTime = validator.isValid;
      branch.controls.errorAvailableTillTime   = validator.message;
      return false;
    }
    let date1:Date = new Date(branch.assignmentDate);
    let date2:Date = new Date(branch.availableTillDate);

    if(date2 < date1){
      branch.controls.isValidAvailableTillDate = false
      branch.controls.errorAvailableTillDate  = " Available Till Date Should Not Less Than Assignment Date.";
      return false;
    }
    branch.controls.isValidAvailableTillTime = true;
    branch.controls.errorAvailableTillTime   = "";
    return true;
  }


  public isNotZeroHour(data:string):FieldValidator{
    let validator:FieldValidator = <FieldValidator>{};
    if(StringUtility.isEmpty(data)){
      validator.isValid = false;
      validator.message = "Hour Field Is Empty."
      validator.returnValue = false;
      return validator;
    }
    if(/^[0-9][0-9]:[0-9][0-9]$/.test(data)){
      let split = data.split(":");
      if(split && split.length == 2){
        let hour:number = Number(split[0]);
        let minute:number = Number(split[1]);
        let totalMinutes:number =((hour * 60) + minute);
        let minuteInDay:number = (24 * 60);
        if(totalMinutes > minuteInDay){
          validator.isValid = false;
          validator.message = "Invalid Time Format."
          validator.returnValue = false;
          return validator;
        }else{
          validator.isValid = true;
          validator.message = ""
          validator.returnValue = true;
          return validator;
        }
      }
    }else{
        validator.isValid = false;
        validator.message = "Invalid Hour Format.";
        validator.returnValue = false;
        return validator;
    }
  }

  public isValidTestAutoSubmitTimeFormat(branch:BranchNode):boolean{
    if(StringUtility.isEmpty(branch.autoSubmitTestTime)){
      branch.controls.isValidTestAutoSubmitTime = false;
      branch.controls.errorTestAutoSubmitTime   = "Please Enter Test Auto Submit Time.";
      return false;
    }
    let validator:FieldValidator = this.isNotZeroHour(branch.autoSubmitTestTime);
    if(!validator.isValid){
      branch.controls.isValidTestAutoSubmitTime = validator.isValid;
      branch.controls.errorTestAutoSubmitTime   = validator.message;
      return validator.returnValue;
    }
    let assignmentDate:Date = new Date(branch.assignmentDate);
    let autoSubmitDate:Date = new Date(branch.autoSubmitTestDate);
    if(autoSubmitDate < assignmentDate){
      branch.controls.isValidTestAutoSubmitDate = false;
      branch.controls.errorTestAutoSubmitDate   = "Auto Submit Date Should Not Be Less Than  Assignment Date";
      return false;
    }else{
      branch.controls.isValidTestAutoSubmitDate = true;
      branch.controls.errorTestAutoSubmitDate = "";
    }


    branch.controls.isValidTestAutoSubmitTime = true;
    branch.controls.errorTestAutoSubmitTime   = "";
    return true;
  }
  public isValidTestDateTimeFormat(branch:BranchNode):boolean{
    if(StringUtility.isEmpty(branch.assignmentTime)){
      branch.controls.isValidTestTime = false;
      branch.controls.errorTestTime   = "Please Enter Test Time.";
      return false;
    }
    let validator = this.isNotZeroHour(branch.assignmentTime);
    if(validator.isValid == false){
      branch.controls.isValidTestTime = validator.isValid;
      branch.controls.errorTestTime   = validator.message;
      return false;
    }
    branch.controls.isValidTestTime = true;
    branch.controls.errorTestTime   = "";
    return true;
  }
  public isValidTestDate(branch:BranchNode):boolean{
    if(StringUtility.isEmpty(branch.assignmentDate)){
      branch.controls.isValidTestDate = false;
      branch.controls.errorTestDate   = "Please Select Test Date.";
      return false;
    }
    branch.controls.isValidTestDate = true;
    branch.controls.errorTestDate   = "";
    return true;
  }
  public isValidTestType(branch:BranchNode ):boolean{
    if(StringUtility.isEmpty(branch.type)){
      branch.controls.isValidTestType = false;
      branch.controls.errorTestType   = "Please Select Test Type.";
      return false;
    }
    branch.controls.isValidTestType = true;
    branch.controls.errorTestType   = "";
    return true;
  }


  public isValidCourse(branch:BranchNode):boolean{
    if(StringUtility.isEmpty(branch.course)){
      branch.controls.isValidCourse = false;
      branch.controls.errorCourse   = "Please Select At Least One Course.";
      branch.isValidBranch = false;
      return false;
    }
    branch.controls.isValidCourse = true;
    branch.controls.errorCourse   = "";
  }
  public isValidSolutionReleaseHourFormat(branch:BranchNode):boolean{
    if(StringUtility.isEmpty(branch.solutionReleaseTime)){
      branch.controls.isValidSolutionReleaseTime = false;
      branch.controls.errorSolutionReleaseTime   = "Please Enter Test Release Time.";
      return false;
    }
    let validator = this.isNotZeroHour(branch.solutionReleaseTime);
    if(validator.isValid == false){
      branch.controls.isValidSolutionReleaseTime = validator.isValid;
      branch.controls.errorSolutionReleaseTime   = validator.message;
      return false;
    }
    let assignmentDate:Date  = new Date(branch.assignmentDate);
    let solutionReleaseDate  = new Date(branch.solutionReleaseDate);

    if(solutionReleaseDate < assignmentDate){
      branch.controls.isValidSolutionReleaseDate = false;
      branch.controls.errorSolutionReleaseDate   = "Solution Release Date Should Not Less Than Assignment Date.";
      return false;
    }
    branch.controls.isValidSolutionReleaseTime = true;
    branch.controls.errorSolutionReleaseTime   = "";
    return true;
  }

  public isValidSingleBranch(branch:BranchNode):boolean{
    this.isValidCourse(branch);
    this.isValidTestType(branch);
    this.isValidTestDate(branch)
    this.isValidTestDateTimeFormat(branch)
    this.isValidAvailableTillHourFormat(branch)
    this.isValidSolutionReleaseHourFormat(branch)
    this.isValidTestAutoSubmitTimeFormat(branch);

    let isvalid:boolean = (
        branch.controls.isValidTestAutoSubmitTime
        && branch.controls.isValidCourse
        && branch.controls.isValidTestType
        && branch.controls.isValidTestDate
        && branch.controls.isValidTestTime
        && branch.controls.isValidAvailableTillTime
        && branch.controls.isValidSolutionReleaseTime);
        branch.isValidBranch = isvalid;
        return isvalid;
  }
  public removeAllChildData(branches:BranchNode[]){
    for(let branch of branches){
      if(branch.selected == false){
        for(let child of branch.children){
          if(child.doChange == false){
            this.resetBranchData(child);
          }
          this.removeAllChildData(child.children);
        }
      }
    }
  }

  public onlyHourNumber( time:string , key:KeyboardEvent):string{
    if(StringUtility.isEmpty(time)){
      if(!/^[0-9]$/.test(key.key)){
        key.preventDefault();
        return time;
      }else{
        time ="";
        if(/^[^0-2]$/.test(key.key)){
          time += "0" + key.key + ":";
          key.preventDefault();
          return time;
        }
      }
    }

    if(time.length ==1){
      if(!/^[0-9]$/.test(key.key)){
        key.preventDefault();
        return time;
      }else{
        let num = Number(time + key.key);
        if(num >= 24){
          time += key.key + ":00";
          key.preventDefault();
          return time;
        }
        time += key.key + ":";
        key.preventDefault();
        return time;
      }
    }
    if(time.length == 5 ){
      key.preventDefault();
    }
    return time;
  }
  public timeFormat(time:string):string{
    if(StringUtility.isEmpty(time)){
      time = "00:00";
      return time;
    }
    if(time.trim().length == 1 && StringUtility.isNumber(time)){
      time = "0" + time + ":00";
      return time;
    }
    if(time.trim().length == 2){
      if(/^[0-9][0-9]$/.test(time)){
        time = time + ":00";
        return time;
      }
    }
    if(time.trim().length == 4){
      if(/^[0-9][0-9]:[0-9]$/.test(time)){
        let split = time.split(":");
        if(split){
          time = split[0]+":"+"0"+split[1];
          return time;
        }
      }
    }
    if(/^([0-9][0-9]:.*)$/.test(time) && time.trim().length <= 3){
      time = time.concat("00");
      return time;
    }
    return time;
  }

  public createHourFormatFromTotalMinutes(totalMinutes:number):string{
    let hourFormat:string = "";
    if(StringUtility.isEmpty(totalMinutes)){
      hourFormat = "00:00";
      return hourFormat;
    }
    let hour:number = Math.trunc(totalMinutes / 60);
    let minutes     = Math.trunc(totalMinutes % 60);
    if( Math.trunc(hour / 10) == 0){
      hourFormat = hourFormat.concat("0").concat(hour.toString()).concat(":");
    }else{
      hourFormat = hourFormat.concat(hour.toString()).concat(":");
    }
    if(Math.trunc(minutes / 10 ) == 0){
      hourFormat = hourFormat.concat("0").concat(minutes.toString());
    }else{
      hourFormat = hourFormat.concat(minutes.toString());
    }
    return hourFormat;
  }
  public getTotalMinuteFromHourFormat(str:string):number{
    if(!str){
      return 0;
    }
    let splitTime:string[] = str.split(":");
    if(!splitTime || splitTime.length !=2 ){
      return 0;
    }
    let hour:number = Number(splitTime[0]);
    let minutes:number = Number(splitTime[1]);
    let totalMinutes:number = ((hour*60) + minutes);
    return totalMinutes;
  }
  public isValidHHMM(time:string):boolean{
    return (/^[0-9][0-9][:][0-9][0-9]$/).test(time);
  }
}
