import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit , OnChanges {
  1
  public footerInfo:any={};
  @Input()
  public set footerData(data:any){
    this.footerInfo = data;
  }
  constructor() { }
  ngOnChanges():void{
  }
  ngOnInit() {
  }

}
