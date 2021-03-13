import { MaterialModule } from 'src/app/material-module';
import { CommonSearchCriteriaComponent } from './components/common-search-criteria/common.search.criteria.component';
import { NgModule } from "@angular/core";
@NgModule({
  declarations : [
    CommonSearchCriteriaComponent
  ],
  imports:[ MaterialModule ],
  exports:[
    CommonSearchCriteriaComponent
  ],
  entryComponents:[]
})
export class ReusableResourceModule{
  public constructor(){}
}

