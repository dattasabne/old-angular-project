import { Pipe, PipeTransform } from "@angular/core";
import { SMSTemplateInterface } from "../../../shared/interfaces/sms-template.interface";

@Pipe({
  name: "searchKey"
})
export class SearchKeyOptionPipe implements PipeTransform {
  public constructor() {}
  transform(
    input: Array<SMSTemplateInterface>,
    key: string
  ): Array<SMSTemplateInterface> {
    if (!(key && key.trim())) {
      return input;
    }
    let search = new Array<SMSTemplateInterface>();
    input.forEach(item => {
      if (
        item.name
          .trim()
          .toUpperCase()
          .indexOf(key.trim().toUpperCase()) != -1
      ) {
        search.push(item);
      }
    });
    return search;
  }
}
