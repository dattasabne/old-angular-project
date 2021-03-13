import { NgModule } from "@angular/core";
import { QuestionTypePipe } from './pipes/question.type.pipe';


@NgModule({
  declarations : [QuestionTypePipe],
  imports :[],
  exports:[QuestionTypePipe],
  entryComponents:[]
})
export class UtilityModule{
  public constructor(){}

}
