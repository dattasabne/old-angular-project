import { Injectable } from "@angular/core";
@Injectable({
  providedIn:'root'
})
export class NavigationService{
  private _loadAssignmnetFunction:()=>void;
  public get loadAssignmentFunction():()=>void{
    return this._loadAssignmnetFunction;
  }
  public set loadAssignmentFunction(_callBack:()=>void){
    this._loadAssignmnetFunction = _callBack;
  }
  public constructor(){}
}
