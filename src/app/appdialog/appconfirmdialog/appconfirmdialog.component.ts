import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogModel } from 'src/app/app-models/mat.dialog.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-appconfirmdialog',
  templateUrl: './appconfirmdialog.component.html',
  styleUrls: ['./appconfirmdialog.component.css']
})
export class AppConfirmDialogComponent implements OnInit , AfterViewInit , OnDestroy {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MatDialogModel) { }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}
  ngOnInit(): void {
  }
  onYesButtonClick(): void{
    this.data.yesCallback();
  }
  onNoButtonClick(): void{
    this.data.noCallBack();
  }

}
