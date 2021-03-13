import { Injectable } from "@angular/core";
import { read } from 'xlsx/types';
import { ImageInterface } from '../interfaces/image-interface';
@Injectable({
    providedIn:'root'
})
export class ImageService{
    public constructor(){}
    public uploadImage(file:File):Promise<ImageInterface>{
        let promise = new Promise<ImageInterface>(function(resolve,reject){
            let reader = new FileReader();
            reader.onload = (ev)=>{
                let imageData:ImageInterface = <ImageInterface>{};
                imageData.result = true;
                imageData.data = <string>reader.result;
                imageData.message = "Image Retrive Successfully..!";
                resolve(imageData);
            };
            reader.onerror = (ev:Event)=>{
                let imageData:ImageInterface = <ImageInterface>{};
                imageData.result = false;
                imageData.data = null;
                imageData.message = "Image Retrive Failed..!";
                reject(imageData);
            }
            reader.readAsDataURL(file);
        });
        return promise;
    }
    public isImageFile(file:File):boolean{
        if(!file){
            return false;
        }
        let pattern = /^(.*(\.)(jpg|jpeg|bmp|png|tiff))$/;
        let fileName = file.name;
        return pattern.test(fileName);
    }
}