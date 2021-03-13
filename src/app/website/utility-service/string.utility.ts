export class StringUtility{
  public constructor(){}
  public static isEmpty(data:any):boolean{
    if(data == null || data == undefined || !data){
      return true;
    }
    if(typeof data == 'string'){
      return (data.trim().length < 1);
    }
    if(Array.isArray(data)){
      return (data.length == 0);
    }
    if(typeof data == 'object' && JSON.stringify(data) == JSON.stringify({})){
      return true;
    }
    return false;
  }
  public static isNumber(value:string):boolean{
    if(StringUtility.isEmpty(value)){
        return false;
    }
    return (/^[0-9]+$/.test(value));
  }
  public static createDataBaseDateByDateString(dateString:string):string{
    let dataBaseDate:string = null;
    let date:Date = new Date(dateString);
    dataBaseDate = date.getFullYear() +"-" + (date.getMonth() + 1)+"-"+date.getDate();
    dataBaseDate = dataBaseDate.concat(" ").concat("00:00:00:000");
    return dataBaseDate;
  }
  public static createAssignmentDataBaseTime(timeString:string):string{
    let assignmentTime:string ="1899-12-30";
    assignmentTime = assignmentTime.concat(" ").concat(timeString).concat(":00.000");
    return assignmentTime;
  }
  public static getDefaultString(value:string):string{
    return (value && value.trim().length > 0)? value.trim() : "";
  }
}
