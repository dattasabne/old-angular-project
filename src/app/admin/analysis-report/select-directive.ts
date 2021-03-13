import { Directive, Renderer2, ElementRef } from "@angular/core";

@Directive({
  selector: "[color-white]"
})
export class SelectDirective {
  public constructor(private select: ElementRef, private render2: Renderer2) {
    this.render2.setStyle(
      this.select.nativeElement,
      "color",
      "white !important"
    );
  }
}
