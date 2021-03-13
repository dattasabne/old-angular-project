import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timeConvert"
})
export class TimePipe implements PipeTransform {
  public constructor() {}
  transform(input: string): string {
    let time = "";
    try {
      let $time = new Date(input);
      let hour = $time.getHours();
      let min = $time.getMinutes();
      time = hour + ":" + min + ":00";
    } catch (e) {
      console.log(e);
    } finally {
      return time;
    }
  }
}
