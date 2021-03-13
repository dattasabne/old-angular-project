import { ResponseModel } from './../../website/model/response.model';
import {
  Component,
  OnInit,
  OnChanges,
  ViewContainerRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from "@angular/core";
import { Data } from "../library/interfaces/data.interface";
import { StudentMenu } from "../library/enums/studnet-menu.enum";
import { ClassDetails } from "../studenthomepage/class-detail";
import { SearchExamService } from "../serach-assignment/search-assignment-service";
import { SearchEntity } from "../shared/entity/search-entity";
import { HttpErrorResponse , HttpResponse} from "@angular/common/http";
import { DataShareService } from "../../shared/services/data-share-service";
import { DialogService } from "../shared/services/dialog-service";
import { AppConstant } from 'src/app/shared/app-constant/app-constatnt';
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit, OnChanges, Data ,AfterViewInit {
  public classData: ClassDetails;
  public classDetails:ClassDetails;
  public template: ViewContainerRef;
  public studentMenu: any = StudentMenu;
  public allAssignments:Array<any> = new Array<any>();
  public showcaseName:string = "";
  public searchAssignmnetForm = {
    assignmnetData:[],
    isLoad:false
  };
  public searchAnalysisForm = {
    isLoad:false
  }
  @Input("classDetails")
  public set ClassDetails(classDetails:ClassDetails){
    this.classDetails = classDetails;
  }
  public goToHome:()=>void;
  @Output("close")
  public closeEmmiter:EventEmitter<void> = new EventEmitter<void>();
  public close():void{
   this.closeEmmiter.emit();
  }
  constructor(
    private httpService: SearchExamService,
    private shareData: DataShareService,
    private dialog:DialogService,
  ) {}
  public logoImage:string ="";
  public instituteName:string  = "";
  public searchAssignmentClose():void{
    this.searchAssignmnetForm.isLoad = false ;
  }
  public searchAnalysisClose():void{
    this.searchAnalysisForm.isLoad = false ;
  }
    ngAfterViewInit(){
      this.adjustHeight();
      window.onresize = ()=>{
        this.adjustHeight();
      };
    }
  ngOnInit() {
  //  this.navigation.loadAssignmentFunction = this.getAllAssignments.bind(this);
    window.scrollTo(0,0);
    if (this.classDetails) {
      this.shareData.ClassDetails = this.classDetails;
      this.instituteName =  this.classDetails.className;
      this.logoImage = this.classDetails.classLogo //class logo
      AppConstant.instituteLogo = this.classDetails.classLogo ;
      this.showcaseName = this.classDetails.className;
      this.getAllAssignments();
      this.shareData.GotoHomePageByStudents = this.home.bind(this);
      this.goToHome = this.close.bind(this);
    }
  }
  public home():void{
    this.searchAssignmnetForm.isLoad = false;
    this.searchAnalysisForm.isLoad = false;
    this.getAllAssignments();
  }
  public adjustHeight():void{
    let container:HTMLElement = <HTMLElement> document.querySelector(".main-content");
    let showCase:HTMLElement = <HTMLElement> document.querySelector(".showcase");
    if(container && showCase ){
      let showCaseHeight = showCase.offsetHeight;
      let minumsHeight = (showCaseHeight + 60 + 8);
      let totalHeight = window.innerHeight;
      let actualHeight = totalHeight - minumsHeight;
      container.style.height = actualHeight + "px";
    }
   }
  public isLoaded: boolean = false;
  public testCounter: number = 0;
  public allTestData: Array<any> = new Array<any>();

  public assignmnet_SuccessResponse(res:HttpResponse<ResponseModel>):void{
    this.isLoaded = false;
    let responseModel:ResponseModel = res.body;
    if (!responseModel.result) {
       this.dialog.showAlert("error"+ responseModel.message,{height:200,width:500});
       return;
    }
    this.testCounter = responseModel.data.length;
    this.allTestData = responseModel.data;
    this.isLoaded = false;
  }
  public http_ErrorResponse(error:HttpErrorResponse):void{
    let message:string = "";
    if(error.status == 0){
      message = AppConstant.NOCONNECT_RESPONSE;
    }else{
      message = error.message;
    }
    this.dialog.showAlert(message,{height:200,width:500});
    this.isLoaded = false;
  }
  public getAllAssignments(): void {
    this.isLoaded = true;
    const data = <SearchEntity>{};
    data.uniqueClassName =  this.classDetails.uniqueClassName;//  this.classData.uniqueClassName;
    data.batch = this.classDetails.batch;
    data.course = this.classDetails.course;
    data.division = this.classDetails.division;
    data.subDivision = this.classDetails.subDivision;
    data.branch = this.classDetails.branch;
    this.httpService.getAllAssignments(data).subscribe({next:this.assignmnet_SuccessResponse.bind(this) , error:this.http_ErrorResponse.bind(this)});
  }
  public clickOnMenu(menu: StudentMenu): void {
    this.loadComponent(menu);
  }
  public loadComponent(menu: StudentMenu, data: any = null): void {
    switch (menu) {
      case StudentMenu.SEARCH_EXAM:
        this.searchAssignmnetForm.assignmnetData = this.allTestData;
        this.searchAssignmnetForm.isLoad = true;
        break;
      case StudentMenu.ANALYSISANDREVIEW:
        this.searchAnalysisForm.isLoad = true;
        break;
    }
  }
  ngOnChanges(): void {}
}
