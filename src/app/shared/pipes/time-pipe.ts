import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timePipe"
})
export class TimePipe implements PipeTransform {
  public constructor() {}
  transform(input: string): string {
    let dateTime = new Date(input);
    let hour = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let time = hour + ":" + minutes;
    return time;
  }
}
