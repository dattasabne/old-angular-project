
export class NumberUtility{
  public static correctNumber(x:any):any{
    if(isNaN(x)){
      return 'N.A.';
    }
    let number = Number(x);
    if(Number.isInteger(number)){
      return Number.parseInt(number.toString());
    }else{
      return number.toFixed(2);
    }
  }
}
