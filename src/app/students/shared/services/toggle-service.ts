import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class ToggleService{
    public constructor(){
        
    }
    public toggleButton():void{
        let toggle = document.querySelector(".toggle-whole");
        let sidebar = document.querySelector(".sidebar");
        let toggleDiv = document.querySelectorAll(".toggle div");
        window.onclick = (ev)=>{
        if(sidebar && ev.target != sidebar && ev.target != toggle && this.isTargetEvent(toggleDiv,ev.target)==false){
            sidebar.classList.remove('active-toggle');
            }else if(ev.target==toggle ||  ev.target == toggleDiv[0],toggleDiv[1],toggleDiv[2] ){
                sidebar.classList.toggle('active-toggle');
            }
        }
    }
    
    private isTargetEvent(source,target):boolean{ 
        for(let i = 0 ;i<source.length;i++){
            if(source[i]==target){
                return true;
            }
        }
        return false;
    }
}
