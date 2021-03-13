import { Question } from "./interfaces/question-interface";
import { SortingMenu } from "./enums/sorting-menu-enum";
import { ExamConstants } from "./interfaces/exam-constants";

export class SortingClass {
  public static sort(
    input: Array<Question>,
    order: boolean,
    field: SortingMenu
  ): Array<Question> {
    switch (field) {
      case SortingMenu.QuestionNo:
        return this.sortByQuestionNo(input, order, "nSquence");
      case SortingMenu.RightOrWrong:
        return this.sortRightOrWrong(input, order, "isCorrectQuestion");
      case SortingMenu.TimeTaken:
        return this.sortByQuestionNo(input, order, "timeTaken");
      case SortingMenu.VisitCount:
        return this.sortByQuestionNo(input, order, "noOfVisit");
      default:
        return input;
    }
  }
  private static sortByQuestionNo(
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

  private static sortRightOrWrong(
    dataSource: Array<Question>,
    order: boolean,
    field: string
  ): Array<Question> {
    if (!dataSource) {
      alert("data source not available");
      return [];
    }
    for (let i = 0; i < dataSource.length; i++) {
      for (let j = i + 1; j < dataSource.length; j++) {
        if (order) {
          if (
            this.getIntegerNumberOfBoolean(dataSource[i][field]) >
            this.getIntegerNumberOfBoolean(dataSource[j][field])
          ) {
            let temp: Question = dataSource[i];
            dataSource[i] = dataSource[j];
            dataSource[j] = temp;
          }
        } else {
          if (
            this.getIntegerNumberOfBoolean(dataSource[i][field]) <
            this.getIntegerNumberOfBoolean(dataSource[j][field])
          ) {
            let temp: Question = dataSource[i];
            dataSource[i] = dataSource[j];
            dataSource[j] = temp;
          }
        }
      }
    }
    return dataSource;
  }

  private static getIntegerNumberOfBoolean(value: boolean): number {
    return value == true ? 1 : 0;
  }

  public static generateQuestionIndex(
    dataSource: Array<Question>
  ): Array<Question> {
    for (let i = 0; i < dataSource.length; i++) {
      dataSource[i].index = (i + 1).toString();
    }
    return dataSource;
  }
}
