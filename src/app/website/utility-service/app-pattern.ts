
export class AppPattern{
  public static readonly  timeFormatPattern:RegExp = /^(([0-9][0-4])|([0-9][0-4]:[0-9][0-4]))$/;
  public static readonly  invalidTimeFormatMessage:string = "Please Enter Valid Time i.e. HH:MM(09:25)";
  public static readonly  zeroTimePattern:RegExp = /^(([0][^0])|([1-9][0-9]))|((([0-9][0-9]))[:][0-9]{1,2})$/; // wrong pattern;
  public static readonly  zeroTimeMessage:string = "Zero Time Not Allowed";
}








