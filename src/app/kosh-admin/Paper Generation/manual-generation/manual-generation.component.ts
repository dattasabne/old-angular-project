import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { GenerateTable, ManualGenereteHeader,ManualGenerate } from '../../generate-table-entity/generate-table';
import { DialogService } from '../../services/dialog-service';
import { QuestionSelectionComponent } from '../../question-selection-dialog/question-selection.component';
import { PrintPreviewComponent } from '../../print-preview/print-preview.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'manual-generation',
  templateUrl: './manual-generation.component.html',
  styleUrls: ['./manual-generation.component.css'],
})
export class ManualGenerationComponent implements OnInit {
  public patternControl:FormControl = new FormControl("",[]);
  public examTypeControl:FormControl = new FormControl("",[]);
  public ManualGenerateData: ManualGenerate = {
    SrNo: 1,
    pattern: 'JEE',
    testId: 20,
    chapterName: 'Elasticity',
    chapterId:"PP5",
    questions:25,
    reapeted:"---",
    notAvailable: '---',
    };



  constructor(private dialog:DialogService) { }

  ngOnInit() {
    this.getHeaders();
  }
  ngAfterViewInit() {
  }
  public allHeaders:Array<ManualGenereteHeader> = new Array<ManualGenereteHeader>();
  public header = <ManualGenereteHeader>{};
  public isDialogOpen:boolean = false;
  public table = <GenerateTable>{};
  public getHeaders():void {
    this.header = <ManualGenereteHeader>{};
    this.header.SrNo = "SrNo";
    this.header.pattern = "Pattern";
    this.header.testId = "Test Id";
    this.header.chapterName = "ChapterName";
    this.header.chapterId = "ChapterId";
    this.header.questions = "Questions";
    this.header.reapeted = "Reapeted";
    this.header.notAvailable = "Not Availble"
  }


  public enterQuestions() {
    this.dialog.createAndEditpopup(
      QuestionSelectionComponent,
      this.ManualGenerateData,
      this.createPaper.bind(this)
    )
    this.isDialogOpen = true;
  }
  public createPaper() {
    alert(this.ManualGenerateData);
  }
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
