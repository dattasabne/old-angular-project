export class TimeLibrary {
  public static convertSecondInToHourFormat(sec: number): string {
    const hour = Math.floor(sec / 3600);
    let reminder = sec % 3600;
    const minutes = Math.floor(reminder / 60);
    reminder = reminder % 60;
    const second = reminder;
    const format = hour + ":" + minutes + ":" + second;
    return format;
  }
  public static convertTimeInSecond(time: string): number {
    let totalSecond = 0;
    try {
      let timesplit: string[] = time.split(":");
      if (timesplit != null && timesplit.length == 3) {
        let hour = Number(timesplit[0]);
        let minutes = Number(timesplit[1]);
        let second = Number(timesplit[2]);
        let hoursecond = hour * 3600;
        let minutessecond = minutes * 60;
        totalSecond = hoursecond + minutessecond + second;
      }
    } catch (error) {
      alert(JSON.stringify(error));
    }
    return totalSecond;
  }
  public static addSecondInTime(sec: number): string {
    const hour = Math.floor(sec / 3600);
    let reminder = sec % 3600;
    const minutes = Math.floor(reminder / 60);
    reminder = reminder % 60;
    const second = reminder;
    const format = hour + ":" + minutes + ":" + second;
    return format;
  }
}
