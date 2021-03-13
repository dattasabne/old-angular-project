import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DialogService } from '../../services/dialog-service';
import { ManualGenerationComponent } from '../manual-generation/manual-generation.component';
import { PrintPreviewComponent } from '../../print-preview/print-preview.component';
import { GenerateTable, Chapters, Subtopic } from '../../generate-table-entity/generate-table';
import { RandomgenerateService } from './randomgenerate.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {
  public patrnControl:FormControl = new FormControl("",[]);
  public standardControl:FormControl = new FormControl("",[]);
  public testTypeControl:FormControl = new FormControl("",[]);
  public subjectControl:FormControl = new FormControl("",[]);

constructor(private service:RandomgenerateService, private dialog:DialogService) { }
ngOnInit() {
//  this.getAllChapters();
 this.getHeaders();
 this.getPatternsSubjects();
//  this.getAllSubTopics();
 this.getSubTopicHeaders();
}

ngAfterViewInit() {
}
  public docxSrc:string='';
  public allTableDetails:Array<GenerateTable> = new Array<GenerateTable>();
  public allHeaders:Array<GenerateTable> = new Array<GenerateTable>();
  public allSubTopicHeaders:Array<GenerateTable> = new Array<GenerateTable>();
  public allSubTopics:Array<GenerateTable> = new Array<GenerateTable>();
  public table = <GenerateTable>{};
  public subTopicTable = <GenerateTable>{};
  public chapterSelected:boolean = false;
  public selectedChapterName:any;
  public chapterSubtopics:Subtopic[] = [];
  public patternSubjects:string[] = [];
  public totalQuestionandMarksToTake = <GenerateTable>{}

  public getHeaders():void {
    let header = <GenerateTable>{};
    header.chapterNames = "Chapter Names";
    header.availableQuestion = "Available Question";
    header.requiredQuestion = "Required Question";
    header.total = "Total";
    this.allHeaders.push(header);
  }
  public getSubTopicHeaders():void {
    let header = <GenerateTable>{};
    header.subTopic = "SubTopic"
    header.chapterNames = "ChapterName";
    this.allSubTopicHeaders.push(header);
  }
  public getPatternsSubjects() {
    this.patrnControl.valueChanges.subscribe(value=>{
      this.patternSubjects = value.subjects;
      let data = {
        patternName:this.patrnControl.value.patternName
      }
      this.service.getPatternSubject(data)
      .subscribe(res=>{},err=>{})
      console.log(data);
    });
  }
  public checkAllChapterSubTopics(chapter:any){
    chapter.forEach(subtopic=>{
      subtopic.isChecked = true;
    });
  }
  public getChapterSubTopics(){
   this.allChapters.forEach(chapter=>{
      if(chapter.isChecked) {
        this.chapterSelected = true;
        this.chapterSubtopics = chapter.subTopics;
        console.log(this.chapterSubtopics);
        this.selectedChapterName = chapter.chapterName;
        this.checkAllChapterSubTopics(this.chapterSubtopics);
      }
    });
  }
  public patterns = [
    {
      patternName:"JEE",
      subjects:["Physics","Chemistry","Mathematics"]
    },
    {
      patternName:"NEET",
      subjects:["Physics","Chemistry","Bialogy"]
    },
    {
      patternName:"MHCET",
      subjects:["Physics","Chemistry","Mathematics","Bialogy"]
    }
  ]
  public allChapters:Chapters[] = [
    {
      chapterName:"Chapter1",
      isChecked:false,
      availableQuestion:100,
      requiredQuestion:20,
      total:20,
      subTopics:[
        {
          subTopicName:"Chapter1.0",
          isChecked:false
        },
        {
          subTopicName:"Chapter1.1",
          isChecked:false
        },
        {
          subTopicName:"Chapter1.2",
          isChecked:false
        },
        {
          subTopicName:"Chapter1.3",
          isChecked:false
        },
      ]
    },
    {
      chapterName:"Chapter2",
      isChecked:false,
      availableQuestion:100,
      requiredQuestion:20,
      total:20,
      subTopics:[
        {
          subTopicName:"Chapter2.0",
          isChecked:false
        },
        {
          subTopicName:"Chapter2.1",
          isChecked:false
        },
        {
          subTopicName:"Chapter2.2",
          isChecked:false
        },
        {
          subTopicName:"Chapter2.3",
          isChecked:false
        },
      ]
    },
    {
      chapterName:"Chapter3",
      isChecked:false,
      availableQuestion:500,
      requiredQuestion:200,
      total:200,
      subTopics:[
        {
          subTopicName:"Chapter3.0",
          isChecked:false
        },
        {
          subTopicName:"Chapter3.1",
          isChecked:false
        },
        {
          subTopicName:"Chapter3.2",
          isChecked:false
        },
        {
          subTopicName:"Chapter3.3",
          isChecked:false
        },
      ]
    },
  ];
  
  // public getAllSubTopics():void {
  //   this.getSubTopicHeaders();
  //   this.allChapters.forEach(chapter=>{
  //     chapter.subTopics.forEach(sub=>{
  //       sub.isChecked = true;
  //       sub.subTopicName = "subTopic1.0";
  //     });
  //   });
  //  }
  public preview(table:GenerateTable):void {
    alert(this.table);
  }
  public upload(table:GenerateTable):void {
    alert(this.table);
  }
  public clickOnRecord(table:GenerateTable):void {
    this.dialog.updateAndDeletepopup(
      PrintPreviewComponent, 
      this.table,
      this.preview.bind(this),
      this.upload.bind(this)
    );
  }
}
