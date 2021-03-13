
import { FunctionReffernceModel } from './../../website/model/function.refference.model';
import { FieldData } from './../../website/model/field-validator';
import { Component, AfterViewInit, OnInit, Input } from "@angular/core";
import { BranchNode } from 'src/app/website/model/branch.node';
import { MatCheckboxChange,  MatSelectChange } from '@angular/material';
import { DataService } from 'src/app/website/data-service/data.service';
import { AssignmentService } from 'src/app/website/utility-service/assignment.service';
import { StringUtility } from 'src/app/website/utility-service/string.utility';
import { AssignmentAssignedDataModel } from '../student-assignmnet/data-model/assignment.assignform.model';
@Component({
  selector:'assignment-tree-template',
  templateUrl:'./assignment.tree.template.html',
  styleUrls:['./assignment.tree.template.css']
})
export class AssignmentTreeTemplate  implements OnInit , AfterViewInit{
    public allBranches:BranchNode[] = [];
    public constructor(public dataservice:DataService ,
    private assignmentService:AssignmentService){}
    public static branchReff:BranchNode[] = null;
    public static assignmentData:AssignmentAssignedDataModel = <AssignmentAssignedDataModel>{};
    public static functionReff:FunctionReffernceModel = <FunctionReffernceModel>{};
    ngAfterViewInit(){}
    ngOnInit(){
    }
    @Input("branchReff")
    public set basicBranchReff(branches:BranchNode[]){
      AssignmentTreeTemplate.branchReff = branches;
    }
    @Input("childern")
    public set children(childNodes:BranchNode[]){
      this.allBranches = childNodes;
    }
    @Input("assignmentData")
    public set assignmentDataSetter(assignment:AssignmentAssignedDataModel){
      AssignmentTreeTemplate.assignmentData = assignment;
    }
    @Input("functionReff")
    public set functionRefference(refference:FunctionReffernceModel){
      AssignmentTreeTemplate.functionReff = refference;
    }
    public shuffleCheckBoxChanges(branch:BranchNode , checkBox:MatCheckboxChange):void{
      branch.isShuffle = checkBox.checked;
    }
    public reattempCheckBoxChanges(branch:BranchNode , checkBox:MatCheckboxChange):void{
      branch.isReAttempt = checkBox.checked;
    }
    public treeToggle(branch:BranchNode):void{
      if(branch.expand == false){
        branch.expand = true;
      }else{
        if(branch.parentId == "-1"){
          this.assignmentService.shrinkAllControls(AssignmentTreeTemplate.branchReff);
          branch.expandControls = true;
        }
        branch.expand = false;
      }
    }
    public onlyNumber_KeyPressEventHandler(time:string, ev:KeyboardEvent):string{
       return this.assignmentService.onlyHourNumber(time,ev);
    }
    public dateTimeCalculation(date:string, time:string):FieldData{
      let data:FieldData = <FieldData>{};
      try{
        data.timeFormat = this.assignmentService.timeFormat(time);
        let totalMinute:number = this.assignmentService.getTotalMinuteFromHourFormat(data.timeFormat);
        let day:number = Math.floor(totalMinute / (24 *60));
        let remaining:number = totalMinute % (24 *60);
        let newDate :Date = new Date(date);
        newDate.setDate(newDate.getDate() + day);
        data.newDate = newDate.toISOString();
        data.timeFormat = this.assignmentService.createHourFormatFromTotalMinutes(remaining);
      }catch(ex){
        alert(ex);
      }
      return data;
    }

