import { MaterialModule } from 'src/app/material-module';

import { NgModule } from "@angular/core";
import { WebSiteInUnderConstruction } from "./website-under-construction/construction.component";
import { Routes, RouterModule } from "@angular/router";
import { AndroidLogOutComponent } from './android-logout/android.logout';
import { InstituteLogin } from './institute-login/institute.login';

import { SharedModule } from '../shared/shared-module';
import { Authentication } from './authentication/authentication.component';
import { WebsiteLoginComponent } from './website-login/website.login.component';
import { PageNotFound } from './page-not-found/page.not.found.component';
import { WebSocketComponent } from './websocket/websocket.component';
const route:Routes = [
  {
      path:'an-logout',
      component:AndroidLogOutComponent
  },
  {
    path:'student',
    loadChildren:()=> import("../students/students.module").then(m=>m.StudentsModule)
  },
  {
    path:'assignment',
    loadChildren:()=>import("../admin/admin.module").then(m=>m.AdminModule)
  },
  {
    path:'admin-panel',
    loadChildren:()=>import("../admin/admin.module").then(m=>m.AdminModule)
  },
  {
    path:'koshadmin',
    loadChildren:()=>import("../kosh-admin/kosh-admin.module").then(m=>m.KoshAdminModule)
  },
  {
    path:'question-paper',
    loadChildren:()=>import("../admin/question-paper-module/question.paper.module").then(m=>m.QuestionPaperModule)
  },
  {
    path:'question-paper',
    loadChildren: ()=>import("../admin/question-paper-module/question.paper.module").then(m=>m.QuestionPaperModule)
  },
  
  {
    path:'not-found',
    component:PageNotFound
  },
  {
    path:'socket',
    component:WebSocketComponent
  },

  {
    path:'',
    component:WebsiteLoginComponent
  },
  {
    path:':link',
    component: Authentication,
  },
  {
    path:'**',
    redirectTo:"/not-found"
    //component:WebSiteInUnderConstruction
  },
]
@NgModule({
    declarations:[
      WebSocketComponent,
      WebSiteInUnderConstruction,
      AndroidLogOutComponent,
      InstituteLogin,
      Authentication,
      WebsiteLoginComponent,
      PageNotFound

    ],
    imports:[
      RouterModule.forChild(route) ,
      MaterialModule,
      SharedModule
    ],
    exports:[
      InstituteLogin
    ],
    entryComponents:[]
})
export class WebSiteModule{}
