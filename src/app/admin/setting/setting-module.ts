import { NgModule } from "@angular/core";
import { MaterialModule } from "../../material-module";
import { FormsModule } from "@angular/forms";
import { SettingMenuComponent } from "./setting-menu/setting-menu";
import { MessagingSettingComponent } from "./messaging-settings/messaging-setting";
import { Routes, RouterModule } from "@angular/router";
import { SearchKeyOptionPipe } from "./messaging-settings/serach-key-pipe";
import { HttpClientModule } from "@angular/common/http";
import { LoaderModule } from "src/app/shared/loader-module/loader.module";

const routes: Routes = [
  {
    path: "admin/setting",
    children: [
      {
        path: "",
        redirectTo: "menu",
        pathMatch: "full"
      },
      {
        path: "menu",
        component: SettingMenuComponent
      },
      {
        path: "template",
        component: SettingMenuComponent
      }
    ]
  }
];
@NgModule({
  declarations: [
    SettingMenuComponent,
    MessagingSettingComponent,
    SearchKeyOptionPipe
  ],
  imports: [
    HttpClientModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(routes),
    LoaderModule
  ],
  entryComponents: [SettingMenuComponent, MessagingSettingComponent],
  exports: []
})
export class SettingModule {
  public constructor() {}
}
