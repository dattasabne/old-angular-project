import { Component, Input } from "@angular/core";
import { Node } from './reprint.component';


@Component({
    selector:'recursive',
    templateUrl:'./recursive.html',
    styleUrls:['./recursive.css']
})
export class RecursiveComponent{
    public nodes:Array<Node> = [];
    @Input("data")
    public set data(datas:Node){   
        this.nodes = datas.child;
    }
    public click(node:Node){
        node.height="auto";
        node.overflow="auto";
        alert(node.name);
    }
}