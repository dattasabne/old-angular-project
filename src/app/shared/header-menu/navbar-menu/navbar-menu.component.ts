import { AfterViewInit, Component , OnInit, Renderer2 } from '@angular/core';

@Component({
    selector: 'navbar-menu',
    styleUrls: ['./navbar-menu.component.css'],
    templateUrl: './navbar-menu.component.html',
})
export class NavBarMenuComponent implements OnInit , AfterViewInit {
    public menuOption: Array<any> = new Array<any>();
    public allNotifications: Array<any> = new Array<any>();
    public isActiveNotification = false;
    public subMenu: any;
    public subMenuChild: any;
    // tslint:disable-next-line:no-inferrable-types
    public notificationCount: number = 0;
    public constructor(
        public render2: Renderer2
    ){}
    public ngOnInit(): void {
        this.generateOptionMenu();
        this.getNotification();

    }
    public ngAfterViewInit(): void {

        this.render2.listen(window,"click",(ev)=>{
            this.subMenu = document.querySelectorAll(".sub");
            this.subMenuChild = document.querySelector(".sub-menu");
            for(let i =0;i<this.subMenu.length;i++){
                    if(ev.target==this.subMenu[i]){
                        this.isActiveNotification = !this.isActiveNotification;
                        ev.preventDefault();
                        return;
                    }
            }
            if(!this.subMenuChild.contains(ev.target)){
                this.isActiveNotification = false;
                    ev.preventDefault();
            }


        });
    }
    public getNotification():void{
        this.allNotifications = [{
            index:0,
            name:'Test Is Uploaded By Rathi Class',
            isSeen:false,
            color:'green'
        },
        {
            index:1,
            name:'New asdfds ghgsdfj sdkhkjdshkfhdskjhf kdhkhfkdsh ksdhkjfhkdsh fkjdshkjhdfkjsdh kjsdhkj kjsdhfk jhskdjhklf jdsh kjsahfkhkawjsh fkjskjhf kjshkj hkfjdshf ksdhi Class Is Added Rathi Class',
            isSeen:false,
            color:'green'
        },
        {
            index:2,
            name:'Test Cancelled',
            isSeen:false,
            color:'green'
        },
        {
            index:3,
            name:'DatatBase System Getting Full',
            isSeen:false,
            color:'green'
        },
        {
            index:4,
            name:'Test Is Uploaded By Zenith Class',
            isSeen:false,
            color:'green'
        },

    ];
    this.notificationCount = this.allNotifications.length;
    }
    public clickOnNotification(index:number){
        this.allNotifications[index].color="red";
        if(this.notificationCount==0)
        return;
        -- this.notificationCount;
    }
    public showNotification(liEvent:Event){
        if( (liEvent.target==this.subMenu)){


        }
    }




    public generateOptionMenu():void{
        this.menuOption = [
            {
                index:0,
                name:'option 1',
                background:'linear-gradient(to bottom right,pink ,#90EE90)',
                color:'black',
            },
            {
                index:1,
                name:'option 2',
                background:'linear-gradient(to bottom right,pink ,#90EE90)',
                color:'black'
            },
            {
                index: 2,
                name: 'notification',
                background:'linear-gradient(to bottom right,pink ,#90EE90)',
                color: 'black',
            },
            {
                index: 3,
                name: 'logout',
                background : 'linear-gradient(to bottom right,pink ,#90EE90)',
                color: 'black',
            },

        ];
    }
    public clickOption(index: number, liEvent: Event): void {
        this.clearAllBackground();
        this.menuOption[index].background = 'linear-gradient(to bottom right,#8B4789,#EE6363)';
        this.menuOption[index].color = 'white';
    }
    public clearAllBackground(): void{
        this.menuOption.forEach((item) => {
            item.background = 'linear-gradient(to bottom right,pink ,#90EE90)';
            item.color = 'black';
        });
    }
}
