import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.html",
  styleUrls: ["./dialog.css"]
})
export class AppDialog {
  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AppDialog>
  ) {}
  public closeDialog(): void {
    this.dialogRef.close();
  }
}
