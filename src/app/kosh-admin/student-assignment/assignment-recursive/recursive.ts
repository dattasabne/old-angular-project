import { Component, OnInit, AfterViewInit, Input, OnChanges, ChangeDetectorRef } from "@angular/core";
import { BranchDetails } from '../branch-details';
@Component({
    selector:'assignmnet-recursive',
    templateUrl:'./recursive.html',
    styleUrls:['./recursive.css']
})
export class AssignmentRecursive implements OnInit , AfterViewInit , OnChanges{
    public branches:Array<BranchDetails> = new Array<BranchDetails>();
    public constructor(
      private change:ChangeDetectorRef
    ){}
    ngOnInit(){}
    ngAfterViewInit(){}
    ngOnChanges(){}
    @Input("branches")
    public set getBranches(branches:Array<BranchDetails>){
        this.branches = branches;
    }
    public getKeyValue(branch:BranchDetails):Array<string>{
        let values = [];
        for(let key in branch){
          if( (typeof branch[key])!='object'
          && key!='sign'
          && key!="isChecked"){
            values.push(branch[key]);
          }
        }
        return values;
    }
    public changeOnCheckBox(branch:BranchDetails):void{
      if(branch.isChecked){
        this.selectAllChildBranch(branch,false);
        branch.sign = "+";
        branch.height="0px";
        branch.overflow="hidden";
      }else{
        this.selectAllChildBranch(branch,true);
        branch.sign = "-";
        branch.height="auto";
        branch.overflow="auto";
      }
    }
    public selectAllChildBranch(branch:BranchDetails , value:boolean):void{
      branch.isChecked = value;
      for(let br of branch.branches){
        this.selectAllChildBranch(br,value);
      }
    }

}