import { MediaObserver } from '@angular/flex-layout';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class ResponsiveService{
  public constructor(private media:MediaObserver){
  }
  public isMobileDevice():boolean{
    return this.media.isActive(['xs','sm']);
  }
}
