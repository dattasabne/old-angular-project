
import { MaterialModule } from 'src/app/material-module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonSearchCriteriaComponent } from './common.search.criteria.component';
const routes:Routes = [
  {
    path:'criteria',
    component:CommonSearchCriteriaComponent
  }
];
@NgModule({
  declarations: [CommonSearchCriteriaComponent],
  imports: [
    RouterModule.forChild(routes),
    MaterialModule
  ],
  exports: [CommonSearchCriteriaComponent],
  entryComponents: []
})
export class CommonSearchCriteriaModule{
    public constructor(){}
}
