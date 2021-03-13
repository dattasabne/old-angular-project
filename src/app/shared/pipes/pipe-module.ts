import { NgModule } from "@angular/core";
import { TimePipe } from "./time-pipe";
import { SecondToMinutePipe } from "./second-to-minute.pipe";
import { UserDatePipe } from "../../students/analysis-search/user-date-pipe";
import { DateRangePipe } from "./date-range";
import { SortingRecords } from "./sorting-record-pipe";

@NgModule({
  declarations: [
    TimePipe,
    SecondToMinutePipe,
    UserDatePipe,
    DateRangePipe,
    SortingRecords
  ],
  exports: [
    TimePipe,
    SecondToMinutePipe,
    UserDatePipe,
    DateRangePipe,
    SortingRecords
  ]
})
export class PipeModule {
  public constructor() {}
}
