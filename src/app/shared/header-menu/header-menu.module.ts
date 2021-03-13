import { NgModule } from "@angular/core";
import { NavBarMenuComponent } from "./navbar-menu/navbar-menu.component";
import { MaterialModule } from "src/app/material-module";

@NgModule({
    declarations:[NavBarMenuComponent],
    exports:[NavBarMenuComponent],
    imports:[MaterialModule],
    entryComponents:[]
})
export class NavbarModule{
    public constructor(){}
}