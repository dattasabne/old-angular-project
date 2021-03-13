import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AppDialog } from "../dialog/dialog";
import { FireBaseNotificationSender } from "src/app/admin/firebase/notification-sender/notification.component";
import { ClassTemplates } from "src/app/admin/setting/messaging-settings/class_templates";
import { SmsShowerComponent } from "src/app/admin/sms-shower/sms-shower.component";
import { SmsStatusShowerComponent } from "src/app/admin/sms-status-shower/sms-status.component";

@Injectable({
  providedIn: "root"
})
export class DialogService {
  private dialogRef: MatDialogRef<FireBaseNotificationSender> = null;
  public constructor(private dialog: MatDialog) {}
  public showAlert(message: string): void {
    this.dialog.open(AppDialog, {
      data: {
        message: message
      },
      height: "200px",
      width: "500px"
    });
  }
  public sendFireBaseNotification(
    callBack: (template: ClassTemplates) => void
  ): void {
    if (this.dialogRef == null) {
      this.dialogRef = this.dialog.open(FireBaseNotificationSender, {
        data: {
          send: callBack,
          cancel_: () => {
            this.dialogRef.close();
            this.dialogRef = null;
          },
          alert: this
        },
        height: "500px",
        width: "600px"
      });
    }
  }
  private ref: any = null;

  public displayPreparedMessage(
    message: Array<any>,
    callBack: () => void
  ): void {
    if (this.ref == null) {
      this.ref = this.dialog.open(SmsShowerComponent, {
        height: "550px",
        width: "600px",
        data: {
          confirm: callBack,
          cancel: () => {
            this.ref.close();
            this.ref = null;
          },
          messageData: message
        }
      });
    }
  }
  public displayFireBaseResponse(message: Array<any>): void {
    const ref = this.dialog.open(SmsStatusShowerComponent, {
      height: "550px",
      width: "700px",
      data: {
        responseData: message,
        cancel: () => {
          ref.close();
        }
      }
    });
  }
}
