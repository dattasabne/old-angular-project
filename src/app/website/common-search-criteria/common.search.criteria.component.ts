import { Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-common-search-criteria',
  styleUrls: ['./common.search.criteria.css'],
  templateUrl: './common.search.criteria.html',
  encapsulation:ViewEncapsulation.None
})
export class CommonSearchCriteriaComponent implements OnInit , AfterViewInit{

  public constructor(){}
  ngOnInit(){}
  ngAfterViewInit(){}
  @Output("academicYearChange")
  public academicYear:EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();
  @Output("patternChange")
  public pattern:EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();
  @Output("classNameChange")
  public className:EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();
  @Output("testTypeChange")
  public testType:EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();
  @Output("subjectsChange")
  public subjects:EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();
  public academicYearData:string[] = [];
  public patternData:string [] = [];
  public classData:string[] = [];
  public testTypeData:string[] = [];
  public subjectData:string[] = [];

  @Input("academicYearData")
  public set academicYearParameter(academicYear:string[]){
    this.academicYearData = academicYear;
  }
  @Input("patternData")
  public set patternDataParameter(pattern:string[]){
    this.patternData = pattern;
  }
  @Input("classData")
  public set classDataParameter(classData:string[]){
    this.classData = classData;
  }
  @Input("testTypeData")
  public set testTypeDataParameter(testType:string[]){
    this.testTypeData = testType;
  }
  @Input("subjectData")
  public set subjectDataParameter(subjects:string[]){
    this.subjectData = subjects;
  }
  public changeAcademicYear_Handler(select:MatSelectChange){
    this.academicYear.emit(select);
  }
  public changePattern_Handler(select:MatSelectChange){
    this.pattern.emit(select);
  }
  public changeClassName_Handler(select:MatSelectChange){
    this.className.emit(select);
  }
  public changeTestType_Handler(select:MatSelectChange){
    this.testType.emit(select);
  }
  public changeSubjects_Handler(select:MatSelectChange){
    this.subjects.emit(select);
  }
}
