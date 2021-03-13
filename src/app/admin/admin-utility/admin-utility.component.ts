import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UtilityService } from './utility.service';
import { LinkModel } from './class-link-model';
import { DialogService } from 'src/app/students/shared/services/dialog-service';
import { MatCheckboxChange } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-admin-utility',
  templateUrl: './admin-utility.component.html',
  styleUrls: ['./admin-utility.component.css']
})
export class AdminUtilityComponent implements OnInit,AfterViewInit {
  @ViewChild("linkName",{read:ElementRef,static:false}) linkName:ElementRef;
  @ViewChild("updatedLink",{read:ElementRef,static:false}) updatedLink:ElementRef;
  @ViewChild("imageUrl",{read:ElementRef,static:false}) imageUrl:ElementRef;
  public _linkName:HTMLInputElement = null;
  public _updatedLink:HTMLInputElement = null;
  public _imageUrl:any = null;
  public classLink:string = "";
  public addLinkControl:FormControl = new FormControl();
  public deleteLinkControl:FormControl = new FormControl();
  public modifyLinkControl:FormControl = new FormControl();
  public addImageControl:FormControl = new FormControl();
  public deleteImageControl:FormControl = new FormControl();
  public linkPatten = /^[a-zA-Z][a-zA-Z0-9-_]*$/;
  public imagePattern = /^image\/(jpg|jpeg|png|bmp|gif)$/;
  public isLoaded:boolean = false;
  // public modifiedLink:FormControl = new FormControl();
  // public modifiedLink:any;
  // public classes: string[] = ['Class1', 'Class2', 'Class3','Class4', 'Class5'];
  public filteredClasses: Observable<any[]>;
  public allClasses:LinkModel[] = [];

  public alertMessageData = {
    height:200,
    width:300
  }

  public selectAll:string = "SelectAll"
  public validation= {invalid:false,message:''};
  isChecked:boolean;

  constructor(
    private utilityService:UtilityService,
    private dialog:DialogService,
    private domSanitizer:DomSanitizer) {
    this.isChecked = false;
  }
  public printAddClassess :any[] = [];
  public linkClasses:any[] = [];
  public deletelinkClasses :any[] = [];
  public modifylinkClasses :any[] = [];
  public addImagesClasses :any[] = [];
  public deleteImagesClasses :any[] = [];
  public sliderImages:LinkModel[] = [];
  public deleteSliderImageData:LinkModel[] = [];
 public selectSingleCheckbox:any;

