import { HttpErrorResponse } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClassTestService } from './class-test.service';
import { GeneralUtility } from 'src/app/shared/utility/general-utility';
import { ResponseModel } from 'src/app/website/model/response.model';
@Component({
  selector: 'app-class-test-details',
  templateUrl: './class-test-details.component.html',
  styleUrls: ['./class-test-details.component.css']
})
export class ClassTestDetailsComponent implements OnInit {
  public allRecords:Array<any> = new Array<any>();
  public optionMenu:Array<any> = new Array<any>();
  public isLoaded:boolean = false;
  public courseControl:FormControl = new FormControl('ALL',[]);
  public uniqueClassControl:FormControl = new FormControl('ALL',[]);
  public branchControl:FormControl = new FormControl('ALL',[]);
  public batchControl:FormControl = new FormControl('ALL',[]);
  public divisionControl:FormControl = new FormControl('ALL',[]);
  public subDivisionControl:FormControl = new FormControl('ALL',[]);
  public fromDateControl: FormControl = new FormControl("", []);
  public toDateControl: FormControl = new FormControl("", []);

  public allUniqueClasses:Array<any> = new Array<any>();
  public allBatches:Array<any> = new Array<any>();
  public allCourses:Array<any> = new Array<any>();
  public allBranches:Array<any> = new Array<any>();
  public divisions:Array<any> = new Array<any>();
  public subDivisions:Array<any> = new Array<any>();
  public isRecordLoaded:boolean
  constructor(private classTestService: ClassTestService,
    private change:ChangeDetectorRef) { }

  ngOnInit() {
    this.getAllUniqueClasses();
    this.uniqueClassControl.valueChanges.subscribe(value=>{
      this.getClassBatchCourseBranch();
    });

    this.branchControl.valueChanges.subscribe(value=>{
      this.getClassDivision();
    });

    this.divisionControl.valueChanges.subscribe(value=>{
      this.getClassSubDivision();
    });
  }
  public httpLoader:Boolean = false;
  public getAllUniqueClasses():void {
    this.httpLoader = true;
    this.classTestService.getAllUniqueClasses()
      .subscribe(
        (res:HttpResponse<ResponseModel>) => {
          let responseModel:ResponseModel = res.body;
          this.allUniqueClasses = responseModel.data;
          this.httpLoader = false;
        },
        (err:HttpErrorResponse) => {
          console.log(err);
          this.httpLoader = false;
        }
      );
    }

    public getClassBatchCourseBranch():void {
      this.httpLoader = true;
       const data = {
         uniqueClassName: this.uniqueClassControl.value.uniqueClassName
       }

      this.classTestService.getClassBatchCourseBranch(data)
        .subscribe(
          (res:HttpResponse<ResponseModel>)=> {
            let responseModel:ResponseModel = res.body;
            this.allCourses = responseModel.data.course;
            this.allBranches = responseModel.data.branch;
            this.allBatches = responseModel.data.batch;
            this.httpLoader = false;
          },
          (err:HttpErrorResponse) => {
            console.log(err);
            this.httpLoader = false;
          }
        );
      }

      public getClassDivision():void {
        this.httpLoader = true;
        const data = {
          uniqueClassName: this.uniqueClassControl.value.uniqueClassName,
          batch:this.batchControl.value.name,
          course:this.courseControl.value.name,
          branch:this.branchControl.value.name
        }
       this.classTestService.getClassDivision(data)
         .subscribe(
           (res:HttpResponse<ResponseModel>) => {
             let responseModel:ResponseModel = res.body;
             this.divisions = responseModel.data.division;
             this.httpLoader = false;
           },
           (err:HttpErrorResponse) => {
             console.log(err);
             this.httpLoader = false;
           }
         );
       }

       public getClassSubDivision():void {
        this.httpLoader = true;
        const data = {
          uniqueClassName: this.uniqueClassControl.value.uniqueClassName,
          batch:this.batchControl.value.name,
          course:this.courseControl.value.name,
          branch:this.branchControl.value.name,
          division:this.divisionControl.value.name
        }
       this.classTestService.getClassSubDivision(data)
         .subscribe(
           (res:HttpResponse<ResponseModel>) => {
             let responseModel:ResponseModel = res.body;
             this.subDivisions = responseModel.data.subDivision;
             this.httpLoader = false;
           },
           (err:HttpErrorResponse) => {
             console.log(err);
             this.httpLoader = false;
           }
         );
       }
       public search():void {
        this.httpLoader = true;
        const data = {
          uniqueClassName:GeneralUtility.getValueFilter(this.uniqueClassControl.value,'uniqueClassName'),
          batch: GeneralUtility.getValueFilter(this.batchControl.value,'name'),
          course:GeneralUtility.getValueFilter(this.courseControl.value,'name'),
          branch:GeneralUtility.getValueFilter(this.branchControl.value,'name'),
          division:GeneralUtility.getValueFilter(this.divisionControl.value,'name'),
          subDivision:GeneralUtility.getValueFilter(this.subDivisionControl.value,'name'),
          fromDate:GeneralUtility.dateFilter(
            GeneralUtility.convertDateIntoDbDate(this.fromDateControl.value)
          ),
          toDate:GeneralUtility.dateFilter(
            GeneralUtility.convertDateIntoDbDate(this.toDateControl.value)
          )
        }
       this.classTestService.search(data)
         .subscribe(
           res => {
             this.httpLoader = false;
           },
           err => {
             console.log(err);
             this.httpLoader = false;
           }
         );
       }

      public getNotNullClasess($class:any):string{
      if( ($class['className'] && $class['className'].trim())){
        return $class['className'];
      }
      if( ($class['uniqueClassName'] && $class['uniqueClassName'].trim())){
        return $class['uniqueClassName'];
      }
      return 'Name or Not Available';
    }
  }