    public lostFocusAssignmentTime(branch:BranchNode):void{
      branch.assignmentTime = this.assignmentService.timeFormat(branch.assignmentTime);
      this.commonChangeDataChangeFunction(branch);
    }
    public lostFocusAvailableTillTime(branch:BranchNode):void{
        branch.availableTillTime = this.assignmentService.timeFormat(branch.availableTillTime);
        if(branch.availabaleTillDuration.trim().toUpperCase() == "custom".trim().toUpperCase()){
          let testTotalMinutes:number = this.getTotalTestMinutes(branch);
          let customMinutes:number = this.assignmentService.getTotalMinuteFromHourFormat( branch.availableTillTime);
          let totalMinutes:number  = (testTotalMinutes + customMinutes);
          let timeFormat:string    = this.assignmentService.createHourFormatFromTotalMinutes(totalMinutes);
          let data:FieldData = this.dateTimeCalculation(branch.assignmentDate,timeFormat);
          branch.availableTillDate = data.newDate;
          branch.availableTillTime = data.timeFormat;
        }
        this.validateFields();
    }
    public lostFocusSolutionReleaseTime(branch:BranchNode):void{
      branch.solutionReleaseTime = this.assignmentService.timeFormat(branch.solutionReleaseTime);
      if(branch.solutionReleaseDuration.trim().toUpperCase() == "custom".trim().toUpperCase()){
        let testTotalMinutes:number = this.getTotalTestMinutes(branch);
        let customMinutes:number = this.assignmentService.getTotalMinuteFromHourFormat( branch.solutionReleaseTime);
        let totalMinutes:number  = (testTotalMinutes + customMinutes);
        let timeFormat:string    = this.assignmentService.createHourFormatFromTotalMinutes(totalMinutes);
        let data:FieldData = this.dateTimeCalculation(branch.assignmentDate,timeFormat);
        branch.solutionReleaseDate = data.newDate;
        branch.solutionReleaseTime = data.timeFormat;
      }
      this.validateFields();
    }
    public lostFocusAutoSubmitTime(branch:BranchNode):void{
      branch.autoSubmitTestTime = this.assignmentService.timeFormat(branch.autoSubmitTestTime);
      if(branch.autoSubmitTestDuration.trim().toUpperCase() == "custom".trim().toUpperCase()){
        let testTotalMinutes:number = this.getTotalTestMinutes(branch);
        let customMinutes:number = this.assignmentService.getTotalMinuteFromHourFormat( branch.autoSubmitTestTime);
        let totalMinutes:number  = (testTotalMinutes + customMinutes);
        let timeFormat:string    = this.assignmentService.createHourFormatFromTotalMinutes(totalMinutes);
        let data:FieldData = this.dateTimeCalculation(branch.assignmentDate,timeFormat);
        branch.autoSubmitTestDate = data.newDate;
        branch.autoSubmitTestTime = data.timeFormat;
      }
      this.validateFields();
    }
    public autoSubmitCustomHourFormat(branch:BranchNode):void{
      let endTime:number   = this.assignmentService.getTotalMinuteFromHourFormat(branch.assignmentTime);
      let totalTime:number =  (AssignmentTreeTemplate.assignmentData.duration + endTime);
      this.validateFields();
    }
    public testTypeSelect_Change(select:MatSelectChange):void{
        let value:string = (<string>select.value).toUpperCase();
        switch(value){
          case "TEST":
                break;
          case "HOMEWORK TEST":
                break;
          case "CLASS WORK TEST":
                break;
        }
        this.validateFields();
    }
    public createDurationHourFormat(testDuration:number , time:string):string{
      let endTime:number = (this.assignmentService.getTotalMinuteFromHourFormat(time) + testDuration);
      return this.assignmentService.createHourFormatFromTotalMinutes(endTime);
    }
    public calculateCustomHourFormat( nature: string, hourFormat: string , testEndTime: number):string{
      if(StringUtility.isEmpty(nature) || !this.assignmentService.isValidHHMM(hourFormat)){
        return this.assignmentService.createHourFormatFromTotalMinutes(testEndTime);
      }
      switch(nature.toUpperCase()){
        case "Custom".toUpperCase():
            let customMinutes:number = this.assignmentService.getTotalMinuteFromHourFormat(hourFormat);
            return this.assignmentService.createHourFormatFromTotalMinutes(testEndTime + customMinutes);
      }
      return this.assignmentService.createHourFormatFromTotalMinutes(testEndTime);
    }
    public testAutoSubmitHourCalculation(branch:BranchNode , value:string):void{
      let timeFormat:string = null;
      branch.controls.isReadOnlyAutoSubmitTime = true;
      switch(value.toUpperCase()){
        case this.dataservice.autoSubmitOption[0].toUpperCase(): // TEST END TIME
            timeFormat = this.createDurationHourFormat(AssignmentTreeTemplate.assignmentData.duration,branch.assignmentTime);
            break;
        case this.dataservice.autoSubmitOption[1].toUpperCase(): // STRICT END TIME
            branch.autoSubmitTestTime = this.createDurationHourFormat(AssignmentTreeTemplate.assignmentData.duration,branch.assignmentTime);
            break;
        case this.dataservice.autoSubmitOption[2].toUpperCase(): // END TIME + 15 MINS
            timeFormat  = this.createDurationHourFormat((AssignmentTreeTemplate.assignmentData.duration + 15),branch.assignmentTime);
            break;
        case this.dataservice.autoSubmitOption[3].toUpperCase(): // END TIME + 30 MINS
            timeFormat  = this.createDurationHourFormat((AssignmentTreeTemplate.assignmentData.duration + 30),branch.assignmentTime);
            break;
        case this.dataservice.autoSubmitOption[4].toUpperCase(): // CUSTOM
            //branch.autoSubmitTestTime = this.calculateCustomHourFormat(value,branch.autoSubmitTestTime,AssignmentTreeTemplate.assignmentData.duration);
            timeFormat = "";
            branch.controls.isReadOnlyAutoSubmitTime = false;
            break;
        default:
            alert("Not Matched");
      }
      if(timeFormat != null){
        let data:FieldData = this.dateTimeCalculation(branch.assignmentDate , timeFormat);
        branch.autoSubmitTestTime = data.timeFormat;
        branch.autoSubmitTestDate = data.newDate;
      }
      this.validateFields();
    }
    public getTotalTestMinutes(branch:BranchNode):number{
      let testDuration:number = AssignmentTreeTemplate.assignmentData.duration;
      if(StringUtility.isEmpty(branch.assignmentTime)){
        return testDuration;
      }
      return (this.assignmentService.getTotalMinuteFromHourFormat(branch.assignmentTime) + testDuration);
    }
    public testAvailableTillHourCalculation(branch:BranchNode , value:string):void{
      let testEndHourFormat:string = null;
      branch.controls.isReadOnlyAvailableStillTime = true;
      switch(value.toUpperCase()){
        case this.dataservice.testAvailableTill[0].toUpperCase(): // FOREVER
              testEndHourFormat = "00:00";
              break;
        case this.dataservice.testAvailableTill[1].toUpperCase():  // 15 MINS
              testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + 15);
              break;
        case this.dataservice.testAvailableTill[2].toUpperCase(): // 30 MINS
              testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + 30);
              break;
        case this.dataservice.testAvailableTill[3].toUpperCase(): // 1 HOUR
              testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + 60);
              break;
        case this.dataservice.testAvailableTill[4].toUpperCase(): // 2 HOUR
              testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + (2 * 60));
              break;
        case this.dataservice.testAvailableTill[5].toUpperCase(): // 3 HOUR
              testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + (3 * 60));
              break;
        case this.dataservice.testAvailableTill[6].toUpperCase(): // 12 HOUR
              testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + (12 * 60));
              break;
        case this.dataservice.testAvailableTill[7].toUpperCase(): // 1 DAY
              testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + ( 1 * 24  * 60));
              break;
        case this.dataservice.testAvailableTill[8].toUpperCase(): // 2 DAY
              testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + ( 2 * 24  * 60));
              break;
        case this.dataservice.testAvailableTill[9].toUpperCase(): // 3 DAY
              testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + ( 3 * 24  * 60));
              break;
        case this.dataservice.testAvailableTill[10].toUpperCase(): // 1 WEEK
              testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + (1 * 7 * 24  * 60));
              break;
        case this.dataservice.testAvailableTill[11].toUpperCase(): // 2 WEEK
             testEndHourFormat = this .assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch) + (2 * 7 * 24  * 60));
             break;
        case this.dataservice.testAvailableTill[12].toUpperCase(): // 1 MONTH
               let date = new Date(branch.assignmentDate);
               date.setMonth(date.getMonth() + 1);
               branch.availableTillDate = date.toISOString();
               branch.availableTillTime = this.assignmentService.createHourFormatFromTotalMinutes(this.getTotalTestMinutes(branch));
               return;
        case this.dataservice.testAvailableTill[13].toUpperCase():
              branch.controls.isReadOnlyAvailableStillTime = false;
              branch.availableTillTime = "00:00";
              break;
      }
      if(testEndHourFormat != null){
        let  data:FieldData = this.dateTimeCalculation(branch.autoSubmitTestDate , testEndHourFormat);
        branch.availableTillDate = data.newDate;
        branch.availableTillTime = data.timeFormat;
      }
      this.validateFields();
    }
    public testSolutionReleaseHourCalculation(branch:BranchNode , value:string):void{
      let timeFormat:string = null;
      let minutes:number = 60;
      let testTotalMinutes:number = this.getTotalTestMinutes(branch);
      branch.controls.isReadOnlySolutionReleaseTime = true;
      switch(value.toUpperCase()){
        case this.dataservice.testReleaseDate[0].toUpperCase(): // AFTER TEST
            timeFormat  = this.assignmentService.createHourFormatFromTotalMinutes(testTotalMinutes);
            break;
        case this.dataservice.testReleaseDate[1].toUpperCase(): // ANY TIME
            timeFormat  = this.assignmentService.createHourFormatFromTotalMinutes(0);
            break;
        case  this.dataservice.testReleaseDate[2].toUpperCase(): // AFTER 1HR
              timeFormat = this.assignmentService.createHourFormatFromTotalMinutes(testTotalMinutes + (minutes * 1));
            break;
        case  this.dataservice.testReleaseDate[3].toUpperCase(): // AFTER 3HR
              timeFormat = this.assignmentService.createHourFormatFromTotalMinutes(testTotalMinutes + (minutes * 3));
              break;
        case  this.dataservice.testReleaseDate[4].toUpperCase(): // AFTER 12HR
              timeFormat  = this.assignmentService.createHourFormatFromTotalMinutes(testTotalMinutes + (minutes * 12));
            break;
        case  this.dataservice.testReleaseDate[5].toUpperCase(): // AFTER 1 DAY
              timeFormat  = this.assignmentService.createHourFormatFromTotalMinutes(testTotalMinutes + (minutes * 24));
            break;
        case this.dataservice.testReleaseDate[6].toUpperCase(): // CUSTOM
            timeFormat = "00:00";
            branch.controls.isReadOnlySolutionReleaseTime = false;
            break;
      }

      if(timeFormat != null){
          let data:FieldData = this.dateTimeCalculation(branch.autoSubmitTestDate,timeFormat);
          branch.solutionReleaseDate = data.newDate;
          branch.solutionReleaseTime = data.timeFormat;
      }
      this.validateFields();
    }
    public commonChangeDataChangeFunction(branch:BranchNode):void{
      this.testAutoSubmitHourCalculation(branch,branch.autoSubmitTestDuration);
      this.testAvailableTillHourCalculation(branch,branch.availabaleTillDuration);
      this.testSolutionReleaseHourCalculation(branch,branch.solutionReleaseDuration);
      this.validateFields(); // this function call validation function of parent component

    }
    public validateFields():void{
      let funReff = AssignmentTreeTemplate.functionReff;
      if( funReff != null){
        if(funReff.validate != null && typeof funReff.validate == 'function'){
          funReff.validate(AssignmentTreeTemplate.branchReff);
        }
      }
    }





    public testAutoSubmitDurationSelect_Change(branch:BranchNode , select:MatSelectChange):void{
        let  value:string = (select.value as string).toUpperCase();
        this.testAutoSubmitHourCalculation(branch,value);
    }
    public testAvailableTillDurationSelect_Change(branch:BranchNode, select:MatSelectChange):void{
        let value:string = (select.value as string).toUpperCase();
        this.testAvailableTillHourCalculation(branch,value);
    }

    public testSolutionReleaseDurationSelect_Change(branch:BranchNode , select:MatSelectChange):void{
      let value:string = (select.value as string).toUpperCase();
      this.testSolutionReleaseHourCalculation(branch,value);
    }


    public selectBranchCheckBox_Change(branch:BranchNode , checkBox:MatCheckboxChange):void{
      branch.selected = checkBox.checked;
      if(branch.selected == false && branch.parentId != "-1"){
        branch.doChange = branch.sameAsParent = branch.expandControls = false;
      }
      if(branch.selected){
        this.selectAllChild(branch);
      }else{
        this.deselectAllChild(branch);
      }
      this.deselectParent(branch);
      // this.copyParentNodeValueToTheireChild(AssignmentTreeTemplate.branchReff);

    }
    public changesCheckBox_Change(branch:BranchNode, checkBox:MatCheckboxChange):void{
      branch.selected = true;
      this.copyOnlyParentData(branch);
      if(checkBox.checked){
        this.assignmentService.shrinkAllControls(AssignmentTreeTemplate.branchReff);
        branch.doChange = branch.expandControls = true;
        branch.sameAsParent = false;


      }else{
        branch.sameAsParent = true;
        branch.doChange = branch.expandControls = false;
      }

    }
    public clickOnBranch(branch:BranchNode,checkBox:MatCheckboxChange = null):void{
        if(branch.parentId == "-1" && branch.expandControls == false){
          this.assignmentService.shrinkAllControls(AssignmentTreeTemplate.branchReff);
          branch.expandControls = true;
        }else{
          if(branch.doChange && branch.selected){
            this.assignmentService.shrinkAllControls(AssignmentTreeTemplate.branchReff);
            branch.expandControls = true;
          }
        }
    }

    public selectAllChild(branches:BranchNode){
      for(let branch of branches.children){
        this.selectAllChild(branch);
        branch.selected = true;
        branch.partialSelect = false;
      }
    }

    public deselectParent(branch:BranchNode):void{
      let parent:BranchNode = this.assignmentService.getBranchById(branch,AssignmentTreeTemplate.branchReff);
      let count:number = 0;

      if(parent != null){
          for(let child of parent.children){
            if(child.selected){
              ++count;
            }
          }
          if(count == 0){
            parent.selected = false;
            parent.partialSelect = false;
            this.deselectParent(parent);
          }else if(count == parent.children.length){
            parent.selected = true;
            parent.partialSelect = false;
           this.deselectParent(parent);
          }else{
            this.makePartialParentNode(parent);
          }
      }
    }



    public deselectAllChild(branch:BranchNode):void{
      for(let child of branch.children){
          child.selected = false;
          this.deselectAllChild(child);
      }
    }

    public makePartialParentNode(branch:BranchNode):void{
      if(branch == null){
        return;
      }
      do{
          branch.partialSelect = true;
          branch.selected      = false;

      }while((branch = this.assignmentService.getBranchById(branch,AssignmentTreeTemplate.branchReff))!= null);

    }



    public copyOnlyParentData(child:BranchNode):void{
      let parent:BranchNode = this.assignmentService.getBranchById(child,AssignmentTreeTemplate.branchReff);
      let root :BranchNode = parent ;
      if(parent != null){
        while( root.doChange == false){
          root = this.assignmentService.getBranchById(root,AssignmentTreeTemplate.branchReff);
        }
        if(parent.doChange == false){
          for(let child of parent.children){
            if(child.doChange == false){
              this.assignmentService.copyParentDataToChild(root,child);
            }
          }
        }else{
          for(let child of parent.children){
            if(child.doChange == false){
              if(root != null){
                this.assignmentService.copyParentDataToChild(parent,child);
              }

            }
          }
        }
      }
    }







    public selectAllParents(branch:BranchNode):void{
      // if(branch == null){
      //   return;
      // }
      // do{
      //    branch.partialSelect = false;
      //    branch.selected = true;
      // }while((branch = this.getBranchById(branch,AssignmentTreeTemplate.branchReff))!= null);
    }









}
