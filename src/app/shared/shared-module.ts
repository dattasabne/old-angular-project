import { NgModule } from "@angular/core";
import { BallLoader } from "./ball-loader/triangle-loader";
import { LoaderModule } from "./loader/loader-module";
import { ImagePopup } from './image-popup/image.popup.component';
import { MaterialModule } from '../material-module';

@NgModule({
    declarations:[BallLoader],
    imports:[LoaderModule,MaterialModule],
    exports:[BallLoader],
    entryComponents : []
})
export class SharedModule{
    public constructor(){}
}
