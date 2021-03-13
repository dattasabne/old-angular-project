import {
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  OnInit
} from "@angular/core";
import { MessagingSettingComponent } from "../messaging-settings/messaging-setting";

@Component({
  selector: "setting-menu",
  templateUrl: "./setting-menu.html",
  styleUrls: ["./setting-menu.css"]
})
export class SettingMenuComponent implements OnInit {
  public currentOption: string;
  public settingMenu: Array<any> = null;
  @ViewChild("template", { read: ViewContainerRef,static:false }) viewRef: ViewContainerRef;
  public constructor(private resolver: ComponentFactoryResolver) {
    this.generateSettingMenu();
  }
  private generateSettingMenu(): void {
    this.settingMenu = new Array<any>();
    let option = {
      index: 0,
      name: "sms template setting",
      background: "white"
    };
    this.settingMenu.push(option);
    option = {
      index: 1,
      name: "account setting",
      background: "white"
    };
    this.settingMenu.push(option);
    option = {
      index: 2,
      name: "sms setting",
      background: "white"
    };
    this.settingMenu.push(option);
  }
  public optionClick(option: any): void {
    this.setDefaultOptionBackground();
    option.background = "skyblue";
    this.currentOption = option.name;
    this.loadComponent(option.index);
  }
  public setDefaultOptionBackground(): void {
    this.settingMenu.forEach(item => {
      item.background = "white";
    });
  }
  public loadComponent(index: number): void {
    this.viewRef.clear();
    switch (index) {
      case 0:
        let componentFactory = this.resolver.resolveComponentFactory(
          MessagingSettingComponent
        );
        this.viewRef.createComponent(componentFactory);
        break;
      default:
        break;
    }
  }
  ngOnInit():void{
    this.optionClick(this.settingMenu[0]);
  }
}

