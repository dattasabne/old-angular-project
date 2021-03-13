import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAlertDialogComponent } from './alert-dialog/mat.alert.dialog.component';
import { AppConfirmDialogComponent } from './appconfirmdialog/appconfirmdialog.component';
import { MaterialModule } from '../material-module/material.module';
import { AlertBottomSheetComponent } from './alertbottomsheet/alertbottomsheet.component';
import { ConfirmBottomSheetComponent } from './confirmbottomsheet/confirmbottomsheet.component';
import { SnackdialogComponent } from './snackdialog/snackdialog.component';

@NgModule({
  declarations: [
    MatAlertDialogComponent ,
    AppConfirmDialogComponent,
    AlertBottomSheetComponent,
    ConfirmBottomSheetComponent,
    SnackdialogComponent],
  imports: [
    CommonModule , MaterialModule
  ],
  exports : [
    MatAlertDialogComponent ,
    AppConfirmDialogComponent,
    AlertBottomSheetComponent ,
    ConfirmBottomSheetComponent,
    SnackdialogComponent],
  entryComponents: [
    MatAlertDialogComponent ,
    AppConfirmDialogComponent ,
    AlertBottomSheetComponent ,
    ConfirmBottomSheetComponent,
    SnackdialogComponent]
})
export class AppdialogModule {}
