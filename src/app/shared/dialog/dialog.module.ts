import { NgModule } from "@angular/core";
import { AppDialog } from "./dialog";
import { ConfirmDialog } from "../confirm-dialog/confirm-dialog";
import { MaterialModule } from "../../material-module";
import { AlertDialog } from "../alert-dialog/alert-dialog";
import { OkConfirmDialog } from '../ok-confirm-dialog/ok.confirm.dialog.component';
@NgModule({
  declarations: [AppDialog, ConfirmDialog, AlertDialog , OkConfirmDialog],
  imports: [MaterialModule],
  exports: [AppDialog, ConfirmDialog, AlertDialog , OkConfirmDialog],
  entryComponents: [AppDialog, ConfirmDialog, AlertDialog , OkConfirmDialog]
})
export class DialogModule {}
