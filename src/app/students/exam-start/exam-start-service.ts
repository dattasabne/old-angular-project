import { SearchEntity } from 'src/app/students/shared/entity/search-entity';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConstant } from "../../shared/app-constant/app-constatnt";

@Injectable({
  providedIn: "root"
})
export class ExamStartService {
  private header: HttpHeaders = null;
  public constructor(private http: HttpClient) {
    this.header = new HttpHeaders();
    this.header.set("Content-Type", "application/json");
  }
  public saveTestResult(data: any): Observable<any> {
    const url = AppConstant.SERVER_HOST.concat("/exam/save-exam-result");
    return this.http.post(url, data, {
      withCredentials: true,
      headers: this.header
    });
  }
  public downloadTestPdf(param:SearchEntity):Observable<any>{
    const url:string = AppConstant.SERVER_HOST.concat("/exam/download-testfile/"+ param.testId +"/"+ param.uniqueClassName +"/"+ param.batch);
    return this.http.get(url);
  }
}
