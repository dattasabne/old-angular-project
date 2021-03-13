import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedTableComponent } from '../fixed-table.component';

@NgModule({
  declarations: [
    FixedTableComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FixedTableComponent
  ]
})
export class FixedTableModule { }
