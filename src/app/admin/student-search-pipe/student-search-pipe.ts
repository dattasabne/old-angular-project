import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "student"
})
export class StudentSearchPipe implements PipeTransform {
  transform(data: Array<any>, value: string): Array<any>[] {
    const searchData = new Array<any>();
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].index &&
        value &&
        data[i].index
          .toString()
          .toUpperCase()
          .trim()
          .indexOf(value.toUpperCase().trim()) != -1
      ) {
        searchData.push(data[i]);
        continue;
      }
      if (
        data[i].name &&
        value &&
        data[i].name
          .toUpperCase()
          .trim()
          .indexOf(value.toUpperCase().trim()) != -1
      ) {
        searchData.push(data[i]);
        continue;
      }
      if (
        data[i].class &&
        value &&
        data[i].class
          .toUpperCase()
          .trim()
          .indexOf(value.toUpperCase().trim()) != -1
      ) {
        searchData.push(data[i]);
        continue;
      }
      if (
        data[i].pattern &&
        value &&
        data[i].pattern
          .toUpperCase()
          .trim()
          .indexOf(value.toUpperCase().trim()) != -1
      ) {
        searchData.push(data[i]);
        continue;
      }
    }
    if (value) {
      return searchData;
    }
    return data;
  }
}
