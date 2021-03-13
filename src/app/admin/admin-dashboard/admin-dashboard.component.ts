import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit , AfterViewInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit(){
    let allbodycard = document.querySelectorAll('.card-body');
    for(let i=0;i<allbodycard.length;i++){
      let eachDiv = allbodycard[i] as HTMLDivElement;

      eachDiv.addEventListener('mouseover',(ev)=>{
       let link = eachDiv.querySelector('.link') as HTMLDivElement;
       link.style.animationName = 'fade';
       link.style.animationDuration="0.40s";
       eachDiv.style.background="black";
       let icon = eachDiv.querySelector('.icon') as HTMLElement ;
       icon.style.color ="white"
       let anchorTag = eachDiv.querySelector('.anchor-tag') as HTMLAnchorElement;
        anchorTag.style.color = "white";
        let count = eachDiv.querySelector(".count") as HTMLHeadElement;
        count.style.color = "white";

      });
      eachDiv.addEventListener('mouseleave',(ev)=>{
        let link = eachDiv.querySelector('.link') as HTMLDivElement;
        link.style.animationName = 'none';
        eachDiv.style.background="white";
        let icon = eachDiv.querySelector('.icon') as HTMLElement ;
        icon.style.color ="black"
        let anchorTag = eachDiv.querySelector('.anchor-tag') as HTMLAnchorElement;
         anchorTag.style.color = "black";
         let count = eachDiv.querySelector(".count") as HTMLHeadElement;
         count.style.color = "black";
       });
    }
  }
}
