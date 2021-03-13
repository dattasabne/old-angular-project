import { Pipe, PipeTransform } from "@angular/core";
import { Question } from "../../students/library/interfaces/question-interface";
import { SortingMenu } from "../../students/library/enums/sorting-menu-enum";

@Pipe({
  name: "sortingRecords"
})
export class SortingRecords implements PipeTransform {
  public constructor() {
    // let q = <Question>{};
    // q.index;
    // q.correctQuestion;
    // q.noOfVisit;
    // q.subjectName;
    // q.timeTaken;
  }
  transform(input: Array<Question>, order: boolean, field: SortingMenu) {
    switch (field) {
      case SortingMenu.QuestionNo:
        return this.sortByQuestionNo(input, order, "index");
      case SortingMenu.RightOrWrong:
        break;
      case SortingMenu.TimeTaken:
        return this.sortByQuestionNo(input, order, "timeTaken");
      case SortingMenu.VisitCount:
        return this.sortByQuestionNo(input, order, "noOfVisit");
      default:
        return input;
    }
  }

  private sortByQuestionNo(
    dataSource: Array<Question>,
    order: boolean,
    field: string
  ): Array<Question> {
    if (!dataSource) {
      return [];
    }
    for (let i = 0; i < dataSource.length; i++) {
      for (let j = i + 1; j < dataSource.length; j++) {
        if (order) {
          if (Number(dataSource[i][field]) > Number(dataSource[j][field])) {
            let temp: Question = dataSource[i];
            dataSource[i] = dataSource[j];
            dataSource[j] = temp;
          }
        } else {
          if (Number(dataSource[i][field]) < Number(dataSource[j][field])) {
            let temp: Question = dataSource[i];
            dataSource[i] = dataSource[j];
            dataSource[j] = temp;
          }
        }
      }
    }
    return dataSource;
  }
}
