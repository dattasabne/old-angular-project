import { Injectable } from "@angular/core";
import * as xls from "xlsx";

@Injectable({
  providedIn: "root"
})
export class ExcelService {
  public constructor() {}
  public exportToExcel(data: Array<Array<any>>, sheetName: string): void {
    const fileName = sheetName.concat(".xlsx");
    const workSheet: xls.WorkSheet = xls.utils.aoa_to_sheet(data);
    const workBook: xls.WorkBook = xls.utils.book_new();
    xls.utils.book_append_sheet(workBook, workSheet, fileName);
    xls.writeFile(workBook, fileName);
  }
  public importExcelAsJson(data:any):Array<Array<string>>{
    const work_book:xls.WorkBook = xls.read(data,{type:'binary'});
    const workbook_name = work_book.SheetNames[0];
    const work_sheet:xls.WorkSheet = work_book.Sheets[workbook_name];
    const json:Array<Array<string>> = xls.utils.sheet_to_json(work_sheet,{header:1});
    return json;
  }
}
