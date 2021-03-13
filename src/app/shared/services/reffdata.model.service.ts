import { Injectable } from "@angular/core";
import { AppConstant } from '../app-constant/app-constatnt';
@Injectable({
    providedIn:'root'
})
export class RefferenceModel{
    private _patternName: Array<string> = new Array<string>();
    private _classNames: Array<string> = new Array<string>();
    private _academicYearNames: Array<string> = new Array<string>();
    private _subjectNames:SubjectNames = <SubjectNames>{};
    private _courses:Array<string> = new Array<string>();
    private _testTyep: Array<string> = [
        'CHAPTERWISE',
        'SUBJECTWISE',
        'FINAL TEST'
    ];
    public get courser():Array<string>{
      return this._courses;
    }
    public set courses(courses:Array<string>){
      this._courses = courses;
    }

    public get testTyep(): Array<string> {
        return this._testTyep;
    }
    public set testTyep(value: Array<string>) {
        this._testTyep = value;
    }
    public get subjectNames(): SubjectNames{
        return this._subjectNames;
    }
    public set subjectNames(value: SubjectNames) {
        this._subjectNames = value;
    }
    public get academicYearNames(): Array<string> {
        return this._academicYearNames;
    }
    public set academicYearNames(value: Array<string>) {
        this._academicYearNames = value;
    }
    public get classNames(): Array<string> {
        return this._classNames;
    }
    public set classNames(value: Array<string>) {
        this._classNames = value;
    }
    public get patternName(): Array<string> {
        return this._patternName;
    }
    public set patternName(value: Array<string>) {
        this._patternName = value;
    }
    public getSubjectFromPattern(subjectName:string):Array<string>{
        switch(subjectName.toUpperCase()){
            case 'JEE':
                return [this.subjectNames.physics,this.subjectNames.chemistry,this.subjectNames.mathematics,this.subjectNames.pcm];
            case 'NEET':
                return [this.subjectNames.physics,this.subjectNames.chemistry,this.subjectNames.biology,this.subjectNames.pcb];
            case 'JEE_ADVANCED': // confused with this pattern
                return [this.subjectNames.physics, this.subjectNames.chemistry,this.subjectNames.mathematics];
            case 'MHTCET':
                return [this.subjectNames.physics,this.subjectNames.chemistry,this.subjectNames.mathematics,this.subjectNames.biology];

        }
        return [];
    }

    public createNameShortCutt(name:string):string{
      return name.charAt(0).toUpperCase();
    }
    public createSubjectOrder(subjects:string[]):string[]{
      if(!subjects){
        return [];
      }
      let orderedSubject:string[] = [];
      for(let subject of AppConstant.SUBJECT_ORDER){
        for(let mainSub of subjects){
          if(mainSub.startsWith(subject.trim().toUpperCase()) || mainSub.startsWith(subject.trim().toLowerCase())){
              orderedSubject.push(mainSub);
          }
        }
      }
      return orderedSubject;
    }
    public getSubjectFromPatternAndTestType(testTye:string , subjectList:string[]):Array<string>{
      testTye = testTye || "";
      let subjectData:string= "";
      if(testTye.toUpperCase()=="FINAL TEST"){
        for(let subject of subjectList){
          subjectData = subjectData.concat(this.createNameShortCutt(subject));
        }
        let pc:string   = '';
        let pcm:string  = '';
        let pcb:string  = '';
        let pcmb:string = '';
        if(subjectData.length == 4){
          pcmb = subjectData;
          pc  = (pcmb[0].concat(pcmb[1]));
          pcm = pc.concat(pcmb[2]);
          pcb = pc.concat(pcmb[3]);
          return [pcm,pcb,pcmb ];
        }
        return [subjectData];
      }else if(testTye.toUpperCase() == "CHAPTERWISE" || testTye.toUpperCase() == "SUBJECTWISE"){
        return subjectList;
      }else{
        return [];
      }
    }
    public getArrayExceptValue(array:Array<string>, value:string):Array<string>{
        let subject = [];
        for(let item of array){
            if(item.toUpperCase()!= value.toUpperCase()
            && item.toUpperCase()!= 'PCM'.toUpperCase()
            && item.toUpperCase()!= 'PCB'.toUpperCase()){
                subject.push(item);
            }
        }
        return subject;
    }
    public constructor(){
        this.subjectNames.physics = 'PHYSICS';
        this.subjectNames.chemistry = 'CHEMISTRY';
        this.subjectNames.mathematics = 'MATHEMATICS';
        this.subjectNames.biology = 'BIOLOGY';
        this.subjectNames.pcm = 'PCM';
        this.subjectNames.pcb = 'PCB';
        this.subjectNames.pcmb = 'PCMB';
    }
}
export interface SubjectNames{
    physics:string;
    chemistry:string;
    mathematics:string;
    biology:string;
    pcm:string;
    pcb:string;
    pcmb:string;
}
