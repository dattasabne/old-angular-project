export class DateTimeUtility {
  public static isDateExistInWeek(
    input: { startDate: ""; endDate: "" },
    currentDate: string
  ): boolean {
    if (!input || !input.startDate || !input.endDate) {
      return false;
    }
    let startDate = new Date(input.startDate);
    let endDate = new Date(input.endDate);
    while (startDate <= endDate) {
      let weekDate = DateTimeUtility.makeDateFormat(new Date(startDate));
      if (weekDate.trim().toUpperCase() == currentDate.trim().toUpperCase()) {
        return true;
      }
      let tempDate = new Date(startDate);
      tempDate.setDate(startDate.getDate() + 1);
      startDate = tempDate;
    }
    return false;
  }












  
  public static makeDateFormat(date: Date): string {
    if (!date) {
      return "N.A.";
    }
    let strYear = date.getFullYear();
    let strMonth = date.getMonth() + 1;
    let strDate = date.getDate();
    let formatedDate = strYear + "-" + strMonth + "-" + strDate;
    return formatedDate;
  }
  public static getCurrentDate(): string {
    return null;
  }
  public static getCurrentDateInDbFormat(): string {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + "-" + month + "-" + day;
  }
}
