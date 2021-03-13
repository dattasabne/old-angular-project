import { Component, AfterViewInit } from "@angular/core";
declare var $: any;
@Component({
    selector:'construction',
    templateUrl:"./construction.html",
    styleUrls:['./construction.css']
})
export class WebSiteInUnderConstruction implements AfterViewInit{
    public constructor(){}
    ngAfterViewInit(){
        $('.cd100').countdown100({
			endtimeYear: 0,
			endtimeMonth: 0,
			endtimeDate: 1,
			endtimeHours: 0,
			endtimeMinutes: 0,
			endtimeSeconds: 0,
			timeZone: "" 
		 });
    }
}