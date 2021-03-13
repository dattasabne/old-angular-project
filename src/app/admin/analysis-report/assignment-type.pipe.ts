import { Pipe, PipeTransform } from "@angular/core";
import { GeneralUtility } from "../../shared/utility/general-utility";

@Pipe({
  name: "assignmentType"
})
export class AssignmentTypePipe implements PipeTransform {
  transform(input: Array<any>, ...param: Array<string>): Array<any> {
    let record: Array<string> = new Array<any>();
    if (param[0].toUpperCase() == "all".toUpperCase()) {
      input.forEach(item => {
        if (
          item.assignmentDate &&
          item.assignmentType.trim() &&
          !GeneralUtility.isDuplicateObject(
            record,
            "assignmentType",
            item.assignmentType
          )
        ) {
          record.push(item);
        }
      });
      return record;
    }
    input.forEach(item => {
      if (
        item.assignmentDate == param[0] &&
        !GeneralUtility.isDuplicateObject(
          record,
          "assignmentType",
          item.assignmentType
        )
      ) {
        record.push(item);
      }
    });
    return record;
  }
}