 ngOnInit() {
    this.getAllClasses();
    this.getLinkClasses();
    this.filterAllControlClasses();
  }
ngAfterViewInit() {
this._linkName = this.linkName.nativeElement;
this._updatedLink = this.updatedLink.nativeElement;
this._imageUrl = this.imageUrl.nativeElement;
}
public checkFlag:boolean = false;
public checkOption:string = 'Select All';
public doCheck():void{
  if(this.checkFlag){
    this.uncheckAll();
    this.checkFlag = false;
    this.checkOption = "Select All";
  } else {
    this.checkAll();
    this.checkFlag = true;
    this.checkOption = "De-Select All";
  }
}
public uncheckAll():void{
  this.sliderImages.forEach(image=>{
    image.isChecked = false;
  });
}
public checkAll():void {
  this.sliderImages.forEach(image=>{
    image.isChecked = true;
  });
}
public imageSanitize() {
  this.sliderImages.forEach(image=>{
    image.sliderImage = this.domSanitizer.bypassSecurityTrustUrl(image.sliderImage);
  });
}
// public selectCheckbox() {
//   if(this.selectedAllCheckbox.checked) {
//     this.selectAll = "Deselect All";
//     for(let i=0; i<this.selectSingleCheckbox.length; i++) {
//       this.selectSingleCheckbox[i].checked;
//     }
//   }
// }

private displayLinks(value:any):string{
  if(typeof value=='object'){
    return value.link;
  }
  return '';
}

public getAllClasses() {
  this.isLoaded = true;
  this.utilityService.getAllClasses()
  .subscribe(res=>{
    // console.log(res);
    if(res.result){
      this.allClasses = res.data;
      this.generateClassNameByUniqueClassName();
      this.addLinkControl.setValue("",{onlySelf:true});
      this.deleteLinkControl.setValue("",{onlySelf:true});
      this.modifyLinkControl.setValue("",{onlySelf:true});
      this.addImageControl.setValue("",{onlySelf:true});
      this.deleteImageControl.setValue("",{onlySelf:true});
      this.isLoaded = false;
    }else{
      alert(res.message);
    }
  },err=>{
    console.log(err);
    this.isLoaded = false;
  })
}
public filterAllControlClasses() {
  // display add link classes
  this.printAddClassess = this.allClasses;
    this.addLinkControl.valueChanges.subscribe(value=>{
      if(typeof value=='string'){
          if(value){
            this.printAddClassess = this._filter(value);
          }else{
            this.printAddClassess = this.allClasses;
          }
      }
});

    // display delete link classes
  this.deletelinkClasses = this.linkClasses;
  this.deleteLinkControl.valueChanges.subscribe(value=>{
    if(typeof value=='string'){
        if(value){
          this.deletelinkClasses = this.linkClassFilter(value);
        }else{
          this.deletelinkClasses = this.linkClasses;
        }
    }
    this.classLink= this.displayLinks(value);
  });  

    
    // display modify link classes
  this.modifylinkClasses = this.linkClasses;
  this.modifyLinkControl.valueChanges.subscribe(value=> {
      if(typeof value=='string'){
          if(value){
            this.modifylinkClasses = this.linkClassFilter(value);
          }else{
            this.modifylinkClasses = this.linkClasses;
          }
      }
      this.classLink = this.displayLinks(value);
    });  

    // display add image classes

  this.addImagesClasses = this.allClasses;
  this.addImageControl.valueChanges.subscribe(value=> {
    if(typeof value=='string'){
        if(value){
          this.addImagesClasses = this._filter(value);
        }else{
          this.addImagesClasses = this.allClasses;
        }
    }
    this.classLink = this.displayLinks(value);
  });

    // display delete images classes
  this.deleteImagesClasses = this.allClasses;
  this.deleteImageControl.valueChanges.subscribe(value=> {
    if(typeof value=='string'){
        if(value){
          this.deleteImagesClasses = this._filter(value);
        }else{
          this.deleteImagesClasses = this.allClasses;
        }
    }
    if(typeof value=='object') {
      this.loadClassImages(value);
    }
    this.classLink = this.displayLinks(value);
  });
}
 private setDefaultImageData() {
   this.sliderImages.forEach(image=>{
    image.display = true;
    image.isChecked = false;
   });
 }

public loadClassImages(value:any):void {
  let uniqueClassName = value.uniqueClassName;
  let data = {
    uniqueClassName:uniqueClassName
  };
  console.log(data);
  this.utilityService.getClassSliderImages(data)
  .subscribe(res=>{
    console.log(res);
    this.imageSanitize();
    if(res.result){
      this.sliderImages = <LinkModel[]>res.data;
      this.setDefaultImageData();
    }
  },err=>{
    console.log(err);
  })
}
public deleteLinkImages(value:any):void{
  let uniqueClassName = value.uniqueClassName;
  let data = {
    uniqueClassName:uniqueClassName
  };
 
}




private generateClassNameByUniqueClassName():void {
  this.allClasses.forEach(classes=>{
    if( classes.className == null ||(classes.className.trim().length<1)){
      classes.className = classes.uniqueClassName;
    }
  });
}

private generateLinkClassNameByUniqueClassName():void{
  this.linkClasses.forEach(classes=>{
    if( classes.className == null ||(classes.className.trim().length<1)){
      classes.className = classes.uniqueClassName;
    }
  });
}

public _filter(value: any): any[] {
    let newData = this.allClasses.filter((classVal=>{
      this.classLink = classVal.link;
      if(classVal.className ==null || classVal.className.trim().length<1 ) {
        return (classVal.uniqueClassName.toLowerCase().indexOf(value) !=-1)
      }
      return (classVal.className.toLowerCase().indexOf(value) !=-1)
    }));  
    return newData;
}

public linkClassFilter(value: any): any[] {
  this.getLinkClasses();
  let newData = this.linkClasses.filter((classVal=>{
    this.classLink = classVal.link;
    if(classVal.className ==null || classVal.className.trim().length<1 ) {
      return (classVal.uniqueClassName.toLowerCase().indexOf(value) !=-1)
    }
    return (classVal.className.toLowerCase().indexOf(value) !=-1)
  }));  
  return newData;
}

 public displayName(value):string {
    if(!value)return '';
    return value.className;
  }
  public add() {
    let addLinkAlertMessage = "Do you really want to add this link";
    this.dialog.confirmDialog(addLinkAlertMessage,this.save.bind(this));
  }
  public save() {
    let message = "Link Added Successfully";
    if(this.validate()) {
      let uniqueClass = this.addLinkControl.value;
      const data = {
        uniqueClassName:uniqueClass.uniqueClassName,
        link:this._linkName.value
      }
      console.log(data);
      this.utilityService.addLink(data)
      .subscribe(res=>{
        console.log(res);
       this.dialog.showAlert(res.message,this.alertMessageData);
      },err=>{
        console.log(err);
      });
      }
  }
  public delete() {
  let alertMsg = "Do you really want to delete this link";
  this.dialog.confirmDialog(alertMsg,this.remove.bind(this));
  }
  public remove() {
  let successMessage = "Link Deleted Successfully";
   let uniqueClass = this.deleteLinkControl.value;
    const data = {
      uniqueClassName:uniqueClass.uniqueClassName,
    }
    this.dialog.showAlert(successMessage,this.alertMessageData);
    this.utilityService.deleteLink(data)
    .subscribe (res=>{
      console.log(res);
      if(res.result){
        this.dialog.showAlert(successMessage,this.alertMessageData);
      }
    },err=>{
      console.log(err);
    }) 
    console.log(data);
  }
  public getLinkClasses() {
    this.utilityService.getAllLinkClasses().subscribe(res=>{
      if(res.result) {
        this.linkClasses = res.data;
        this.generateLinkClassNameByUniqueClassName();
      }
      console.log(res);
    },err=>{
      console.log(err);
    })
  }

