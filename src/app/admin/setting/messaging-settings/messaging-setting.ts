import {
  Component,
  ViewEncapsulation,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from "@angular/core";
import { TemplateOption } from "./template.interface";
import { SMSTemplateInterface } from "../../../shared/interfaces/sms-template.interface";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AppDialog } from "../../../shared/dialog/dialog";
import { AlertDialog } from "../../../shared/alert-dialog/alert-dialog";
import { StudentDetails } from "../../entity/student-details";
import { StudentAssignment } from "../../entity/student-assignment";
import { ClassDetails } from "../../entity/class-details";
import { MessageSettingService } from "./message-setting-service";
import { HttpErrorResponse } from "@angular/common/http";
import { ConfirmDialog } from "../../../shared/confirm-dialog/confirm-dialog";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { ClassTemplates } from "./class_templates";
import { TemplateService } from "src/app/shared/services/template-service";
@Component({
  selector: "messaging-setting",
  templateUrl: "./messaging-setting.html",
  styleUrls: ["./messaging-setting.css"]
})
export class MessagingSettingComponent implements OnInit, AfterViewInit {
  public smstemplateNames: Array<SMSTemplateInterface> = null;
  public templateDataControl: FormControl = new FormControl("", []);
  public templatePreviewControl: FormControl = new FormControl("", []);
  public searchKeyControl: FormControl = new FormControl();
  public studentDetailsOptionData: StudentDetails;

  public editTemplateTextControl: FormControl = new FormControl();
  public editTemplateNameControl: FormControl = new FormControl();
  public editTemplatePreviewControl: FormControl = new FormControl();
  public editSearchKeyControl: FormControl = new FormControl();

  public deleteTemplateTextControl: FormControl = new FormControl();
  public deleteTemplateNameControl: FormControl = new FormControl();
  public deleteTemplatePreviewControl: FormControl = new FormControl();
  public deleteSearchKeyControl: FormControl = new FormControl();
  public deleteSelectControl: FormControl = new FormControl();
  public httpLoader: Boolean = false;

  public constructor(
    private change: ChangeDetectorRef,
    private dialog: MatDialog,
    private http: MessageSettingService,
    private template: TemplateService
  ) {
    this.smstemplateNames = new Array<SMSTemplateInterface>();
  }
  public filteredOptions: Observable<string[]>;
  public allTemplates: Array<ClassTemplates> = null;
  ngOnInit() {
    this.generateSmsTemplateNames();
    this.getAllTemplates();
  }
  public displayOption = (template: ClassTemplates) => {
    if (template != null) {
      this.editTemplateNameControl.setValue(template.templateName, {
        onlySelf: true
      });
      this.editTemplateTextControl.setValue(template.templateText, {
        onlySelf: true
      });
      this.editTemplatePreview();
      return template.templateName;
    }
  };

  public deleteDisplayOption = (template: ClassTemplates) => {
    if (template != null) {
      this.deleteTemplateNameControl.setValue(template.templateName, {
        onlySelf: true
      });
      this.deleteTemplateTextControl.setValue(template.templateText, {
        onlySelf: true
      });
      this.deleteTemplatePreview();
      return template.templateName;
    }
  };
  private deleteTemplatePreview(): void {
    let text = this.deleteTemplateTextControl.value || "";
    let data = this.generateTotalOptionIndex(text);
    let result = this.createTemplatePreview(text, data);
    this.deleteTemplatePreviewControl.setValue(result, { onlySelf: true });
  }

  public editTemplatePreview(): void {
    let text = this.editTemplateTextControl.value || "";
    let data = this.generateTotalOptionIndex(text);
    let result = this.createTemplatePreview(text, data);
    this.editTemplatePreviewControl.setValue(result, { onlySelf: true });
  }

  public createTemplatePreview(text: string, keyOption: Array<string>): string {
    keyOption.forEach(key => {
      let pattern = "(\\{\\s*" + key.trim() + "\\s*\\})";
      if (/[\$]+/.test(key)) {
        pattern = "(\\{\\s*\\" + key.trim() + "\\s*\\})";
      }
      text = text.replace(
        new RegExp(pattern),
        this.studentDetailsOptionData[key]
      );
    });
    return text;
  }

  public getAllTemplates(): void {
    this.httpLoader = true;
    this.http.getAllTemplates().subscribe(
      res => {
        this.allTemplates = res.data;
        this.httpLoader = false;
      },
      (err: HttpErrorResponse) => {
        this.httpLoader = false;
        this.showMessage(err.error.message);
      }
    );
  }

  ngAfterViewInit() {}
  private dialogRef: MatDialogRef<any> = null;
  public selectedNames = [];

