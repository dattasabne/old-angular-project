import { Component, OnInit, Inject } from "@angular/core";
import { FireBaseEntity } from "../firebase/entity/firebase-entity";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "sms-status-shower",
  templateUrl: "./sms-status.component.html",
  styleUrls: ["./sms-status.component.css"]
})
export class SmsStatusShowerComponent implements OnInit {
  public allFireBaseResponse: Array<FireBaseEntity> = new Array<
    FireBaseEntity
  >();
  public constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  public fireBaseResponseStatus(status: string): boolean {
    let responseJson = JSON.parse(status);
    if (Number(responseJson.success) === 1) {
      return true;
    }
    return false;
  }
  public fireBaseResponseFailureReason(status: string): string {
    let responseJson = JSON.parse(status);
    return responseJson.results[0].error;
  }
  public ok(): void {
    this.data.cancel();
  }
  ngOnInit(): void {
    this.allFireBaseResponse = this.data.responseData;
  }
}
