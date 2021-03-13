import { Component, OnInit, AfterViewInit } from "@angular/core";


@Component({
    selector:'policy-component',
    templateUrl:'./policy.component.html',
    styleUrls:['./policy.component.css']
})
export class PolicyComponent implements OnInit , AfterViewInit{
    public constructor(){}
    private contentPolicyHeight:string = "0";
    private banner:HTMLElement = null;
    private policyBanner:HTMLElement = null;
    ngAfterViewInit(){ 
        this.banner = document.querySelector(".policy-banner");
        this.policyBanner = document.querySelector(".plicy-logo-banner");
        this.adjustUi();
    }
    ngOnInit(){
      window.onresize = ()=>{
          this.adjustUi();
      }
    }
    public adjustUi(){
        if(this.banner && this.policyBanner){
            let bannerHeight = this.banner.offsetHeight;
            let per = this.percentInToPixel(5,window.document.body.offsetHeight);
            this.policyBanner.style.height=(bannerHeight - per-5)+"px";
        }
    }
    public percentInToPixel(per:number , total:number){
        return (per / 100 * total);
    }
}