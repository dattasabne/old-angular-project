import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})
export class MessageService{
    public constructor(){}
    public serverMessage(status:string,statusText:string):string{
        return `status : ${status} . statusText : ${statusText}`;
    }
}