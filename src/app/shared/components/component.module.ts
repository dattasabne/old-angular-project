import { NgModule } from "@angular/core";
import { SmsComponent } from "./sms.component";
import { MaterialModule } from "../../material-module";
@NgModule({
  declarations: [SmsComponent],
  exports: [SmsComponent],
  imports: [MaterialModule],
  entryComponents: []
})
export class ComponentModule {
  public constructor() {}
}
