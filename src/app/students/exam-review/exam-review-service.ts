import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { AppConstant } from "../../shared/app-constant/app-constatnt";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ExamReviewService {
  private header: HttpHeaders = new HttpHeaders();
  public constructor(private http: HttpClient) {
    this.header.set("Content-type", "application/json");
  }
  public getReviewData(data: any): Observable<HttpResponse<any>> {
    const url = AppConstant.SERVER_HOST.concat("/analysis/review-records");
    return this.http.post(url, data, {
      headers: this.header,
      withCredentials: true,
      observe:'response'
    });
  }
}
