import { MatSelectChange } from '@angular/material';
import { KoshAdminService } from './../http-service/kosh.admin.http.service';
import { DialogService } from 'src/app/students/shared/services/dialog-service';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ResponseModel } from 'src/app/website/model/response.model';
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
@Component({
  selector: 'app-kosh-data-conversion',
  templateUrl: './kosh-data-conversion.html',
  styleUrls: ['./kosh-data-conversion.css']
})
export class KoshDataConversionComponent implements OnInit , AfterViewInit{
  public allChapterIds:string[] = [];
  public lineLoader:boolean = false;
  public subjectName:string = null;
  public chapterId:string = null;
  public fileBase64:string = null;
  public constructor(private dialog:DialogService ,private http:KoshAdminService){}
  ngOnInit(){}
  ngAfterViewInit(){}

  private chapterids_successResponseHandler(response:HttpResponse<ResponseModel>):void{
    this.lineLoader = false;
    let responseModel = response.body;
    if(responseModel.result){
      this.allChapterIds = <string[]>responseModel.data;
    }else{
      this.dialog.showAlert(responseModel.message,{height:200,width:300});
    }
  }
  private error_responseHandler(error:HttpErrorResponse):void{
      this.lineLoader = false;
      if(error.status == 0){
        this.dialog.showAlert(AppConstant.NOCONNECT_RESPONSE,{height:300,width:500});
      }else{
        this.dialog.showAlert(error.message,{height:300,width:500});
      }
  }
  private loadChapterids(subjectName:string):void{
    this.lineLoader = true;
    let data:any = {};
    data.subjectName = subjectName;
    this.http.getChapterIds(data).subscribe({next:this.chapterids_successResponseHandler.bind(this),error:this.error_responseHandler.bind(this)} );
  }
  public subject_changeHandler(change:MatSelectChange):void{
    this.loadChapterids(change.value);
  }
  private submitData():void{
    let data :any= {}
    data.subjectName = this.subjectName;
    data.chapterId   = this.chapterId;
    data.file = this.fileBase64;
    this.lineLoader = true;

    this.http.submitToDataConversion(data).subscribe({next:this.submitData_successHandler.bind(this) ,error:this.error_responseHandler.bind(this)});
  }

  private submitData_successHandler(response:HttpResponse<ResponseModel>):void{
    this.lineLoader = false;
    let responseModel:ResponseModel = response.body;
    if(responseModel.result){
      console.log(responseModel);
    }else{
      this.dialog.showAlert(responseModel.message,{height: 300,width: 300});
    }
  }
  public fileChange_Handler(ev):void{
    let file:File = ev.target.files[0];
    let fileReader :FileReader = new FileReader();
    fileReader.onload = (e:any) =>{
      this.fileBase64 = <string> e.target.result;
      this.submitData();
    };
    fileReader.readAsText(file);
  }
}
