import { NgModule } from "@angular/core";
import { LoginComponent } from "./authentication/login";
import { Routes, RouterModule } from "@angular/router";
import { MaterialModule } from "../material-module";
import { AdminMenu } from "./admin-menu/admin-menu";
import { CommonAnalysisReportComponent } from "./analysis-report/analysis-report";
import { RootComponent } from "./route-component";
import { SelectDirective } from "./analysis-report/select-directive";
import { IndivisualReportComponent } from "./indivisual-report/indivisual-report";
import { StudentSearchPipe } from "./student-search-pipe/student-search-pipe";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { SettingModule } from "./setting/setting-module";
import { HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { AssignmentTypePipe } from "./analysis-report/assignment-type.pipe";
import { AssignmentIdPipe } from "./analysis-report/assignment-ids.pipe";
import { LoaderModule } from "../shared/loader-module/loader.module";
import { ComponentModule } from "../shared/components/component.module";
import { NameAutoComplete } from "./indivisual-report/autocomplete.pipe";
import { DescriptionPipe } from "./indivisual-report/description.pipe";
import { DateConvertPipe } from "./indivisual-report/date.pipe";
import { TimePipe } from "./indivisual-report/time.pipe";
import { DateTimePipe } from "./indivisual-report/date-time.pipe";
import { DialogModule } from "../shared/dialog/dialog.module";
import { DateAndTimePipe } from "./analysis-report/date-and-time.pipe";
import { FireBaseNotificationSender } from "./firebase/notification-sender/notification.component";
import { SmsShowerComponent } from "./sms-shower/sms-shower.component";
import { SmsStatusShowerComponent } from "./sms-status-shower/sms-status.component";
import { OnlineStudentsComponent } from "./online-students/online-students.component";
import { OnlineStudentsProfileComponent } from "./online-students-profile/online-students-profile.component";
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ClassTestDetailsComponent } from './class-test-details/class-test-details.component';
import { NavbarModule } from "../shared/header-menu/header-menu.module";
import { AdminAuthGuard } from "./admin-dashboard/admin-auth-guard.service";
import { AdminRoutingComponent } from './admin-routing/admin-routing.component';
import { TestStatusComponent } from './admin-dashboard/components/test-status/test-status.component';
import { FixedTableModule } from "../shared/fixed-table/fixed-table/fixed-table.module";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BrandingComponent } from "../students/shared/branding/branding.component";
import { AdminLogin2 } from "./admin-login2/admin-login2.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from "../shared/shared-module";

import { AdminUtilityComponent } from './admin-utility/admin-utility.component';
import { AdminPanel } from "./admin-panel/admin-panel.component";
import { RandomePaperGeneration } from "./random-paper-generation/random-paper-generation.component";
import { UploadResult } from "./upload-result/upload-result.component";
import { ResultComponent } from "./exam-result/result.component";
import { OwnTestUploader } from "./own-test-upload/own-test-upload.component";
import { ReprintComponent } from './reprint-paper/reprint.component';
import { RecurseVisitor } from '@angular/compiler/src/i18n/i18n_ast';
import { RecursiveComponent } from './reprint-paper/recursive.component';
import { SearchGeneratedTestComponent } from './search-generated-test/search-generated-test.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReprintEntryComponentModule } from '../entry-component/reprint.test.entycomponent.module';
import { UtilityModule } from '../website/utility-module/utility.module';
import { AssignmentTreeTemplate } from './assignment-tree-template/assignment.tree.template.component';
import { AssignmentAssignComponent } from './student-assignmnet/assignment.assign.component';
const routs: Routes = [
  {
      path: "",
      component:AdminPanel // this is default home component
      //component:AssignmentAssignComponent
  },
  {
    path: "test",
      // component:AdminPanel // this is default home component
      component:AssignmentAssignComponent
  },
  {
    path: "login",
    component: AdminLogin2
  },
  {
    path:"test-status",
    component: TestStatusComponent
  },
  {
    path:"class-test-details",
    component: ClassTestDetailsComponent
  },

  // {
  //   path: "admin-menu/:token",
  //   component: AdminMenu
  // },
  // {
  //   path:'institute',
  //   component:AdminMenu
  // },
  // {
  //   path: "analysis-report", component: CommonAnalysisReportComponent
  // },
  // {
  //   path: "online-students", component: OnlineStudentsComponent
  // },
  {
    path: "admin-utility", component: AdminUtilityComponent
  }
  // ,
  // {
  //   path:'image-popup',
  //   component:ImagePopup
  // }
];
@NgModule({
  declarations: [
    SearchGeneratedTestComponent,
    BrandingComponent,
    RootComponent,
    LoginComponent,
    AdminMenu,
    CommonAnalysisReportComponent,
    SelectDirective,
    IndivisualReportComponent,
    StudentSearchPipe,
    AssignmentTypePipe,
    AssignmentIdPipe,
    NameAutoComplete,
    DescriptionPipe,
    DateConvertPipe,
    TimePipe,
    DateTimePipe,
    DateAndTimePipe,
    OnlineStudentsComponent,
    OnlineStudentsProfileComponent,
    FireBaseNotificationSender,
    SmsShowerComponent,
    SmsStatusShowerComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    ClassTestDetailsComponent,
    AdminRoutingComponent,
    TestStatusComponent,
    ForgotPasswordComponent,
    AdminLogin2,
    AdminUtilityComponent,
    AdminPanel,
    RandomePaperGeneration,
    UploadResult,
    ResultComponent,
    OwnTestUploader,
    ReprintComponent,
    RecursiveComponent,
    AssignmentTreeTemplate,
    AssignmentAssignComponent
  ],
  imports: [
    RouterModule.forChild(routs),
    MaterialModule,
    FormsModule,
    SettingModule,
    HttpClientModule,
    LoaderModule,
    ComponentModule,
    DialogModule,
    NavbarModule,
    FixedTableModule,
    FlexLayoutModule,
    SharedModule,
    ReactiveFormsModule,
    PdfViewerModule,
    ReprintEntryComponentModule,
    UtilityModule
  ],
entryComponents: [
    CommonAnalysisReportComponent,
    IndivisualReportComponent,
    FireBaseNotificationSender,
    SmsShowerComponent,
    SmsStatusShowerComponent,
    OnlineStudentsProfileComponent,
    RandomePaperGeneration,
    UploadResult,
    OwnTestUploader,
    BrandingComponent,
    ReprintComponent,
    SearchGeneratedTestComponent,
  ],
  providers: []
})
export class AdminModule {
  public constructor() {}
}
