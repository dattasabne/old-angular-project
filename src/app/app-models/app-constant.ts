
import {ValidationModel } from './app-validators';
import { UserProfile } from './app.datamodel';
import { MatDialogModel } from './mat.dialog.model';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatBottomSheetConfig } from '@angular/material/bottom-sheet';
export const typeString = 'string';
export const typeObject = 'object';
export const typeNull = 'null';
export const typeUndefined = 'undefined';
export const typeNumber  = 'number';
export const typeInteger = 'integer';
export const typeDouble  = 'double';
export const typeArray   = 'array';
export const integerRegx = /^([0-9])+$/;
export const numberRegx  = /^(([0-9]+)|([0-9]+[.][0-9]+))$/;
export const doubleRegx  = /^([0-9]+[.][0-9]+)$/;
export const validData   = 'valid data';
export const blankString = 'blank string';
export const openRoundBracket  = '(';
export const closeRoundBracket = ')';
export const comma = ',';
export const dialogInfo = 'Information Dialog';
export const netWorkIssue = 'Network Issue Occured !';
export const loginSuccess = 'You are successfully logged in !';
export const cancel = 'cancel';
export const homepage = 'homepage';
export const ok = 'Ok';
export const loginDataNotAvailable = 'Login Data Is Not Available. Please Re-login or contact to software vendor !';
export const nullDataDialogMessage = 'Data Not Available Dialog.';
export const isEmptyData = (data: any): boolean => {
  const type: string = typeof data;
  if (type === typeNull || type === typeUndefined){
    return true;
  }else if (type === typeString && data.trim().length === 0){
    return true;
  }
  return false;
};
export const isEmptyArray = (data: any): boolean => {
  if (isEmptyData(data)){
    return true;
  }else if (Array.isArray(data) && data.length === 0){
    return true;
  }
  return false;
};
export const isNumber = (data: any): boolean => {
  return (numberRegx.test(data));
};
export const isInteger = (data: any): boolean => {
  return (integerRegx.test(data));
};
export const typeMessage = (fieldName: string , currentDataType: string , requiredDataType: string ): string => {
  return (`${fieldName} field data should be ${requiredDataType}. here found  ${currentDataType} !`);
};
export const getValidator = (): ValidationModel => {
  return  {} as ValidationModel;
};
export const isblankString = (data: string): boolean => {
  return (data.trim().length === 0);
};
export const getObject = <T>(): T => {
  return ( {} as T);
};
export const defaultAlertModel = (): MatDialogModel => {
  const dialogModel: MatDialogModel = getObject<MatDialogModel>();
  dialogModel.title = 'ALERT DIALOG';
  dialogModel.messageBody = '';
  dialogModel.alertButtonName = 'ok';
  return dialogModel;
};
export const defaultAlertConfig = (): MatDialogConfig => {
  const config = {} as MatDialogConfig;
  config.autoFocus = true;
  config.closeOnNavigation = true;
  config.height = '300px';
  config.width  = '500px';
  config.disableClose = true;
  return config;
};
export const defaultAlertBottomSheet = (): MatBottomSheetConfig => {
  const sheetConfig: MatBottomSheetConfig = {} as MatBottomSheetConfig;
  sheetConfig.disableClose = true;
  sheetConfig.autoFocus = true;
  sheetConfig.closeOnNavigation = true;
  return sheetConfig ;
};
export const validateData = (fieldName: string, data: any, requiredDataType: string): ValidationModel => {
  const currentDataType: string = typeof data;
  const valid = getValidator();
  valid.isValid = true;
  valid.message = validData;
  if (requiredDataType === typeString){
    if (currentDataType === typeNull){
      valid.isValid = false;
      valid.message = typeMessage(fieldName, typeNull, typeString);
    }else if (currentDataType === typeUndefined){
      valid.message = typeMessage(fieldName, typeUndefined, typeString);
      valid.isValid = false;
    }else if (isblankString(data)){
      valid.message = typeMessage(fieldName, blankString, typeString);
      valid.isValid = false;
    }
    return valid;
  }

  if(requiredDataType === typeObject){
    if (currentDataType === typeNull){
      valid.isValid = false;
      valid.message = typeMessage(fieldName, typeNull, requiredDataType);
    }else if (currentDataType === typeUndefined){
      valid.isValid = false;
      valid.message = typeMessage(fieldName, typeUndefined, requiredDataType);
    }
    return valid;
  }

  if(requiredDataType === typeArray){
    if (currentDataType === typeNull){
      valid.isValid = false;
      valid.message = typeMessage(fieldName, typeNull, requiredDataType);
    }else if (currentDataType === typeUndefined){
      valid.isValid = false;
      valid.message = typeMessage(fieldName, typeUndefined, requiredDataType);
    }else if (isEmptyArray(data)){
      valid.isValid = false;
      valid.message = typeMessage(fieldName, 'array is empty', requiredDataType);
    }
    return valid;
  }
  if (requiredDataType === typeInteger){
    if (!isInteger(data)){
      valid.isValid = false;
      valid.message = typeMessage(fieldName, currentDataType, requiredDataType);
      return valid;
    }
  }
  return valid;
};

export const getOrganizationLinks = (profiles: UserProfile[]): string => {
  const links: string = openRoundBracket;
  for (let i = 0 ; i < profiles.length; i++){
    if (i === 0){
      links.concat(profiles[i].link);
    }else{
      links.concat(comma + profiles[i].link);
    }
  }
  links.concat(closeRoundBracket);
  return links;
};
