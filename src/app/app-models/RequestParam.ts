
import { ValidationModel } from './app-validators';
import { validateData, typeInteger, typeString } from './app-constant';
export class RequestParam {
  private instituteId: number | null | undefined;
  private userName: string | null | undefined;
  private password: string | null | undefined;
  private koshRegisterId: number | null | undefined;
  private academicConfigId: number | null | undefined;
  private contentTypeId: number | null | undefined;
  private patternAssessmentId: number | null | undefined;
  private link: string | null | undefined;
  private koshAuthenticationId: number | null | undefined;
  private uniqueClassName:string = '';















  public get $uniqueClassName():string{
    return this.uniqueClassName;
  }
  public set $uniqueClassName(uniqueClassName:string){
    this.uniqueClassName = uniqueClassName;
  }
  public constructor() { }



  public getInstituteId(): number | null | undefined {
    return this.instituteId;
  }
  public setInstituteId(instituteId: number): ValidationModel {
    this.instituteId = instituteId;
    const valid = validateData('instituteId', instituteId, typeInteger);
    return valid;
  }
  public getUserName(): string | null | undefined {
    return this.userName;
  }
  public setUserName(userName: string): ValidationModel {
    this.userName = userName;
    const valid = validateData('userName', userName, typeString);
    return valid;
  }
  public getPassword(): string | null | undefined {
    return this.password;
  }
  public setPassword(password: string): ValidationModel {
    this.password = password;
    const valid = validateData('password', password, typeString);
    return valid;
  }
  public getKoshRegisterId(): number | null | undefined {
    return this.koshRegisterId;
  }
  public setKoshRegisterId(koshRegisterId: number): ValidationModel {
    this.koshRegisterId = koshRegisterId;
    const valid = validateData('koshRegisterId', koshRegisterId, typeInteger);
    return valid;
  }
  public getAcademicConfigId(): number | null | undefined {
    return this.academicConfigId;
  }
  public setAcademicConfigId(academicConfigId: number): ValidationModel {
    this.academicConfigId = academicConfigId;
    const valid = validateData('academicConfigId', academicConfigId, typeInteger);
    return valid;
  }
  public getContentTypeId(): number | null | undefined {
    return this.contentTypeId;
  }
  public setContentTypeId(contentTypeId: number): ValidationModel {
    this.contentTypeId = contentTypeId;
    const valid = validateData('contentTypeId', contentTypeId, typeInteger);
    return valid;
  }
  public getPatternAssessmentId(): number | null | undefined {
    return this.patternAssessmentId;
  }
  public setPatternAssessmentId(patternAssessmentId: number): ValidationModel {
    this.patternAssessmentId = patternAssessmentId;
    const valid = validateData('patternAssessmentId', patternAssessmentId, typeInteger);
    return valid;
  }
  public getLink(): string | null | undefined {
    return this.link;
  }
  public setLink(link: string): ValidationModel {
    this.link = link;
    const valid = validateData('link', link, typeString);
    return valid;
  }
  public setKoshAuthenticationId(authId: number): ValidationModel{
    this.koshAuthenticationId = authId;
    const valid = validateData('koshAuthenticationId', authId, typeInteger);
    return valid;
  }
  public getKoshAuthenticationId(): number | null | undefined{
    return this.koshAuthenticationId;
  }


}
