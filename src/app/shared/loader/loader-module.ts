import { NgModule } from "@angular/core";
import { TriangleLoader } from "./triangle-loader/triangle-loader";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [TriangleLoader],
  exports: [TriangleLoader],
  imports: [
    RouterModule.forChild([
      {
        path: "loader",
        component: TriangleLoader
      }
    ])
  ]
})
export class LoaderModule {
  public constructor() {}
}
