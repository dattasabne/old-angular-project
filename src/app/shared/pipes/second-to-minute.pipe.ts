import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "secondToMinutes"
})
export class SecondToMinutePipe implements PipeTransform {
  public constructor() {}
  transform(input: string): string {
    let totalSecond = Number(input);
    let minutes: number = totalSecond / 60;
    if (/^.\..$/.test(minutes.toString())) {
      minutes = Number(minutes.toFixed(2));
    }
    return minutes.toString();
  }
}
