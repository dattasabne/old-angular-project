import { FormControl } from '@angular/forms';

export interface BranchDetails {
    branches:BranchDetails[];
    branchName:string;
    sign:string;
    course:string;
    isChecked:boolean;
    batch:string;
    testId:any;
    assignmentType:any;
    assignmentTime:any;
    assignmentDate:any;
    solnReleaseDate:any;
    height:string;
    overflow:string;
    assignmentTypeControl:FormControl;
   
}
