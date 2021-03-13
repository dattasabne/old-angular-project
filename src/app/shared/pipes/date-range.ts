import { Pipe, PipeTransform } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DateTimeUtility } from "../utility/date-time-utility";

@Pipe({
  name: "dateRangePipe"
})
export class DateRangePipe implements PipeTransform {
  public constructor() {}
  transform(
    data: any,
    input: { startDate: ""; endDate: "" },
    control: FormControl
  ) {
    let dateArray: Array<string> = new Array<string>();
    if (!input) {
      return dateArray;
    }
    let startDate = new Date(input.startDate);
    let endDate = new Date(input.endDate);
    while (startDate <= endDate) {
      dateArray.push(this.makeDateFormat(startDate));
      let tempDate = new Date(startDate);
      tempDate.setDate(startDate.getDate() + 1);
      startDate = tempDate;
    }
    if (dateArray.length > 0) {
      let currentDate = DateTimeUtility.getCurrentDateInDbFormat();
      if (dateArray.indexOf(currentDate) == -1) {
        control.setValue(dateArray[0], { onlySelf: true });
      } else {
        control.setValue(currentDate, { onlySelf: true });
      }
    }
    return dateArray;
  }

  private makeDateFormat(date: Date): string {
    if (!date) {
      return "N.A.";
    }
    let strYear = date.getFullYear();
    let strMonth = date.getMonth() + 1;
    let strDate = date.getDate();
    let formatedDate = strYear + "-" + strMonth + "-" + strDate;
    return formatedDate;
  }
}
