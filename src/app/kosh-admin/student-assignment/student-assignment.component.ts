import { Component, OnInit, AfterContentChecked, AfterViewInit, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BranchDetails } from './branch-details';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { AssignmentRecursive } from './assignment-recursive/recursive';
@Component({
  selector: 'app-student-assignment',
  templateUrl: './student-assignment.component.html',
  styleUrls: ['./student-assignment.component.css'],
})
export class StudentAssignmentComponent implements OnInit,AfterViewInit {
  public batchControl:FormControl = new FormControl("",[]);
  public courseControl:FormControl = new FormControl("",[]);
  public testIdControl:FormControl = new FormControl("",[]);
  public branchAssignmentControl:FormControl = new FormControl("",[]);
  public divisionAssignmentControl:FormControl = new FormControl("",[]);
  public subDivisionAssignmentControl:FormControl = new FormControl("",[]);
  public branchAssigmentDateControl:FormControl = new FormControl("",[]);
  public divisionAssignmentDateControl:FormControl = new FormControl("",[]);
  public subDivisionAssignmentDateControl:FormControl = new FormControl("",[]);

  @ViewChild(AssignmentRecursive,{static:false}) private recursive:AssignmentRecursive;

  constructor(
    private change:ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.createDataTree();
    this.getAllBraches();
    this.getHeaders();
    // this.doCheck();
  }
  ngAfterViewInit() {
    this.createObjects();
  }
  public createObjects() {
    this.sign = document.querySelector(".sign");
    this.sign2 = document.querySelector(".sign2");
    this.mainBranch = document.querySelectorAll(".main-branch");
    // this.subBranches = document.querySelectorAll(".sub-branches");
    this.demoSubBranches = document.querySelectorAll(".demo-sub-branches");
  }
  public mainBranch:NodeListOf<HTMLElement> = null;
  // public subBranches:NodeListOf<HTMLElement> = null;
  public demoSubBranches:NodeListOf<HTMLElement> = null;
  public sign:HTMLSpanElement = null;
  public sign2:HTMLSpanElement = null;
  public allTableDetails:Array<BranchDetails> = new Array<BranchDetails>();
  public allHeaders = <BranchDetails>{};
  public headers = [
    'Branch',
    'Course',
    'Test Id',
    'Assignment Type',
    'Assignment Time',
    'Assignment Date',
    'Solution Release Date'
  ];
  public getHeaders():void {
    this.allHeaders.branchName = "Branch";
    this.allHeaders.course = "Course";
    this.allHeaders.isChecked = false;
    this.allHeaders.testId = "Test Id";
    this.allHeaders.assignmentType = "Assignment Type";
    this.allHeaders.assignmentTime = "Assignment Time";
    this.allHeaders.assignmentDate = "Assignment Date";
    this.allHeaders.solnReleaseDate = "Solution Release Date";
  }

