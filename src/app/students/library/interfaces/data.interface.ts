import { ViewContainerRef } from "@angular/core";
import { ClassDetails } from "../../studenthomepage/class-detail";

export interface Data {
  classData?: ClassDetails;
  template?: ViewContainerRef;
}
