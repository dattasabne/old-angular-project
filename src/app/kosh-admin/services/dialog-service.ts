import { Injectable, Type, Component } from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialog } from "src/app/students/shared/dialogs/alert-dialog/alert-dialog";
import { ClassProfile } from 'src/app/shared/model/class-profile-model';
import { GeneratedTest } from 'src/app/admin/search-generated-test/generated-test-model';
import { ReprintTestDetailsComponent } from 'src/app/admin/reprint-test-details/reprint.test.details.component';

    @Injectable({
        providedIn:'root'
    })
    export class DialogService{
        public dialogRef:any = null;
        public constructor(private dialog:MatDialog){}

        public updateAndDeletepopup(
            type:any,classData:any,updateCallBack:(res:any)=>void,
            deletecallBack:(res:any)=>void
        ):void{
            if(this.dialogRef == null){
                this.dialogRef = this.dialog.open(type,{
                    height:"100%",
                    width:"90%",
                    panelClass: 'custom-dialog-container',
                    data:{
                        delete:(data:any)=>{
                            deletecallBack(data);
                            this.dialogRef.close();
                            this.dialogRef = null;
                        } ,
                        update:(data:any)=>{
                            updateCallBack(data);
                            this.dialogRef.close();
                            this.dialogRef = null;
                        },
                        close:()=>{
                            this.dialogRef.close();
                            this.dialogRef = null;
                        },
                        $class:classData
                    }
                });
            }
        }
        public viewTestPdfFiles(
            type:Type<any>,classData:ClassProfile,
            testData:GeneratedTest
        ):void{
            if(this.dialogRef == null){
                this.dialogRef = this.dialog.open(type,{
                    height:"100%",
                    width:"98%",
                    panelClass: 'custom-dialog-container',
                    data:{
                        close:()=>{
                            this.dialogRef.close();
                            this.dialogRef = null;
                        },
                        classData:classData,
                        testRecord:testData
                    }
                });
            }
        }
        public confirmRef:any = null;
        public confirmDialog( type:any, message:string , yesCallBack:()=>void ):void{
            if(this.confirmRef == null){
                this.confirmRef = this.dialog.open(type,{
                    height:"300px",
                    width:"400px",
                    panelClass: 'custom-dialog-container',
                    data:{
                        message:message,
                        yes:()=>{
                            yesCallBack();
                            this.confirmRef.close();
                            this.confirmRef = null;
                        } ,
                        no:()=>{
                            this.confirmRef.close();
                            this.confirmRef = null;
                        }

                    }
                });
            }
        }
        public createAndEditpopup(
            type:any,classData:any,createCallBack:(res:any)=>void

        ):void{
            if(this.dialogRef == null){
                this.dialogRef = this.dialog.open(type,{
                    height:"500px",
                    width:"500px",
                    panelClass: 'custom-dialog-container',
                    data:{
                        create:(data:any)=>{
                            createCallBack(data);
                            this.dialogRef.close();
                            this.dialogRef = null;
                        } ,
                        edit:(data:any)=>{
                            createCallBack(data);
                            this.dialogRef.close();
                            this.dialogRef = null;
                        },
                        close:()=>{
                            this.dialogRef.close();
                            this.dialogRef = null;
                        },
                        $class:classData
                    }
                },);
            }
        }
        public alertRef:any = null;
        public showAlert(message: string,size:any,selectionCallback:(res:any)=>void): void {
            if(this.alertRef!=null){
                return;
            }
             this.alertRef = this.dialog.open(AlertDialog,{
                  data: {
                    message: message,
                    ok:(data:any)=>{
                        selectionCallback(data);
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
