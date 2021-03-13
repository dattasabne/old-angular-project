import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModel } from 'src/app/app-models/mat.dialog.model';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottomsheet',
  templateUrl: './alert.bottomsheet.component.html',
  styleUrls: ['./alert.bottomsheet.component.css']
})
export class AlertBottomSheetComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public bootomSheetData: MatDialogModel) { }

  ngOnInit(): void {
  }
  public clickOnOkButton(): void{
    this.bootomSheetData.noCallBack();
  }
}
