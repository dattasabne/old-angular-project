import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MessageSettingService } from "../../setting/messaging-settings/message-setting-service";
import { ClassTemplates } from "../../setting/messaging-settings/class_templates";
import { HttpErrorResponse ,HttpResponse } from "@angular/common/http";
import { DialogService } from "src/app/shared/services/dialog.service";
import { TemplateService } from "src/app/shared/services/template-service";
import { FormControl } from "@angular/forms";
import { ResponseModel } from "src/app/website/model/response.model";
@Component({
  selector: "firebase-notification",
  templateUrl: "./notification.html",
  styleUrls: ["./notification.css"]
})
export class FireBaseNotificationSender implements OnInit {
  public templateNameControl: FormControl = new FormControl();
  public allTemplate: Array<ClassTemplates> = new Array<ClassTemplates>();
  public previewText: string = "";
  public classTemplate: ClassTemplates = null;
  public httpLoader: Boolean = false;
  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private template: MessageSettingService,
    private templateService: TemplateService
  ) {}
  public cancel(): void {
    this.data.cancel_();
  }
  public send(): void {
    if (this.validate()) {
      this.data.send(this.classTemplate);
      this.data.cancel_();
    }
  }
  ngOnInit(): void {
    this.getAllTemplates();
    this.templateNameControl.valueChanges.subscribe((data: ClassTemplates) => {
      let defaultData = this.templateService.getDefaultTemplateValues();
      const text = data.templateText;
      const ketys = JSON.parse(data.templateKeys);
      const result = this.templateService.getTemplatePreView(
        text,
        ketys,
        defaultData
      );
      this.previewText = result;
      this.classTemplate = data;
    });
  }
  private validate(): boolean {
    if (
      !this.templateNameControl.value ||
      typeof this.templateNameControl.value != "object" ||
      this.classTemplate == null
    ) {
      this.data.alert.showAlert("Please Select Template.");
      return false;
    }
    return true;
  }
  public getAllTemplates(): void {
    this.httpLoader = true;
    this.template.getAllTemplates().subscribe(
      (res:HttpResponse<ResponseModel>) => {
        let responseModel:ResponseModel = res.body;
        this.httpLoader = false;
        this.allTemplate = responseModel.data;
      },
      (err: HttpErrorResponse) => {
        this.httpLoader = false;
        this.data.alert.showAlert(err.error.message);
      }
    );
  }
}
