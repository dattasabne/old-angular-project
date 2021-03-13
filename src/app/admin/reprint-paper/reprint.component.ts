import { Component, OnInit, AfterViewInit, Input, ViewChild } from "@angular/core";
import { RecursiveComponent } from './recursive.component';
import { MessageService } from '../services/message.service';
@Component({
    selector:"app-reprint",
    templateUrl:"./reprint.html",
    styleUrls:["./reprint.scss"]
})
export class ReprintComponent implements OnInit , AfterViewInit {
    @ViewChild("recursion",{static:false ,read:RecursiveComponent}) private recursive:RecursiveComponent;
    public constructor(){}
    ngOnInit(){
        this.initData();
       
    }
    ngAfterViewInit(){}
    public static data:Array<Node> = [];
    public data1:Array<Node>  = [];
    @Input("data")
    public set nodeData(data:Node[]){
        this.data1 = data;
    }
    public static name2:string = "sabne"; 
    private initData():void{
        let maharshtra = <Node>{};
        maharshtra.name="Maharashtra";
        maharshtra.child = [];
        maharshtra.height="0px";
        maharshtra.border = "2px solid red";
        maharshtra.overflow="hidden";
        maharshtra.height = "0px";
        
        let mumbai = <Node>{};
        mumbai.name="Mumbai";
        mumbai.child = [];
        mumbai.height ="20px";
        mumbai.border = "2px solid red";
        mumbai.overflow="hidden";
        
        let pune = <Node>{};
        pune.name="Pune";
        pune.child=[];
        pune.height = "0px";
        pune.border = "2px solid red";
        pune.overflow="hidden";

        let nashik = <Node>{};
        nashik.name = "Nashik";
        nashik.child = [];
        nashik.height = "0px";
        nashik.border = "2px solid red";
        nashik.overflow="hidden";

        let hadapsar = <Node>{};
        hadapsar.name ="Hadapsar";
        hadapsar.child = [];
        hadapsar.height = "0px";
        hadapsar.border = "2px solid red";
        hadapsar.overflow="hidden";
        pune.child.push(hadapsar);

        let beed = <Node>{};
        beed.name ="Beed";
        beed.child = [];
        beed.height = "0px";
        beed.border = "2px solid red";
        beed.overflow="hidden";

        let bhandoop = <Node>{};
        bhandoop.name ="bhandoop";
        bhandoop.child = [];
        bhandoop.height = "0px";
        bhandoop.border = "2px solid red";
        bhandoop.overflow="hidden";
        mumbai.child.push(bhandoop);
        
        nashik.child.push(beed);
        nashik.height = "0px";
        nashik.border = "2px solid red";
        nashik.overflow="hidden";

        let loni = <Node>{};
        loni.border="2px solid green";
        loni.overflow ="hidden";
        loni.name = "Loni";
        loni.height ="0px";
        loni.child =[];
        hadapsar.child.push(loni);
        
        maharshtra.child.push(mumbai);
        maharshtra.child.push(pune);
        maharshtra.child.push(nashik);
        this.data1.push(maharshtra);
    }
    public clickOnElement(element:Node):void{
        this.recursive.click(element);
    }
}
export interface Node{
    name:string;
    child:Array<Node>;
    height:string;
    border:string;
    overflow:string;
}