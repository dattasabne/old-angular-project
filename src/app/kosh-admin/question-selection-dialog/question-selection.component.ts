import { Component, OnInit, Inject } from '@angular/core';
import { DialogService } from '../services/dialog-service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialog } from 'src/app/shared/alert-dialog/alert-dialog';
import { GenerateTable, Chapters } from '../generate-table-entity/generate-table';
import { PrintPreviewComponent } from '../print-preview/print-preview.component';

@Component({
  selector: 'app-question-selection',
  templateUrl: './question-selection.component.html',
  styleUrls: ['./question-selection.component.css']
})
export class QuestionSelectionComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data:any,
  private dialog:DialogService) { }

  ngOnInit() {
  }
  public table = <Chapters>{};
  public alertMessageData = {
    height:200,
    width:300
  }
  public create() {
    this.data.create()
  }
  public close():void{
    this.data.close(this.data.$class);
  }
  public upload() {
    let msg = "Do You Really Want To Upload The Test"
    this.dialog.confirmDialog(ConfirmDialogComponent,msg,this.uplaodTest.bind(this))
  }
  public preview(table:Chapters):void {
    alert(this.table);
  }
 public clickOnRecord(table:Chapters):void {
    this.dialog.updateAndDeletepopup(
      PrintPreviewComponent, 
      this.table,
      this.preview.bind(this),
      this.upload.bind(this)
    );
  }
 public uplaodTest() {
  let msg = "Test Uploaded Successfully."
  this.dialog.showAlert(msg,this.alertMessageData,this.clickOnRecord.bind(this));
  this.data.close();
 } 
}
