import { Pipe, PipeTransform } from "@angular/core";
import { Question } from "../interfaces/question-interface";

@Pipe({
  name: "subjectFilter"
})
export class SubjectFilterPipe implements PipeTransform {
  public constructor() {}
  transform(input: Array<any>, subject: string, callBack: any): any {
    if (!(subject && subject.trim())) {
      return input;
    }
    let result = [];
    for (let i = 0; i < input.length; i++) {
      if (input[i]["subjectName"].toUpperCase() == subject.toUpperCase()) {
        result.push(input[i]);
      }
    }
    if (result.length > 0) {
      callBack(result[0]);
    }
    return result;
  }
}
