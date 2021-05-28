import { CustomPdfModule } from './../custom-pdf-module/custom.pdf.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StudenthomepageComponent } from "./studenthomepage/studenthomepage.component";
import { Routes, RouterModule } from "@angular/router";
import { ShellComponent } from "./shell-component";
import { SharedModule } from "./shared/shared.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SerachAssignmentComponent } from "./serach-assignment/serach-assignment.component";
import { ExamStartComponent } from "./exam-start/exam-start.component";
import { MaterialModule } from "./shared/material/material.module";
import { HttpClientModule } from "@angular/common/http";
import { ResultComponent } from "./result/result.component";
import { LibraryModule } from "./library/library/library.module";
import { AnalysisReportComponent } from "./analysis-report/analysis-report.component";
import { PipeModule } from "../shared/pipes/pipe-module";
import { TriangleLoader } from "../shared/loader/triangle-loader/triangle-loader";
import { LoaderModule } from "../shared/loader/loader-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AnalysisSearchComponent } from "./analysis-search/analysis-search.component";
import { ExamReviewComponent } from './exam-review/exam-review.component';
import { AdminLoginComponent } from "./admin-login/admin-login.component";
import { StudentLoginGuard } from "./shared/login-guard/login-guard-service";
import { AdminLogin2 } from "../admin/admin-login2/admin-login2.component";
import { MatrixOption } from "./exam-start/matrix-option/matrix-option";
const route: Routes = [
  {
    path:'',
    component:StudenthomepageComponent
  }
  // {
  //   path:'student-homepage',
  //   component:StudenthomepageComponent,
  //   //canActivate:[StudentLoginGuard]
  // },
  // {
  //   path:'',
  //   redirectTo:"/student-homepage",
  //   pathMatch:'full'
  // }
];
@NgModule({
  declarations: [
    StudenthomepageComponent,
    ShellComponent,
    DashboardComponent,
    SerachAssignmentComponent,
    ExamStartComponent,
    ResultComponent,
    AnalysisReportComponent,
    AnalysisSearchComponent,
    ExamReviewComponent ,
    AdminLoginComponent,
    MatrixOption,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    SharedModule,
    MaterialModule,
    HttpClientModule,
    LibraryModule,
    PipeModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    CustomPdfModule

  ],
  entryComponents: [
    DashboardComponent,
    SerachAssignmentComponent,
    AnalysisSearchComponent,
    MatrixOption
  ]
})
export class StudentsModule {
  public constructor() {}
}
