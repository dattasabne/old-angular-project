import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient ,HttpResponse } from "@angular/common/http";
import { AppComponent } from "../../app.component";
import { AppConstant } from "../../shared/app-constant/app-constatnt";
import { Observable } from "rxjs";
import { ResponseModel } from "src/app/website/model/response.model";
@Injectable({
  providedIn: "root"
})
export class AnalysisService {
  public headers: HttpHeaders = null;
  public constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.set("ContentType", "application/json");
  }
  public getTestResults(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/analysis/analysis-records");
    return this.http.post<ResponseModel>(url, data, {
      withCredentials: true,
      headers: this.headers,
      observe:'response'
    });
  }
}
