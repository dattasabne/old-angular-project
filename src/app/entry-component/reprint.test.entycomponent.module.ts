import { NgModule } from "@angular/core";
import { ReprintTestDetailsComponent } from '../admin/reprint-test-details/reprint.test.details.component';
import { SharedModule } from '../shared/shared-module';
import { MaterialModule } from '../material-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrintQuestionPaperCommon } from '../admin/print-question-paper/print.questionpaper.component';
import { ImagePopup } from '../shared/image-popup/image.popup.component';
import { ConfirmDialogComponent } from '../kosh-admin/dialogs/confirm-dialog/confirm-dialog.component';
@NgModule({
  declarations:[  ReprintTestDetailsComponent ,
                  PrintQuestionPaperCommon,
                  ImagePopup , ConfirmDialogComponent],
  imports:[
          SharedModule ,
          MaterialModule ,
          ReactiveFormsModule ,
          CommonModule ,
          FormsModule ],
  exports:[
    ReprintTestDetailsComponent ,
    PrintQuestionPaperCommon,
    ImagePopup,
    ConfirmDialogComponent],
  entryComponents:[
    ReprintTestDetailsComponent,
    PrintQuestionPaperCommon,
    ImagePopup ,
    ConfirmDialogComponent ]
})
export class ReprintEntryComponentModule{
  public constructor(){}

}
