import { Pipe, PipeTransform } from "@angular/core";
import { GeneralUtility } from "../../shared/utility/general-utility";

@Pipe({
  name: "assignmentIdsPipe"
})
export class AssignmentIdPipe implements PipeTransform {
  transform(input: Array<any>, ...param: Array<string>): Array<any> {
    let record = new Array<any>();
    if (param[0] && param[0].trim().toUpperCase() == "all".toUpperCase()) {
      input.forEach(item => {
        if (!GeneralUtility.isDuplicateObject(record, "allBranchId", item.allBranchId)) {
          record.push(item);
        }
      });
      record.sort(function(obj1:any,obj2:any){
        return Number(obj2.allBranchId)  -  Number(obj1.allBranchId);
      });
      return record;
    }
    input.forEach(item => {
      if (
        item.assignmentDate == param[0] &&
        (!GeneralUtility.isDuplicateObject(record, "allBranchId", item.allBranchId))
      ) {
        record.push(item);
      }
    });
    record.sort(function(obj1:any,obj2:any){
      return Number(obj2.allBranchId)  -  Number(obj1.allBranchId);
    });
    return record;
  }
}
