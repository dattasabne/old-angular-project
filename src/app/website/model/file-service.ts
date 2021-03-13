import { FileDropModel } from './file-drop-model';
import { Injectable } from "@angular/core";
@Injectable({
  providedIn:'root'
})
export class FileService{
  public constructor(){}
  public getFile(dataTransfer:DataTransfer , fileExtension:string):FileDropModel{
    let fileModel : FileDropModel = <FileDropModel> {};
    fileModel.success = false;
    fileModel.message = "Invalid File Uploaded . Please Upload Valid File.";
    let file : File = null;
    if(dataTransfer.items){
      for(let index = 0 ; index < dataTransfer.items.length ; index++){
        let isFile:boolean = (dataTransfer.items[index].kind ==='file');
        if(isFile){
          file = dataTransfer.items[index].getAsFile();
        }
      }
    }else{
      for(let index = 0 ; index < dataTransfer.files.length ; index++){
        file = dataTransfer.files[index];
        break;
      }
    }
    fileModel = this.checkFileByExtention(file,fileExtension);
    if(fileModel.success){
      fileModel.success = true;
      fileModel.message = 'file uploaded successFully';
      fileModel.file = file;
      fileModel.fileName = file.name;
      return fileModel;
    }
    return fileModel;
  }
  public checkFileByExtention(file:File,fileExtention:string):FileDropModel{
    let fileModel:FileDropModel = <FileDropModel>{};
    fileModel.success = false;
    fileModel.message = `This Is Not ${fileExtention} File.`;
    let dyNamicExtensionRegEx:string = `^.*(${fileExtention})$`;
    let regExp:RegExp = new RegExp(dyNamicExtensionRegEx);
    if(regExp.test(file.name)){
      fileModel.message = 'file is valid';
      fileModel.success = true;
      return fileModel;
    }
    return fileModel;
  }
  public onDragOver_Handler(ev:DragEvent):void{
    ev.preventDefault();
  }
  public defaulFileDrop(ev:DragEvent):void{
    ev.preventDefault();
  }
}
