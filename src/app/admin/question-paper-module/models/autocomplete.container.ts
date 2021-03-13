export class AutoComplateContainer {
  private top:string = '100%';
  private left:string = "0px";
  private isAutoComplete:boolean = false;
  public constructor() {}
  public set Top(top:string){
    this.top = top;
  }
  public get Top():string{
    return this.top;
  }
  public set Left(left:string){
    this.left = left;
  }
  public get Left():string{
    return this.left;
  }
  public set IsAutoComplate(isAutoComplete:boolean){
    this.isAutoComplete = isAutoComplete;
  }
  public get IsAutoComplate():boolean{
    return this.isAutoComplete;
  }
}
