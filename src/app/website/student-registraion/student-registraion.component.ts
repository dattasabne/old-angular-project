import { ActivatedRoute } from '@angular/router';
import { small_dialog } from 'src/app/website/model/dialog-parameter';
import { ResponseModel } from 'src/app/website/model/response.model';
import { HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestParam } from './../../app-models/RequestParam';
import { BatchModel } from './batch.model';
import { StudentRegistrationHttpService } from './student.registration.http.service';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { StudentRegistrationModel } from './student.registration.model';
import { DialogService } from 'src/app/students/shared/services/dialog-service';
@Component({
  selector: 'app-student-registraion',
  templateUrl: './student-registraion.component.html',
  styleUrls: ['./student-registraion.component.css']
})
export class StudentRegistraionComponent implements OnInit {
  public isLoader: boolean = false;
  public constructor(private httpService:StudentRegistrationHttpService ,
    private dialog:DialogService ,
    private activeRoute:ActivatedRoute ){
  }
  public studentNameControl:FormControl = new FormControl('',[Validators.required]);
  public mobileNoControl:FormControl = new FormControl('',[Validators.required,Validators.pattern("^[7-9][0-9]{9}$")]);
  public passwordControl:FormControl = new FormControl('',[Validators.required]);
  public confirmPasswordControl = new FormControl('',[Validators.required]);
  public bacthControl:FormControl = new FormControl('',[Validators.required]);
  public courseControl:FormControl = new FormControl('',[Validators.required]);
  public gendorControl:FormControl = new FormControl('',[Validators.required]);
  public batches:BatchModel[]
  public courses:string[] = [];
  public notMatchConfirmPassword:boolean = true;
  public registrationModel:StudentRegistrationModel = {} as StudentRegistrationModel;
  private webLink:string = null;
  public loginPageLink:string = null;
  ngOnInit() {
    this.activeRoute.paramMap.subscribe(param=>{
    this.webLink = param.get("link");
    this.loginPageLink = "/"+this.webLink;
  });
    this.bacthControl.valueChanges.subscribe((batch:BatchModel) =>{
      this.courses = batch.courses;
      if(!Array.isArray(this.courses) || this.courses.length === 0){
        this.courses = [];
        return;
      }
      this.courseControl.setValue([this.courses[0]]);
    });

    this.mobileNoControl.valueChanges.subscribe(mobileNo =>{

    });
    this.passwordControl.valueChanges.subscribe(password => {
      this.notMatchConfirmPassword = this.isNotSame(password , this.confirmPasswordControl.value);
    });
    this.confirmPasswordControl.valueChanges.subscribe(password => {
      this.notMatchConfirmPassword = this.isNotSame(password , this.passwordControl.value);
    });

    const param:RequestParam = new RequestParam();
    param.setLink(this.webLink);
    this.httpService.getBatchData(param).subscribe({next:this.batchHttpResonseHandler.bind(this),error:this.httpErrorResponseHandler.bind(this)});
  }
  private batchHttpResonseHandler( response:HttpResponse<ResponseModel> ):void{
    this.batches = response.body.data;
    if(!Array.isArray(this.batches)){
      this.batches = [];
      return;
    }
    const defaultBatch:BatchModel[] = this.batches.filter(batch => batch.default === true);
    if(defaultBatch && defaultBatch.length > 0){
      this.bacthControl.setValue(defaultBatch[0],{onlySelf:true});
    }
    console.log(response);
  }
  private httpErrorResponseHandler(error:HttpErrorResponse):void{3
      this.isLoader = false;
      if(error.status === 0){
          alert("connection error ");
      }else{
        this.dialog.showAlert(error.message , small_dialog);
        alert(error.message);
      }
  }
  public isNotSame(s1:string , s2:string): boolean{
    s1 = (s1)? s1.trim().toUpperCase():'';
    s2 = (s2)? s2.trim().toUpperCase():'';
    return (s1 !== s2);
  }
  public register():void{
    const isValid = (this.studentNameControl.valid
      && this.mobileNoControl.valid
      && this.passwordControl.valid
      && this.confirmPasswordControl.valid
      && (this.notMatchConfirmPassword === false)
      && this.bacthControl.valid
      && this.courseControl.valid
      && this.gendorControl.valid );
      if(!isValid){
        this.studentNameControl.markAllAsTouched();
        this.passwordControl.markAllAsTouched();
        this.confirmPasswordControl.markAllAsTouched();
        this.bacthControl.markAllAsTouched();
        this.courseControl.markAllAsTouched();
        this.gendorControl.markAsDirty();
        this.passwordControl.markAllAsTouched();
        this.mobileNoControl.markAllAsTouched();
       }else{
        this.isLoader = true;
        const studentList:StudentRegistrationModel[] = [];
        for(let course of this.courseControl.value){
          const student: StudentRegistrationModel = {} as StudentRegistrationModel;
          student.studentName = this.studentNameControl.value;
          student.mobileNo    = this.mobileNoControl.value;
          student.password    = this.passwordControl.value;
          student.gender      = this.gendorControl.value;
          student.batch       = (this.bacthControl.value as BatchModel).batch;
          student.course      = course;
          student.classLink   = this.webLink;
          studentList.push(student);
        }
        this.httpService.studentRegistration(studentList).subscribe({next:this.registrationSuccessHandler.bind(this),error:this.httpErrorResponseHandler.bind(this)});
      }
  }
  public registrationSuccessHandler(response: HttpResponse<ResponseModel>): void{
    this.isLoader = false;
    this.dialog.showAlert(response.body.message,small_dialog);
  }
}
