import { Pipe, PipeTransform } from "@angular/core";
import { GeneralUtility } from "../../shared/utility/general-utility";
@Pipe({
  name: "dateTimePipe"
})
export class DateTimePipe implements PipeTransform {
  public constructor() {}
  transform(input: string): string {
    let dateTime = "";
    try {
      let $date = new Date(input);
      let day = $date.getDate().toString();
      let month = GeneralUtility.getMonthNameByNumber($date.getMonth() + 1);
      let year = $date.getFullYear();
      let hour = $date.getHours();
      let min = $date.getMinutes();
      let sec = $date.getSeconds();
      if (!/^[0-9]{2}$/.test(day.toString())) {  
        day = "0".concat(day.toString());
      }
      dateTime =
        day + "-" + month + "-" + year + " " + hour + ":" + min + ":" + sec;
    } catch (e) {
      dateTime = "N.A.";
      console.log(e);
    } finally {
      return dateTime;
    }
  }
}
