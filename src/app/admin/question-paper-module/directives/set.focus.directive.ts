import { Directive, ElementRef } from "@angular/core";
@Directive({
  selector:'[appFocus]'
})
export class AppFocusDirective{
  public constructor(private elem:ElementRef){
    let htmlElem:HTMLElement = <HTMLElement>elem.nativeElement;
    setTimeout(()=>{
      htmlElem.focus();
    },10);
  }
}
