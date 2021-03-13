import { Component, OnInit, Inject, OnChanges } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "sms-shower",
  templateUrl: "./sms-shower.component.html",
  styleUrls: ["./sms-shower.component.css"]
})
export class SmsShowerComponent implements OnInit, OnChanges {
  public allMessages: Array<any> = new Array<any>();
  public constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {
    this.allMessages = this.data.messageData;
  }
  ngOnChanges(): void {}
  public allRight(): void {
    this.data.confirm();
    this.data.cancel();
  }
  public cancel(): void {
    this.data.cancel();
  }
  public isValidFirbaseRecord(record: any): boolean {
    if (
      !(
        record &&
        record.authentication.cloudKey &&
        record.authentication.cloudKey.trim()
      )
    ) {
      return false;
    }
    return true;
  }
}
