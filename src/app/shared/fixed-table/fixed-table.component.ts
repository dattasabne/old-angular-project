import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
  Input
} from "@angular/core";

@Component({
  selector: "app-fixed-table",
  templateUrl: "./fixed-table.component.html",
  styleUrls: ["./fixed-table.component.css"]
})
export class FixedTableComponent implements OnInit {
  @ViewChild("mainDiv",{read:ElementRef,static:false}) private mainDiv: ElementRef;
  @ViewChild("table",{read:ElementRef,static:false}) private table: ElementRef;
  private $maindiv: HTMLDivElement = null;
  private $table: HTMLTableElement = null;
  @Input("data") public data: Array<Array<any>>;
  @Input("header") public header: Array<string>;
  @Input("size") public no_of_header: number;
  constructor(private renderer2: Renderer2) {}

  ngOnInit() {
    this.$maindiv = this.mainDiv.nativeElement;
    this.$table = this.table.nativeElement;
    setTimeout(() => {
      this.size();
    }, 500);
    this.renderer2.listen(window, "resize", ev => {
      this.size();
    });
  }
  private size(): void {
    let width = this.$maindiv.offsetWidth;
    var per = (100 / width) * (this.no_of_header * 300);
    var pixel = (width / 100) * (per + 2);
    this.renderer2.setStyle(this.$maindiv, "width", width + "px");
    this.renderer2.setStyle(this.$table, "width", pixel + "px");
  }
}
