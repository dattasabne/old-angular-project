import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  public message:string;

  constructor(@Inject(MAT_DIALOG_DATA) private data:any) { }

  ngOnInit() {
    this.message = this.data.message;

  }
  public no():void{
    this.data.no();
  }
  public yes():void{
    this.data.yes();
  }
}
