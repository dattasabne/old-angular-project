
export interface MatDialogModel{
  title: string | null | undefined;
  messageBody: string | null | undefined;
  alertButtonName: string | null | undefined;
  yesButtonName: string | null | undefined;
  noButtonName: string | null | undefined;
  yesCallback: () => void;
  noCallBack: () => void;
}
