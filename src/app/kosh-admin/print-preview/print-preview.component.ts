import { Component, OnInit, Inject } from '@angular/core';
import { DialogService } from '../services/dialog-service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.css']
})
export class PrintPreviewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data:any,
  private dialog:DialogService) { }

  ngOnInit() {
  }
  public printPreview():void {
    this.dialog.confirmDialog(
      ConfirmDialogComponent, 
      "Do You Want To Print the Paper",
      this.reallyUpdate.bind(this)
    );
  }
  public cancel():void {
    this.dialog.confirmDialog(
      ConfirmDialogComponent, 
      "Do You Want To Cancel the Print",
      this.reallyDelete.bind(this)
    );
  }
  public reallyDelete():void{
    this.data.delete(this.data.$class);
  }
  public reallyUpdate():void{
    this.data.update(this.data.$class);
  }
  public close():void{
    this.data.close();
  }
}
