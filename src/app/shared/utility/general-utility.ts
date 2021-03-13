
import { ValidatorConstant } from './validator.constant';

export class GeneralUtility {
  public static isDuplicateObject(
    array: Array<any>,
    key: string,
    value: string
  ): boolean {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] && value &&  array[i][key].toUpperCase().trim() == value.toUpperCase().trim()) {
        return true;
      }
    }
    return false;
  }

  public static getValueFilter(param: any, key: string) {
    if (typeof param === undefined || typeof param === null) {
      return "ALL";
    }
    if (typeof param == "string") {
      return param;
    }
    if (param && typeof param == "object") {
      return param[key];
    }
  }
  public static convertDateIntoDbDate(data: string): string {
    let formatDate = null;
    try {
      const date = new Date(data);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      formatDate = month + "-" + day + "-" + year;
    } catch (e) {
      console.log(e);
    } finally {
      return formatDate;
    }
  }


  public static getDefaultNumberValue(value:string):number{
    value = GeneralUtility.trimValue(value);
    if(ValidatorConstant.NUMBER_PATTERN.test(value)){
      return Number(value);
    }
    return 0;
  }
  public static trimValue(data:string):string{
    if(data){
      return data.trim();
    }
    return '';
  }


  public static dateFilter(data: string): string {
    const regx: RegExp = /^[0-9]+[-][0-9]+[-][0-9]{4}$/;
    if (regx.test(data) && data != "1-1-1970") {
      return data;
    }
    return "ALL";
  }
  public static getMonthNameByNumber(num: number): string {
    let month = "N.A.";
    switch (num) {
      case 1:
        month = "JAN";
        break;
      case 2:
        month = "FEB";
        break;
      case 3:
        month = "MAR";
        break;
      case 4:
        month = "APR";
        break;
      case 5:
        month = "MAY";
        break;
      case 6:
        month = "JUN";
        break;
      case 7:
        month = "JUL";
        break;
      case 8:
        month = "AUG";
        break;
      case 9:
        month = "SEP";
        break;
      case 10:
        month = "OCT";
        break;
      case 11:
        month = "NOV";
        break;
      case 12:
        month = "DEC";
        break;
    }
    return month;
  }
}
