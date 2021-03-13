import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
export let ErrorService = (error:HttpErrorResponse)=>{
  if(error.error instanceof ErrorEvent){
    // this is client side error
    alert(error.error.message);
  }else{


    // this is server side error
    alert("server side error occured : status code = "+error.status +"\n error message = "+error.message) ;

  }
  return throwError("something going wrong please tray again or later.")
}
