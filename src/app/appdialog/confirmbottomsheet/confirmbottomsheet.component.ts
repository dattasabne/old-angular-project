import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialogModel } from 'src/app/app-models/mat.dialog.model';

@Component({
  selector: 'app-confirmbottomsheet',
  templateUrl: './confirmbottomsheet.component.html',
  styleUrls: ['./confirmbottomsheet.component.css']
})
export class ConfirmBottomSheetComponent implements OnInit , AfterViewInit , OnDestroy{

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public bootomSheetData: MatDialogModel) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void{}
  ngAfterViewInit(): void{}
  onNoButtonClick(): void{
    this.bootomSheetData.noCallBack();
  }
  onYesButtonClick(): void{
    this.bootomSheetData.yesCallback();
  }
}
