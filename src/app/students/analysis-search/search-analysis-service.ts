import { ResponseModel } from './../../website/model/response.model';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders ,HttpResponse} from "@angular/common/http";
import { AppConstant } from "../../shared/app-constant/app-constatnt";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SearchAnalysisService {
  private headers: HttpHeaders = null;
  public constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.set("Content-Type", "application/json");
  }
  public getAllWeekDates(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/analysis/get-week-dates");
    return this.http.post<ResponseModel>(url, data, {
      withCredentials: true,
      headers: this.headers,
      observe:'response'
    });
  }
  public getChapterNames(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/analysis/get-chapter-name");
    return this.http.post<ResponseModel>(url, data, {
      withCredentials: true,
      headers: this.headers,
      observe:'response'
    });
  }
  public searchChapterWiseTest(data: any): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat(
      "/analysis/chapterwise-test-search"
    );
    return this.http.post<ResponseModel>(url, data, {
      withCredentials: true,
      headers: this.headers,
      observe:'response'
    });
  }
}
