import { NgModule } from "@angular/core";
import { Loader } from "./loader-component/loader.component";

@NgModule({
  declarations: [Loader],
  imports: [],
  exports: [Loader]
})
export class LoaderModule {
  public constructor() {}
}
