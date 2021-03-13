
export class AppConstant {
  //--------------------------------{ Production Server }--------------------------------------------
  // public static readonly IGOTRANK_URL = "http://koshedutech.com/igotrank";  // cloud server machine
  // public static readonly SERVER_HOST  = "http://52.172.209.201:8080";
  // public static readonly PHP_HOST     = "http://koshedutech.com";

  //-------------------------------------------------------------------------------------
  //-------------------------------{ Development Server }--------------------------------
  // public static readonly SERVER_HOST:string  = "http://52.172.209.201:8081";
  // public static readonly IGOTRANK_URL:string = "http://localhost/online/igotrank"; //client deployment machine
  // public static readonly PHP_HOST:string     = "http://localhost/online";
  //------------------------------- { Local Development Server } -----------------------------------

  public static readonly SERVER_HOST:string  = "http://localhost:8080";
  public static readonly IGOTRANK_URL:string = "http://localhost/online/igotrank"; //client deployment machine
  public static readonly PHP_HOST:string     = "http://localhost/online";

  //--------------------------------------------------------------------------------------------
  public static instituteLogo :string= "";
  public static KoshBrandingLogo:string      = "assets/kosh_brand_logo.jpg";
  public static readonly ALL: string                    = "ALL";
  public static readonly LOGIN_TYPE_WEB:string          = "web";
  public static readonly LOGIN_TYPE_ANDROID:string      = "android";
  public static readonly LOGIN_TYPE_BYLINK:string       = "institute_link";
  public static readonly LOGIN_TYPE_STUDENT:string      = "student";
  public static readonly LOGIN_TYPE_INSTITUTE:string    ="institute";
  public static readonly LOGIN_TYPE_MASTER_ADMIN:string ="master_admin";
  public static readonly NOCONNECT_RESPONSE:string      = "Error : Unable to Connect Server !.Possible Causes Are \n 1] Your Internet Connection Is Slow Or Lost 2] Network Conjection In Connecting To The Remote Server 3] Remote Server Is Offline ";
  public static readonly DONTWORRY_TESTRESULT_MESSAGE:string = "Unable to connect to server to send result. Don't worry next time when you login it will be sync to server. ";
  public static readonly LOGOUT_LINK_OF_LINKAPP:string  ="";
  public static readonly LOGOUT_LINK_OF_ANDROID:string  = "";
  public static readonly KOSH_EDTECH_DEFAULT_LINK:string ="koshedutech";
  public static readonly OFFLINE_RESULT_MESSAGE:string = "This Is Offline Result ";
  public static readonly ONLINE_RESULT_MESSAGE:string = "This Is Online Result ";
  public static SUBJECT_ORDER:string[] = ["p","c","m","b"];
  public static ATTEMPTED:string = "first-attempted";
  public static RE_ATTEMPTED:string = "re-attempted";

}


