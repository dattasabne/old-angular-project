import { CustomPdfViewer } from './custom-pdf-viewer/custom.pdfviewer.component';
import {LayoutModule} from '@angular/cdk/layout';

import { NgModule } from "@angular/core";

@NgModule({
  declarations:[CustomPdfViewer],
  imports:[LayoutModule],
  entryComponents:[],
  exports:[CustomPdfViewer],
  providers:[]
})
export class CustomPdfModule {
  public constructor() {}
}
