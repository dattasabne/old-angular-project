import { HttpHeaders } from "@angular/common/http";
// ---------------------------- http host start -----------------------------------------------
export const httpProtocol = "http://";
export const port = ':8080';
// export const host ="52.172.209.201"; production server
export const host =  'localhost'; // development server
export const javaServerHost = `${httpProtocol}${host}${port}`;
// ---------------------------- http host end --------------------------------------------------
export const headerContenttype   = 'Content-Type';
export const headerAuthorization = 'Authorization';
export const applicationJson         =  'application/json';
export const bearer                       = 'Bearer ';
// ---------------------------- start http rest webservice urls --------------------------------
export const organizationAuthBaseurl = '/institute-authentication';
export const organizationAuthUrl     = '/institute-login';
export const organizationAuthbylink   = '/institute-linkdata';
export const organizationPatternApi   = '/institute-pattern';
export const httpFailureErrorTitle = 'Network Error : ';
// ---------------------------- end http rest webservice urls ----------------------------------
export const jwtToken   = 'jwt_token';
export const rememberMe = 'remember_me';
export const setJwtToken = (token: string): void => {
  try{
    sessionStorage.setItem(jwtToken , token);
  }catch(e){
    console.log(e);
  }
};
export const getJwttoken = (): string | null => {
  let token = null ;
  try{
    token   = sessionStorage.getItem(jwtToken);
  }catch(e){
    console.log(e);
  }
  return token;
}
export const httpHeaderPlain = (): HttpHeaders => {
  const httpHeader = new HttpHeaders();
  httpHeader.set(headerContenttype, applicationJson);
  return httpHeader;
 };
export const httpHeaderWithToken = (): HttpHeaders => {
   const  localJwtToken = getJwttoken();
   const httpHeader = new HttpHeaders();
   httpHeader.set(headerAuthorization, bearer + localJwtToken); 
   httpHeader.set(headerContenttype, applicationJson);
   return httpHeader;
 };
export const setRememberMe = (username: string): void => {
    try{
      localStorage.setItem(rememberMe , username);
    }catch (e){
      console.log(e);
    }
 };
export const getRememberMe = (): string | null => {
    let username = null;
    try{
       username = localStorage.getItem(rememberMe);
    }catch (e){
      console.log(e);
    }
    return username;
 };

export const httpConnectionError = (): string => {
  return 'Error : Unable to Connect Server !.Possible Causes Are \n 1] Your Internet Connection Is Slow Or Lost 2] Network Conjection In Connecting To The Remote Server 3] Remote Server Is Offline';
}