  private getTotalCheckedCount(): number {
    let count = 0;
    this.smstemplateNames.forEach(item => {
      if (item.checked) {
        count++;
      }
    });
    return count;
  }
  public initializeStudentDetails(): StudentDetails {
    let studentDetails: StudentDetails = this.template.getDefaultTemplateValues();
    return studentDetails;
  }
  public initializeClassDetails(): ClassDetails {
    let classDetails = <ClassDetails>{};
    classDetails.uniqueClassName = "Kosh edutech";
    classDetails.classAppLogo = "logo";
    classDetails.classAppName = "Kosh Edutech";
    return classDetails;
  }

  public isDuplicateKey(source: any, data: string): boolean {
    if (typeof source === "object") {
      for (let key in source) {
        if (key == data) {
          return true;
        }
      }
    }
    return false;
  }

  public generateTotalOptionIndex(text: string): Array<string> {
    let match = text.match(/\{\s*([\$a-zA-Z])+\s*\}/g) || [];
    let data = [];
    match.forEach(item => {
      data.push(this.removeCurlyBrace(item));
    });

    return data;
  }

  public removeCurlyBrace(str: string): string {
    let arr = str.replace("{", "");
    arr = arr.replace("}", "");
    return arr.trim();
  }
  public generateSmsTemplateNames(): void {
    let studentDetails = this.initializeStudentDetails();
    this.studentDetailsOptionData = studentDetails;
    for (let key in studentDetails) {
      let option = <SMSTemplateInterface>{};
      option.name = key;
      this.smstemplateNames.push(option);
    }
  }
  public clipBoard = {
    isPast: false,
    keyName: "",
    background: "",
    divRef: null,
    color: "white"
  };

  public keyClick(key: string, e: MouseEvent): void {
    if (this.clipBoard.divRef != null) {
      this.clipBoard.divRef.style.background = "none";
      this.clipBoard.divRef.style.color = "black";
    }
    this.clipBoard.isPast = true;
    this.clipBoard.keyName = key;
    this.clipBoard.background = "green";
    this.clipBoard.color = "white";
    (<HTMLDivElement>e.target).style.background = this.clipBoard.background;
    (<HTMLDivElement>e.target).style.color = this.clipBoard.color;
    this.clipBoard.divRef = <HTMLDivElement>e.target;
  }

  public pastTemplateKey(e: MouseEvent): void {
    if (this.clipBoard.isPast) {
      let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>e.target;
      let index = textArea.selectionStart;
      let text = textArea.value;
      let output = this.selection(index, text, this.clipBoard.keyName);
      this.templateDataControl.setValue(output, { onlySelf: true });
      this.clipBoard.background = "none";
      this.clipBoard.divRef.style.background = this.clipBoard.background;
      this.clipBoard.divRef.style.color = "black";
    }
    this.clipBoard.isPast = false;
  }
  public editPastTemplateKey(e: MouseEvent): void {
    if (this.clipBoard.isPast) {
      let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>e.target;
      let index = textArea.selectionStart;
      let text = textArea.value;
      let output = this.selection(index, text, this.clipBoard.keyName);
      this.editTemplateTextControl.setValue(output, { onlySelf: true });
      this.clipBoard.background = "none";
      this.clipBoard.divRef.style.background = this.clipBoard.background;
      this.clipBoard.divRef.style.color = "black";
    }
    this.clipBoard.isPast = false;
  }
  private selection(index: number, str: string, data: string): string {
    let first = str.substr(0, index);
    let second = str.substr(index, str.length - first.length);
    data = "{ " + data + " }";
    let dd = first + data + second;
    return dd;
  }
  public keyOptionArray: Array<any> = new Array<any>();
  public templatePreview(): void {
    let text: string = this.templateDataControl.value;
    let keyData = this.generateTotalOptionIndex(text);
    this.keyOptionArray = keyData;
    let data = this.initializeStudentDetails();

    keyData.forEach(key => {
      let pattern = "(\\{\\s*" + key.trim() + "\\s*\\})";
      if (/[\$]+/.test(key)) {
        pattern = "(\\{\\s*\\" + key.trim() + "\\s*\\})";
      }

      text = text.replace(new RegExp(pattern), data[key]);
    });
    this.templatePreviewControl.setValue(text, { onlySelf: true });
  }

