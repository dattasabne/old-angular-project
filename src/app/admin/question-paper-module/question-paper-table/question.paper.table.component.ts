import { MediaChange } from '@angular/flex-layout';
import { MediaObserver } from '@angular/flex-layout';
import { Record } from './../models/question.data.model';
import { Component, Input } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { OnInit} from '@angular/core';
import { ResponsiveService } from 'src/app/shared/services/responsive.service';

@Component({
  selector: 'question-paper-table',
  templateUrl: './question.paper.table.html',
  styleUrls:['./../question-paper-component/question.paper.component.css', './question.paper.table.css',]
})
export class QuestionPaperTable implements OnInit , AfterViewInit {

  public isMobileDevice:boolean = false;
  public allSubjects:Record[] = [];
  public constructor(private media:MediaObserver, private device:ResponsiveService){

  }
  ngOnInit() {
    this.media.asObservable().subscribe((chnage:MediaChange[])=>{
        this.isMobileDevice = this.device.isMobileDevice();
    });
    this.isMobileDevice = this.device.isMobileDevice();
  }
  ngAfterViewInit(){}
  @Input("data")
  public set data(allSubjects:Record[]){
    this.allSubjects = allSubjects;
  }
}