  public getAllBraches():void {

    let kothrud = <BranchDetails>{};
    kothrud.branchName = "kothrud";
    kothrud.sign = "+";
    kothrud.isChecked = false;
    kothrud.branches = [];
    kothrud.course = "Regular-2020";
    kothrud.testId = 10;
    kothrud.assignmentTime="10:30";
    kothrud.assignmentType ="home work";
    kothrud.assignmentDate ="07-05-1990";
    kothrud.solnReleaseDate="01-12-2005";
    kothrud.height ="0px";
    kothrud.overflow="hidden";
    kothrud.assignmentTypeControl = new FormControl(kothrud.assignmentType,[]);





    let loni = <BranchDetails>{};
    loni.branchName = "loni";
    loni.sign = "+";
    loni.isChecked = false;
    loni.branches = [];
    loni.course = "Regular-2020"
    loni.testId = 20;
    loni.assignmentTime="10:30";
    loni.assignmentType ="home work";
    loni.assignmentDate ="07-05-1990";
    loni.solnReleaseDate="01-12-2005";
    loni.height="0px";
    loni.overflow="hidden";
    loni.assignmentTypeControl = new FormControl(kothrud.assignmentType,[]);



    let alandi = <BranchDetails>{};
    alandi.branchName = "alandi";
    alandi.sign = "+";
    alandi.isChecked = false;
    alandi.branches = [];
    alandi.course = "Regular-2020"
    alandi.testId = 20;
    alandi.assignmentTime="10:30";
    alandi.assignmentType ="home work";
    alandi.assignmentDate ="07-05-1990";
    alandi.solnReleaseDate="01-12-2005";
    alandi.height ="0px";
    alandi.overflow="hidden";
    alandi.assignmentTypeControl = new FormControl(kothrud.assignmentType,[]);


    let pune = <BranchDetails>{};
    pune.branchName = "pune";
    pune.sign = "+";
    pune.isChecked = false;
    pune.branches = [];
    pune.course = "Regular-2020"
    pune.testId = 20;
    pune.branches = [];
    pune.assignmentTime="10:30";
    pune.assignmentType ="home work";
    pune.assignmentDate ="07-05-1990";
    pune.solnReleaseDate="01-12-2005";
    pune.height ="0px";
    pune.overflow="hidden";
    pune.assignmentTypeControl = new FormControl(kothrud.assignmentType,[]);


    pune.branches.push(kothrud);
    pune.branches.push(loni);
    pune.branches.push(alandi);
//-------------------------------------------------------------
    let aurangabad = <BranchDetails>{};
    aurangabad.branchName = "aurangabad";
    aurangabad.sign = "+";
    aurangabad.isChecked = false;
    aurangabad.branches = [];
    aurangabad.course = "Regular-2020"
    aurangabad.testId = 20;
    aurangabad.branches = [];
    aurangabad.assignmentTime="10:30";
    aurangabad.assignmentType ="home work";
    aurangabad.assignmentDate ="07-05-1990";
    aurangabad.solnReleaseDate="01-12-2005";
    aurangabad.height ="0px";
    aurangabad.overflow="hidden";
    aurangabad.assignmentTypeControl = new FormControl(kothrud.assignmentType,[]);


    let waluj  = <BranchDetails>{};
    waluj.branchName = "Waluj";
    waluj.sign = "+";
    waluj.isChecked = false;
    waluj.branches = [];
    waluj.course = "Regular-2020"
    waluj.testId = 20;
    waluj.assignmentTime="10:30";
    waluj.assignmentType ="home work";
    waluj.assignmentDate ="07-05-1990";
    waluj.solnReleaseDate="01-12-2005";
    waluj.height ="0px";
    waluj.overflow="hidden";
    waluj.assignmentTypeControl = new FormControl(waluj.assignmentType,[]);
    aurangabad.branches.push(waluj);

    let satara = <BranchDetails>{};
    satara.branchName = "satara";
    satara.sign = "+";
    satara.isChecked = false;
    satara.branches = [];
    satara.course = "Regular-2020"
    satara.testId = 20;
    satara.assignmentTime="10:30";
    satara.assignmentType ="home work";
    satara.assignmentDate ="07-05-1990";
    satara.solnReleaseDate="01-12-2005";
    satara.height ="0px";
    satara.overflow="hidden";
    satara.assignmentTypeControl = new FormControl(satara.assignmentType,[]);
   //-----------------------------------------------------------
    let beed = <BranchDetails>{};
    beed.branchName = "beed";
    beed.sign = "+";
    beed.isChecked = false;
    beed.branches = [];
    beed.course = "Regular-2020"
    beed.testId = 20;
    beed.branches = [];
    beed.assignmentTime="10:30";
    beed.assignmentType ="home work";
    beed.assignmentDate ="07-05-1990";
    beed.solnReleaseDate="01-12-2005";
    beed.height ="0px";
    beed.overflow="hidden";
    beed.assignmentTypeControl = new FormControl(beed.assignmentType,[]);

    let parli = <BranchDetails>{};
    parli.branchName = "parli";
    parli.sign = "+";
    parli.isChecked = false;
    parli.branches = [];
    parli.course = "Regular-2020"
    parli.testId = 20;
    parli.assignmentTime="10:30";
    parli.assignmentType ="home work";
    parli.assignmentDate ="07-05-1990";
    parli.solnReleaseDate="01-12-2005";
    parli.height ="0px";
    parli.overflow="hidden";
    parli.assignmentTypeControl = new FormControl(parli.assignmentType,[]);


    let ambejogai = <BranchDetails>{};
    ambejogai.branchName = "ambejogai";
    ambejogai.sign = "+";
    ambejogai.isChecked = false;
    ambejogai.branches = [];
    ambejogai.course = "Regular-2020"
    ambejogai.testId = 20;
    ambejogai.assignmentTime="10:30";
    ambejogai.assignmentType ="home work";
    ambejogai.assignmentDate ="07-05-1990";
    ambejogai.solnReleaseDate="01-12-2005";
    ambejogai.height ="0px";
    ambejogai.overflow="hidden";
    ambejogai.assignmentTypeControl = new FormControl(ambejogai.assignmentType,[]);



    let kej =<BranchDetails>{};
    kej.branchName = 'kej';
    kej.sign = "+";
    kej.isChecked = false;
    kej.branches = [];
    kej.course = "Regular-2020"
    kej.testId = 20;
    kej.assignmentTime="10:30";
    kej.assignmentType ="home work";
    kej.assignmentDate ="07-05-1990";
    kej.solnReleaseDate="01-12-2005";
    kej.height ="0px";
    kej.overflow="hidden";
    kej.assignmentTypeControl = new FormControl(kej.assignmentType,[]);

    beed.branches.push(parli);
    beed.branches.push(kej);
    beed.branches.push(ambejogai);

    this.allTableDetails.push(beed);
    this.allTableDetails.push(pune);
    this.allTableDetails.push(aurangabad);
    this.allTableDetails.push(satara);

    let bardapur = <BranchDetails>{};
    bardapur.branchName ="bardapur";
    bardapur.sign = "+";
    bardapur.isChecked = false;
    bardapur.branches =[];
    bardapur.course = "Regular-2020"
    bardapur.testId = 20;
    bardapur.assignmentTime="10:30";
    bardapur.assignmentType ="home work";
    bardapur.assignmentDate ="07-05-1990";
    bardapur.solnReleaseDate="01-12-2005";
    bardapur.height ="0px";
    bardapur.overflow="hidden";
    bardapur.assignmentTypeControl = new FormControl(waluj.assignmentType,[]);

    parli.branches.push(bardapur);
    let nananj = <BranchDetails>{};
    nananj.branchName ="Nananj";
    nananj.sign = "+";
    nananj.isChecked = false;
    nananj.branches =[];
    nananj.course = "Regular-2020"
    nananj.testId = 20;
    nananj.assignmentTime="10:30";
    nananj.assignmentType ="home work";
    nananj.assignmentDate ="07-05-1990";
    nananj.solnReleaseDate="01-12-2005";
    nananj.height ="0px";
    nananj.overflow="hidden";
    nananj.assignmentTypeControl = new FormControl(waluj.assignmentType,[]);

    let sakharwadi = <BranchDetails>{};
    sakharwadi.branchName ="sakharwadi";
    sakharwadi.sign = "+";
    sakharwadi.isChecked = false;
    sakharwadi.branches =[];
    sakharwadi.course = "Regular-2020"
    sakharwadi.testId = 20;
    sakharwadi.assignmentTime="10:30";
    sakharwadi.assignmentType ="home work";
    sakharwadi.assignmentDate ="07-05-1990";
    sakharwadi.solnReleaseDate="01-12-2005";
    sakharwadi.height ="0px";
    sakharwadi.overflow="hidden";
    sakharwadi.assignmentTypeControl = new FormControl(sakharwadi.assignmentType,[]);
    nananj.branches.push(sakharwadi);
    parli.branches.push(nananj);

    let sumba= <BranchDetails>{};
    sumba.branchName ="sumba";
    sumba.sign = "+";
    sumba.isChecked = false;
    sumba.branches =[];
    sumba.course = "Regular-2020"
    sumba.testId = 20;
    sumba.assignmentTime="10:30";
    sumba.assignmentType ="home work";
    sumba.assignmentDate ="07-05-1990";
    sumba.solnReleaseDate="01-12-2005";
    sumba.height ="0px";
    sumba.overflow="hidden";
    sakharwadi.branches.push(sumba);
  }
   public batches = ['Regular-2020','Ex-2019'];
   public testIds = [10,20,30,40];
   public courses = ['Physics','Chemistry','Maths'];
   public assignmentType = ['Class Work', 'Home Work','Test'];

