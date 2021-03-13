import { Injectable } from "@angular/core";
import { ClassDetailModal } from "src/app/shared/model/class-detail-model";
@Injectable({
    providedIn : 'root'
})
export class AdminLoginService{
    private _adminLoginData:ClassDetailModal;
    public constructor(){}
    public get adminLoginData():ClassDetailModal{
        return this._adminLoginData;
    }
    public set adminLoginData(adminData:ClassDetailModal){
        this._adminLoginData = adminData;
    }
}