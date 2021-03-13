import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector:'ok-confirm-dialog',
  templateUrl:'./ok.confirm.dialog.html',
  styleUrls: ['./ok.confirm.dialog.css']
})
export class OkConfirmDialog implements OnInit {
  public constructor(@Inject(MAT_DIALOG_DATA) private data:any){}
  public message:string = "";
  public ok():void{
    this.data.ok();
  }
  ngOnInit(){
    this.message = this.data.message;
  }
}