  private showMessage(message: string): void {
    if (this.dialogRef == null) {
      this.dialogRef = this.dialog.open(AlertDialog, {
        data: {
          message: message,
          ok: () => {
            this.dialogRef.close();
            this.dialogRef = null;
          }
        },
        height: "300px",
        width: "500px"
      });
    }
  }
  private validator(): boolean {
    if (
      !(this.templateNameControl.value && this.templateNameControl.value.trim())
    ) {
      this.showMessage("Please Enter Template Name.");
      return false;
    }
    if (
      !(this.templateDataControl.value && this.templateDataControl.value.trim())
    ) {
      this.showMessage("Please Enter Template Data.");
      return false;
    }
    return true;
  }
  private editValidator(): boolean {
    if (!this.selectTemplateControl.value) {
      this.showMessage("Please Enter Template Name.");
      return false;
    }

    if (
      !(
        this.editTemplateNameControl.value &&
        this.editTemplateNameControl.value.trim()
      )
    ) {
      this.showMessage("Please Enter Template Name.");
      return false;
    }
    if (
      !(
        this.editTemplateTextControl.value &&
        this.editTemplateTextControl.value.trim()
      )
    ) {
      this.showMessage("Please Enter Template Data.");
      return false;
    }
    return true;
  }
  private deleteValidator(): boolean {
    if (!this.deleteSelectControl.value) {
      this.showMessage("Please Select Template First.");
      return false;
    }
    if (!this.deleteTemplateTextControl.value) {
      this.showMessage("Please Select Template First.");
      return false;
    }
    return true;
  }
  public deleteConfirmTemplate() {
    if (!this.deleteValidator()) {
      return;
    }
    this.deleteTemplatePreview();

    if (this.dialogRef == null) {
      this.dialogRef = this.dialog.open(ConfirmDialog, {
        data: {
          source: {
            yes: () => {
              this.dialogRef.close();
              this.dialogRef = null;
              this.deleteTemplate();
            },
            no: () => {
              this.dialogRef.close();
              this.dialogRef = null;
            }
          },
          message: "Do You Want To Delete Template ?"
        },
        height: "300px",
        width: "500px"
      });
    }
  }
  private emptyAllControls(): void {
    this.deleteSearchKeyControl.setValue("", { onlySelf: true });
    this.deleteTemplateNameControl.setValue("", { onlySelf: true });
    this.deleteTemplatePreviewControl.setValue("", { onlySelf: true });
    this.deleteTemplateTextControl.setValue("", { onlySelf: true });
    this.deleteSelectControl.setValue(null, { onlySelf: true });
  }

  public deleteTemplate(): void {
    this.httpLoader = true;
    const template = <ClassTemplates>{};
    template.id = this.deleteSelectControl.value.id;
    template.uniqueClassName = this.deleteSelectControl.value.uniqueClassName;

    this.http.deleteTemplate(template).subscribe(
      res => {
        if (res.result) {
          this.allTemplates = res.data;
        }
        this.showMessage(res.message);
        this.emptyAllControls();
        this.httpLoader = false;
      },
      (err: HttpErrorResponse) => {
        this.showMessage(err.error.message);
        this.httpLoader = false;
      }
    );
  }

  public editSaveConfirmTemplate() {
    if (!this.editValidator()) {
      return;
    }
    this.editTemplatePreview();

    if (this.dialogRef == null) {
      this.dialogRef = this.dialog.open(ConfirmDialog, {
        data: {
          source: {
            yes: () => {
              this.dialogRef.close();
              this.dialogRef = null;
              this.editSaveTemplate();
            },
            no: () => {
              this.dialogRef.close();
              this.dialogRef = null;
            }
          },
          message: "Do You Want To Update Template ?"
        },
        height: "300px",
        width: "500px"
      });
    }
  }

  public saveConfirmTemplate() {
    if (!this.validator()) {
      return;
    }

    this.templatePreview();
    if (this.dialogRef == null) {
      this.dialogRef = this.dialog.open(ConfirmDialog, {
        data: {
          source: {
            yes: () => {
              this.dialogRef.close();
              this.dialogRef = null;
              this.saveTemplate();
            },
            no: () => {
              this.dialogRef.close();
              this.dialogRef = null;
            }
          },
          message: "Do You Want To Save Template ?"
        },
        height: "300px",
        width: "500px"
      });
    }
  }

  public templateNameControl: FormControl = new FormControl();
  public selectTemplateControl: FormControl = new FormControl();

  public saveTemplate(): void {
    this.httpLoader = true;
    let text = this.templateDataControl.value;
    let data = {
      templateText: text,
      templateKeys: JSON.stringify(this.keyOptionArray),
      templateName: this.templateNameControl.value
    };
    this.http.saveTemplateData(data).subscribe(
      res => {
        this.allTemplates = res.data;
        this.httpLoader = false;
        this.showMessage(res.message);
      },
      (err: HttpErrorResponse) => {
        this.httpLoader = false;
        this.showMessage(err.error.message);
      }
    );
  }
  public editSaveTemplate(): void {
    this.httpLoader = true;
    let text = this.editTemplateTextControl.value;
    const template = <ClassTemplates>{};
    template.id = this.selectTemplateControl.value.id;
    template.templateKeys = JSON.stringify(this.generateTotalOptionIndex(text));
    template.templateName = this.editTemplateNameControl.value;
    template.templateText = this.editTemplateTextControl.value;
    template.uniqueClassName = this.selectTemplateControl.value.uniqueClassName;
    this.http.editTemplate(template).subscribe(
      res => {
        this.httpLoader = false;
        this.allTemplates = res.data;
        this.showMessage(res.message);
      },
      (err: HttpErrorResponse) => {
        this.httpLoader = false;
        this.showMessage(err.error.message);
      }
    );
  }
}
