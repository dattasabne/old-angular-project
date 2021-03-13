import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { MaterialModule } from "./material-module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { WebSiteModule } from "./website/website.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from "@angular/material";
import { PolicyComponent } from './website/policy.component/policy.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './website/request-interceptor/auth.interceptor';
import { SharedModule } from './students/shared/shared.module';

import { ReprintEntryComponentModule } from './entry-component/reprint.test.entycomponent.module';

import { DialogModule } from './shared/dialog/dialog.module';
import { QuestionPaperModule } from './admin/question-paper-module/question.paper.module';
import { CommonSearchCriteriaModule } from './website/common-search-criteria/common.search.criteria.module';
@NgModule({
  declarations: [AppComponent ,PolicyComponent ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MaterialModule,
    FormsModule,
    ReprintEntryComponentModule,
    DialogModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forRoot([

      // {
      //   path: "temp",
      //   component: SmsStatusShowerComponent
      // },
      // {
      //   path: "forgot-password",
      //   component: ForgotPasswordComponent
      // },

      // {
      //   path: "admin-login",
      //   component: AdminLoginComponent
      // },
      // {
      //   path: "admin-dashboard",
      //   component: AdminDashboardComponent
      // },
      // {
      //   path: "class-test-details",
      //   component: ClassTestDetailsComponent
      // },
      // {
      //   path: "exam-review",
      //   component: ExamReviewComponent
      // },
      // {
      //   path:'policy.html',
      //   component:PolicyComponent
      // },
      //  {
      //   path:':link',
      //   component:AdminLogin2

      // }
      // {
      //   path:'',
      //   component:AdminLogin2
      // }
    ]),
    WebSiteModule,
    QuestionPaperModule, // dynamic loading module
    CommonSearchCriteriaModule ,// dynamic loading module

  ],
  exports:[FlexLayoutModule],
  entryComponents:[],
  providers: [

    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }, // this is for mat dialog box
    { provide:MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,useValue:{hasBackdrop:false}}, // this is for Mat Bottomsheet Component
    { provide:HTTP_INTERCEPTORS ,useClass:AuthInterceptor ,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
