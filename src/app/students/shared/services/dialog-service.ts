import { Injectable } from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialog } from "../dialogs/alert-dialog/alert-dialog";
import { OkConfirmDialog } from 'src/app/shared/ok-confirm-dialog/ok.confirm.dialog.component';

@Injectable({
    providedIn:'root'
})
export class DialogService{
    public dialogRef:MatDialogRef<ConfirmDialogComponent> = null;
    public okConfirmDialogRef :MatDialogRef<OkConfirmDialog> = null ;
    public constructor(private dialog:MatDialog){}
    public okConfirmDialog(message:string , ok:()=>void , size:{height:number,width:number} = {height:200, width:500}):void{
      if(this.okConfirmDialogRef == null){
        let handler = {
          height : size.height +"px",
          width  : size.width +"px",
          panelClass: 'custom-dialog-container',
          data : {
              message : message ,
              ok :()=>{
                ok();
                this.okConfirmDialogRef .close();
                this.okConfirmDialogRef = null;
              }
          }
        };
        this.okConfirmDialogRef = this.dialog.open(OkConfirmDialog ,handler);
      }
    }




    public confirmDialog( message:string , yesCallBack:()=>void ):void{

        if(this.dialogRef == null){
            this.dialogRef = this.dialog.open(ConfirmDialogComponent,{
                height:"300px",
                width:"500px",
                panelClass: 'custom-dialog-container',
                data:{
                    message:message,
                    yes:()=>{
                        yesCallBack();
                        this.dialogRef.close();
                        this.dialogRef = null;
                    } ,
                    no:()=>{
                        this.dialogRef.close();
                        this.dialogRef = null;
                    }

                }
            });
        }
    }
    private alertRef = null;
    public showAlert(message: string,size:any): void {
    if(this.alertRef!=null){
        return;
    }
     this.alertRef =   this.dialog.open(AlertDialog, {
          data: {
            message: message,
            ok:()=>{
                this.alertRef.close();
                this.alertRef = null;
            }
          },
          height: (size.height+"px"),
          width: (size.width+"px"),
          panelClass: 'custom-dialog-container',
        });
      }
}
