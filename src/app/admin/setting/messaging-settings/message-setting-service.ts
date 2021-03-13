import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConstant } from "../../../shared/app-constant/app-constatnt";
import { Observable } from "rxjs";
import { ClassTemplates } from "./class_templates";

@Injectable({
  providedIn: "root"
})
export class MessageSettingService {
  private header: HttpHeaders = new HttpHeaders();
  public constructor(private http: HttpClient) {
    this.header.set("Content-Type", "application/json");
  }
  public saveTemplateData(data: any): Observable<any> {
    let url = AppConstant.SERVER_HOST.concat("/")
      .concat("admin")
      .concat("/")
      .concat("add-template");
    return this.http.post(url, data, {
      headers: this.header,
      withCredentials: true
    });
  }
  public displayOption(value: any): string {
    alert(value);
    return value.templateName;
  }
  public getAllTemplates(): Observable<any> {
    let url = AppConstant.SERVER_HOST.concat("/")
      .concat("admin")
      .concat("/")
      .concat("get-all-templates");
    return this.http.post(
      url,
      {},
      {
        headers: this.header,
        withCredentials: true
      }
    );
  }
  public editTemplate(data: any): Observable<any> {
    const url = AppConstant.SERVER_HOST.concat("/")
      .concat("admin")
      .concat("/")
      .concat("edit-template");
    return this.http.post(url, data, {
      headers: this.header,
      withCredentials: true
    });
  }
  public deleteTemplate(data: any): Observable<any> {
    const url = AppConstant.SERVER_HOST.concat("/")
      .concat("admin")
      .concat("/")
      .concat("delete-template");
    return this.http.post(url, data, {
      headers: this.header,
      withCredentials: true
    });
  }
}
