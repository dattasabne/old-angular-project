
export class LoginResponseModel{
  public constructor(){}
  private _result:boolean;
  private _data:any;

	public get result(): boolean {
		return this._result;
	}
  public get data(): any {
		return this._data;
	}
  public get message(): string {
		return this._message;
	}
  public set result(value: boolean) {
		this._result = value;
	}
  public set data(value: any) {
		this._data = value;
	}
  public set message(value: string) {
		this._message = value;
	}
  private _message:string;
}
