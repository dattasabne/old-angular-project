import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectFilterPipe } from '../pipes/subject-pipe';

@NgModule({
  declarations: [SubjectFilterPipe],
  imports: [
    CommonModule
  ],
  exports:[SubjectFilterPipe]
})
export class LibraryModule { }
