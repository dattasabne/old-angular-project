import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "userDatePipe"
})
export class UserDatePipe implements PipeTransform {
  transform(input: string): string {
    if (!input) {
      return "N.A.";
    }
    let date = new Date(input);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let monthName = this.getMonthName(month);
    let finalDate = day + "-" + monthName + "-" + year;
    return finalDate;
  }
  private getMonthName(index: number): string {
    let months = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let month: string = months[index];
    if (!month) {
      return "N.A";
    }
    return month;
  }
}
