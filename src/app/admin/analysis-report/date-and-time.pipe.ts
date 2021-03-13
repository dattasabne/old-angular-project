import { Pipe, PipeTransform, Inject } from "@angular/core";
import { DateTimePipe } from "../indivisual-report/date-time.pipe";
@Pipe({
  name: "date_and_time"
})
export class DateAndTimePipe implements PipeTransform {
  public constructor(@Inject(DateTimePipe) private datetime: DateTimePipe) {}
  transform(input: string, data: Array<any>) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].assignmentDate == input) {
        let dateSplit = input.split(" ");
        let timeSplit = data[i].assignmentTime.split(" ");

        let time = null;
        let date = null;
        if (timeSplit && Array.isArray(timeSplit)) {
          time = timeSplit[1];
        }
        if (dateSplit && Array.isArray(dateSplit)) {
          date = dateSplit[0];
        }
        if (date == null || time == null) {
          return input;
        }
       return this.datetime.transform(date.concat(" ").concat(time));
      }
    }
    return input;
  }
}