  //  public preview(table:BranchDetails):void {
  //   alert(table);
  // }
  // public upload(table:BranchDetails):void {
  //   alert(table);
  // }
  // public clickOnRecord(table:BranchDetails):void {
  //   this.dialog.updateAndDeletepopup(
  //     PrintPreviewComponent,
  //     table,
  //     this.preview.bind(this),
  //     this.upload.bind(this)
  //   );
  // }

  public checkedOnCheckBox(branch:BranchDetails):void{
    this.recursive.changeOnCheckBox(branch);
  }
  public selectAllBranches(branches:Array<BranchDetails>):void{
      branches.forEach(branch=>{
        this.recursive.changeOnCheckBox(branch);
      });
  }

  public getKeyValue(branch:BranchDetails):Array<string>{
    let values = [];
    for(let key in branch){
      if( (typeof branch[key])!='object'
      && key!='sign'
      && key!="isChecked"){
        values.push(branch[key]);
      }
    }
    return values;
  }
  public checkFlag:boolean = true;
  public flagName = "De-Select All"
  public nodes:BranchDetails[] = [];
  public doCheck():void {
    if(this.allHeaders.isChecked){
      this.checkAllBranches();
      this.allHeaders.isChecked = !this.allHeaders.isChecked;
      this.flagName = "Select-All"
    } else {
      this.uncheckAllBranches();
      this.allHeaders.isChecked = !this.allHeaders.isChecked;
      this.flagName = "De-Select-All"
    }
  }
  public uncheckAllBranches():void {
    this.allTableDetails.forEach(table=>{
      table.isChecked = false;
      this.subBranchChecked(table);
    });
  }
  public checkAllBranches():void {
    this.allTableDetails.forEach(table=>{
      table.isChecked = true;
      this.subBranchChecked(table);
    });
  }
public subBranchChecked(branch:BranchDetails):void {
    if(branch.isChecked) {
      branch.branches.forEach(subBranch=>{
        subBranch.isChecked = false;
      });
      branch.isChecked = !branch.isChecked;
    }
    else {
      branch.branches.forEach(subBranch=>{
        subBranch.isChecked = true;
      });
      branch.isChecked = !branch.isChecked;
    }
  }


  public createDataTree():void {
  }
  public displayNodeData(node:{name:string,sign:string,isActive:boolean,height:string,chileNodes:[]}):void {
      if(node.isActive){
        node.sign="+";
        node.height="20px";
        node.isActive = !node.isActive;
      }else{
        node.sign="-";
        node.height="180px";
        node.isActive = !node.isActive;
      }
  }
}
