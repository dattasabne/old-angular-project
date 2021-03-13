import { Pipe, PipeTransform } from "@angular/core";
import { GeneralUtility } from "../../shared/utility/general-utility";
@Pipe({
  name: "dateConvert"
})
export class DateConvertPipe implements PipeTransform {
  public constructor() {}
  transform(input: string, format: string): string {
    let date = "";
    try {
      if (!input || input.toUpperCase().trim() == "all".toUpperCase().trim()) {
        return "All";
      }
      let $date = new Date(input);
      switch (format) {
        case "dd-mm-yyyy":
          {
            let day = $date.getDate().toString();
            let month = GeneralUtility.getMonthNameByNumber(
              $date.getMonth() + 1
            );
            let year = $date.getFullYear();
            if (!/^[0-9]{2}$/.test(day.toString())) {
              day = "0".concat(day.toString());
            }
            date = day + "-" + month + "-" + year;
          }
          break;
        case "mm-dd-yyyy":
          {
            let day = $date.getDate();
            let month = $date.getMonth() + 1;
            let year = $date.getFullYear();
            date = month + "-" + day + "-" + year;
          }

          break;
        case "yyyy-mm-dd":
          {
            let day = $date.getDate();
            let month = $date.getMonth() + 1;
            let year = $date.getFullYear();
            date = year + "-" + month + "-" + day;
          }
          break;
        default:
          date = "N.A.";
      }
    } catch (e) {
      return "All";
    }
    return date;
  }
}
