
  export interface FieldValidator{
    isValid:boolean;
    message:string;
    returnValue:boolean;

  }
  export interface FieldData{
    newDate:string;
    timeFormat:string;
    remaining:number;
    totalMinutes:number;
    totalHours:number;
    totalDay:number;
  }
