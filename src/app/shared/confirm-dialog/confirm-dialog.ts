import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppDialog } from "../dialog/dialog";
import { AdminMenu } from "../../admin/admin-menu/admin-menu";
@Component({
  selector: "confirm-dialog",
  templateUrl: "./confirm-dialog.html",
  styleUrls: ["./confirm-dialog.css"]
})
export class ConfirmDialog {
  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AdminMenu>
  ) {}
  public noCallBack(): void {
    this.data.source.no();
  }
  public yesCallBack() {
    this.data.source.yes();
  }
}
