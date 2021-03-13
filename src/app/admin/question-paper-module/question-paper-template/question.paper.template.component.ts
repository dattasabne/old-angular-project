import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Input } from '@angular/core';
import { Record } from './../models/question.data.model';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-paper-template',
  styleUrls: ['./question.paper.css'],
  templateUrl: './question.paper.html'
})
export class QuestionPaperTemplate implements OnInit , AfterViewInit{
  public allSubjects:Record[] = [];
  public isMobileDevice:boolean = false;

  public constructor(private media:MediaObserver){

  }

  private checkDevice():boolean{
    return this.media.isActive(['xs','sm']);
  }

  ngOnInit(){
    this.isMobileDevice = this.checkDevice();
    this.media.asObservable().subscribe((change:MediaChange[])=>{
      this.isMobileDevice = this.checkDevice();
    })

  }





  @Input("data")
  public set data(data:Record[]){
    this.allSubjects = data;
  }
  ngAfterViewInit(){}
}