 public udpate() {
    let modifyLinkAlertMessage = "Do you really want to updated the link";
    this.dialog.confirmDialog(modifyLinkAlertMessage,this.modify.bind(this));
  }
  public modify() {
  let message = "Link Updated Successfully";
   if(this.validateModifiedLink()) {
      let modifylink = this.modifyLinkControl.value;
      const data = {
        uniqueClassName:modifylink.uniqueClassName,
        link:this._updatedLink.value
      }
      this.utilityService.modifyLink(data)
      .subscribe (res=>{
        console.log(res);
        if(res.result) {
          this.linkClasses = res.data;
          this.getLinkClasses();
          this.generateLinkClassNameByUniqueClassName();
          this.dialog.showAlert(message,this.alertMessageData);
        }
      },err=>{
        console.log(err);
      }) 
    }
  }
  public saveImage() {
    let addImageAlertMessage = "Do you really want to add this image";
    this.dialog.confirmDialog(addImageAlertMessage,this.addImage.bind(this));
  }
  public addImage() {
   let message = "Image added Successfully";
      let uniqueClass = this.addImageControl.value;
      const data = {
        uniqueClassName:uniqueClass.uniqueClassName,
        classLogo:this._imageUrl
      }
      console.log(data);
      this.utilityService.addImage(data)
      .subscribe(res=>{
        this.dialog.showAlert(res.message,this.alertMessageData);
        console.log(res);
      },err=>{
        console.log(err);
      });
  }

  public uploadImage() {
    let file = document.querySelector(".input-file") as HTMLInputElement;
    let reader = new FileReader(); 
    let file1 = file.files[0];
    let fileType = file1.type;
    let fileSize = file1.size;
    if(!fileType.match("^image\/(jpeg|jpg|png|gif|bmp)$")){
       alert("Please Upload Only Image File..!");
       return;
    }
    reader.onload = (ev:any)=>{ 
        let image = document.querySelector(".img") as HTMLImageElement;
        let result = ev.target.result;
        image.src = result;
        this._imageUrl = result;
        let fileSizeInKb = Math.round(fileSize/1024);
        console.log(fileSizeInKb);
      } 
      reader.readAsDataURL(file.files[0]);
  }
 public check(val:MatCheckboxChange){
   alert(val.source.checked);
 }
 public selectedImages() {
  this.sliderImages.forEach(images=>{
    if(images.isChecked) {
      this.deleteSliderImageData.push(images.sliderImage);
      images.sliderImage = "";
      images.display = false;
      this.checkFlag = false;
      this.checkOption = "Select All";
    }
  });
  this.sliderImages = this.sliderImages;
 }
 public deleteImg() {
  let alertMsg = "Do you really want to delete";
  this.dialog.confirmDialog(alertMsg,this.removeImg.bind(this));
 }
 public removeImg() {
  this.selectedImages();
  let message = "Images deleted Successfully";
  let deleteImagesUniqueClass = this.deleteImageControl.value;
  let data = {
    uniqueClassName:deleteImagesUniqueClass.uniqueClassName,
    sliderImageData:this.deleteSliderImageData
  }
  console.log(data);
  this.utilityService.deleteImages(data)
  .subscribe(res=>{
    console.log(res);
    if(res.result) {
      this.dialog.showAlert(message,this.alertMessageData);
      // this.deleteSliderImageData = [];
    }
  },err=>{
    console.log(err);
  })
 }
 public validate():boolean {
    if(!this.linkPatten.test(this._linkName.value)) {
     alert("Please enter valid link");
       return false;
    }
    else if (
      this._linkName == null ||
      this._linkName == undefined ||
      this._linkName.toString().trim().length < 1
    ) {
      alert("Please enter the link name");
      return false;
    } 
    return true;
  }
  public validateModifiedLink():boolean {
    if(!this.linkPatten.test(this._updatedLink.value)) {
      alert("Please enter valid link");
       return false;
    }
    else if (
      this._updatedLink == null ||
      this._updatedLink == undefined ||
      this._updatedLink.toString().trim().length < 1
    ) {
      alert("Please enter the link name");
      return false;
    }
    return true;
  }
}
