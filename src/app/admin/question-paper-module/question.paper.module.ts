import { UserRegistration } from './user-registration-component/user.registration.component';
import { AllMethodSummary } from './all-method-summary/all.method.summary.component';
import { AutomatedRandomSelectionComponent } from './automated-random-selection/automated.random.selection.compenent';
import { AppFocusDirective } from './directives/set.focus.directive';
import { SharedModule } from './../../shared/shared-module';
import { FormsModule } from '@angular/forms';
import { PaperPrintingHttpService } from './http-services/paper.printing.http.service';
import { HttpClientModule } from '@angular/common/http';
import { QuestionPaperTable } from './question-paper-table/question.paper.table.component';
import { MaterialModule } from 'src/app/material-module';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { QuestionPaperComponent } from './question-paper-component/question.paper.component';
import { QuestionPaperTemplate } from './question-paper-template/question.paper.template.component';
import { CommonSearchCriteriaModule } from 'src/app/website/common-search-criteria/common.search.criteria.module';
const routes:Routes = [
  {
    path: '',
    children :[
      {path:'',component:QuestionPaperComponent},
      {path:'random-selection',component:AutomatedRandomSelectionComponent},
      {path:'user-registration',component:UserRegistration}
    ]
  }
]
@NgModule({
  declarations: [
    QuestionPaperComponent ,
    QuestionPaperTemplate ,
    QuestionPaperTable,
    AppFocusDirective ,
    AutomatedRandomSelectionComponent ,
    AllMethodSummary , UserRegistration ],
  imports: [
    MaterialModule ,
    RouterModule.forChild(routes),
    CommonSearchCriteriaModule,
    HttpClientModule,
    FormsModule ,
    SharedModule
    ],
  entryComponents: [],
  exports: [QuestionPaperTable , UserRegistration],
  providers:[PaperPrintingHttpService]
})
export class QuestionPaperModule{
  public constructor(){}
}

