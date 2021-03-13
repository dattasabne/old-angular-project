import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "nameAutoComplete"
})
export class NameAutoComplete implements PipeTransform {
  public constructor() {}
  transform(input: any, key: string) {
    const record: Array<any> = new Array<any>();
    if (
      typeof input == "object" &&
      Array.isArray(input) &&
      typeof key != "object"
    ) {
      input
        .filter(item => {
          return (
            item.studentName
              .toUpperCase()
              .trim()
              .indexOf(key.toUpperCase().trim()) != -1
          );
        })
        .map(item => {
          record.push(item);
        });
      return record;
    }
    return input;
  }
}
