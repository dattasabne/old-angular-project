import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
  ComponentFactoryResolver,
  ViewContainerRef
} from "@angular/core";
import { OnlineStudentsProfileComponent } from "../online-students-profile/online-students-profile.component";

@Component({
  selector: "app-online-student",
  templateUrl: "./online-students.component.html",
  styleUrls: ["./online-students.component.css"]
})
export class OnlineStudentsComponent implements OnInit, AfterViewInit {
  @ViewChild("studentProfile", { read: ViewContainerRef,static:false })
  viewreff: ViewContainerRef;
  public active: boolean = false;
  public students: Array<any> = new Array<any>();
  public states: Array<any> = new Array<any>();
  constructor(
    private render2: Renderer2,
    private factory: ComponentFactoryResolver
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {}
  public toggleButton(): void {
    if (this.active) {
      this.active = !this.active;
    } else {
      this.active = !this.active;
    }
  }
  studentName: Array<any> = new Array<any>();

  public loadComponents(data: any): void {
    let componentFactory = this.factory.resolveComponentFactory(
      OnlineStudentsProfileComponent
    );
    this.viewreff.clear();
    let comp = this.viewreff.createComponent(componentFactory);
    comp.instance.student = data;
    this.toggleButton();
  }
}
