import { ResponseModel } from './../../website/model/response.model';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders , HttpResponse} from "@angular/common/http";
import { SearchEntity } from "../shared/entity/search-entity";
import { Observable } from "rxjs";
import { AppConstant } from "../../shared/app-constant/app-constatnt";
@Injectable({
  providedIn: "root"
})
export class SearchExamService {
  private header = null;
  public constructor(private http: HttpClient) {
    this.header = new HttpHeaders();
    this.header.set("Content-Type", "application/json");
  }
  public getAllAssignments(data: SearchEntity): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/exam/not-solved-exam"); // seerver api endpoint
    return this.http.post<ResponseModel>(url, data, {
      headers: this.header,
      withCredentials: true,
      observe:'response'
    });
  }
  public searchTestByFilter(data: SearchEntity): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/analysis/search-test-filter");
    return this.http.post<ResponseModel>(url, data, {
      headers: this.header,
      withCredentials: true,
      observe:'response'
    });
  }
  public loadExamPaper(data: SearchEntity): Observable<HttpResponse<ResponseModel>> {
    const url = AppConstant.SERVER_HOST.concat("/exam/load-exam-paper");
    return this.http.post<ResponseModel>(url, data, {
      headers: this.header,
      withCredentials: true,
      observe:'response'
    });
  }
}

