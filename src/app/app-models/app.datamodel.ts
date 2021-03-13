import { Type } from '@angular/core';

export interface CommonDataInterface {
	id: number;
	createdBy: string;
	modifyBy: string;
	dateTimeStamp: string;
	modifyDateTimeStamp: string;
}
export interface HttpResponseModel<T> {
	data: T;
	result: boolean;
	message: string;
}

export interface AcademicConfig extends CommonDataInterface {
	parentIdFk: number;
	koshRegisterIdFk: number;
	databaseConfigIdFk: number;
	contentSourceFkId: number;
	contentFilterIdFk: number;
	label: string;
	value: string;
	databaseName: string;
	tableName: string;
	separateDatabase: boolean;
	separateTable: boolean;
	separateSource: boolean;
	contentFilterSeparate: boolean;
	children: AcademicConfig[];
}
export interface ContentFilterMaster extends CommonDataInterface {
	filterName: string;
	createdBy: string;
	modifyBy: string;
	dateTimeStamp: string;
	modifyDateTimeStamp: string;
	academicConfigIdFk: number;
}
export interface ContentSourceMaster extends CommonDataInterface {
	id: number;
	sourceName: string;
	sourceDisplayName: string;
	academicConfigIdFk: number;
}
export interface ContentTypeMaster extends CommonDataInterface {
	contentTypeIdFk: number;
	contentType: string;
}
export interface DatabaseConfiguration extends CommonDataInterface {
	hostName: string;
	hostPortNumber: number;
	hostUserName: string;
	hostPassword: string;
	hostServerType: string;
	koshRegisterIdFk: number;
}
export interface KoshAuthentication extends CommonDataInterface {
	userName: string;
	password: string;
	KoshRegister: KoshRegister;
	profiles: UserProfile[];
}
export interface KoshRegister extends CommonDataInterface {
	uniqueClassName: string;
	hostName: string;
	hostPortNumber: number;
	hostUserName: string;
	hostPassword: string;
	hostServerType: string;
}
export interface PatternChapters extends CommonDataInterface {
	patternAssessmentIdFk: number;
	chapterName: string;
}
export interface SocialMedia extends CommonDataInterface {
	koshAuthenticationIdFk: number;
	socialMediaName: string;
	socialMediaAccountName: string;
}
export interface UserProfile extends CommonDataInterface {
	koshAuthenticationIdFk: number;
	mobileNumber: string;
	mobileVarified: boolean;
	emailId: string;
	emailVarified: boolean;
	profilePicture: string;
	link: string;
}
export interface SideBarMenu{
	index?: number;
	name?: string;
	description?: string;
	children?: SideBarMenu[];
	component?: Type<any>;
}
export interface PatternModel extends CommonDataInterface{
	id: number;
	patternParentIdFk: number;
	koshAuthenticationFkId: number;
	academicConfigIdFk: number;
	label: string;
	koshAuth: KoshAuthentication;
	acdConfig: AcademicConfig;
  showChild:boolean;
  children: PatternModel[];
  selected:boolean;
}
export class CommonData{
	public data?: any;
}

