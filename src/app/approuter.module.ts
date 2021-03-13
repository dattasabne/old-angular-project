import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { MaterialModule } from './material-module/material.module';

const route: Routes = [
  {path: '' , redirectTo : '/organization', pathMatch : 'full' },
  {path: 'website', loadChildren : () => import('./website/website.module').then(m => m.WebSiteModule)},
  {path: 'students' , loadChildren : () => import('./students/students.module').then(m => m.StudentsModule) },
  {path: '**' , component: PageNotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(route),
    MaterialModule
  ],
  exports : [RouterModule]
})
export class AppRouterModule { }
