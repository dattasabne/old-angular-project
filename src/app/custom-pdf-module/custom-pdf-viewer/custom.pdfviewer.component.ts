import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component,OnInit ,AfterViewInit, Input, Output, EventEmitter, OnChanges, OnDestroy} from "@angular/core";
import { v4 as uuidv4 } from 'uuid';
declare var pdfjsLib: any;
@Component({
  selector:'app-custom-pdfviewer',
  templateUrl:'./custom.pdfviewer.html',
  styleUrls:['./custom.pdfviewer.css']
})
export class CustomPdfViewer implements OnInit , AfterViewInit , OnDestroy{
  private canvas:HTMLCanvasElement = null;
  private filePath:string = '';
  private pageNumber:number = 5;
  private pdf:any = null;
  private zoom:number = 2;
  private canvasWidth:number = 0;
  @Input("src")
  public set src(filePath:string){
    if(filePath ===  null || filePath === undefined || filePath.trim().length < 1){
      return;
    }
    this.filePath = filePath;
    this.loadPdf(this.filePath);
  }
  public hideModel:boolean = false;
  @Input("hide")
  public set hide(what:boolean){
    if(this.canvas){
      this.canvas.style.visibility = (what)?'hidden':'visible';
    }
  }

  @Output("onLoad")
  public onLoad:EventEmitter<boolean> = new EventEmitter<boolean>();


  @Input('canvasWidth')
  public set CanvasWidth(canvasWidth:number){
    this.canvasWidth = canvasWidth;
  }
  @Input("pageNo")
  public set page(pageNo:number){
    if(this.pdf != null){
      this.pageNumber = pageNo;
      this.renderPdf(pageNo);
    }
  }
  public parentNodeModel:HTMLElement = <HTMLElement>{};

  @Input("parentNode")
  public set parentNode(node:HTMLElement){
    this.parentNodeModel = node;
  }
  @Output("pdfLoaded")
  public pdfLoadEmitter:EventEmitter<any> = new EventEmitter<any>();
  @Output("error")
  public pdfError:EventEmitter<any> = new EventEmitter<any>();
  ngAfterViewInit(){
    this.onLoad.emit(true);
    let mainContainer:HTMLDivElement = <HTMLDivElement> document.createElement("div");
    this.canvas = <HTMLCanvasElement> document.createElement("canvas");
    this.canvas.id = uuidv4();
    mainContainer.classList.add('pdf-canvas');
    mainContainer.appendChild(this.canvas);
    this.parentNodeModel.appendChild(mainContainer);

  }
  ngOnInit(){

  }
  ngOnDestroy(){
    window.onresize =null;
  }
  private loadPdf(filePath:string){

    pdfjsLib.getDocument(filePath).then((pdf:any) => {
        this.pdf = pdf;
        this.resizePdf();
        this.renderPdf(this.pageNumber);
        this.pdfLoadEmitter.emit("pdf loaded successfully.");
    } , (error)=>{
        this.onLoad.emit(false);
        this.pdfError.emit(error);
    });
  }
  public renderPdf(pageNo:number):void{

    if(this.pdf == null)
    return;
    this.pdf.getPage(Number(pageNo)).then((page) =>{
      var ctx = this.canvas.getContext('2d');
      var viewport = null;
      if(this.isMobileDevice){
        viewport = page.getViewport(1.0);
        this.canvas.width = document.body.offsetWidth;
        this.canvas.height = viewport.height;
        viewport = page.getViewport(this.canvas.width / viewport.width);
      }else{
        viewport = page.getViewport(2);
        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;
      }
      page.render({
        canvasContext: ctx,
        viewport: viewport
      });
      this.onLoad.emit(false);
    },(error)=>{
      this.pdfError.emit(error);
      this.onLoad.emit(false);
    });
  }
  private isMobileDevice:boolean = false;
  public resizePdf():void{
    this.breakPoint.observe([Breakpoints.Small , Breakpoints.XSmall]).subscribe(result =>{
      if(result.matches){
        this.zoom = 1.4;
        this.isMobileDevice = true;
      }else{
        this.zoom = 2;
        this.isMobileDevice = false;
      }
    });
  }
  constructor(private breakPoint:BreakpointObserver){}
}
