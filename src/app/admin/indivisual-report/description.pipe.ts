import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "description"
})
export class DescriptionPipe implements PipeTransform {
  public constructor() {}
  transform(input: string): string {
    if (typeof input == "string") {
      let text = input.substring(0, 20);
      text = text.concat(".....");
      return text;
    }
    return "";
  }
}
