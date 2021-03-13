import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})
export class SharedLoginService{
    public constructor(){}
    private _loginType:string;
    private _authToken:string;
    private _instituteLink:string;
    private _bannerImage:string;
    private _logo_image:string;

    public get logo_image(): string {
		  return this._logo_image;
	  }
    public set logo_image(value: string) {
      this._logo_image = value;
    }
    public get bannerImage(): string {
      return this._bannerImage;
    }
    public set bannerImage(value: string) {
      this._bannerImage = value;
    }
    public get instituteLink(): string {
      return this._instituteLink;
    }
    public set instituteLink(value: string) {
      this._instituteLink = value;
    }
    public get appType(): string {
      return this._appType;
    }
    public set appType(value: string) {
      this._appType = value;
    }
    private _appType:string;
    public get loginType(): string {
      return this._loginType;
    }
    public set loginType(value: string) {
      this._loginType = value;
    }
    public get authToken(): string {
      return this._authToken;
    }
    public set authToken(value: string) {
      this._authToken = value;
    }
}
