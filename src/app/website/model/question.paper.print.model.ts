import { SubjectIdModel } from './../../admin/question-paper-module/models/subject.id.model';
import { MockMediaQueryList } from "@angular/flex-layout/core/typings/match-media";

export class QuestionPaperPrintModel{
    public fileName:string = '';
    public file:File = null;
    public fileMessage:string = '';
    public uploadedFiles:File[] = [];
    public academicYear:string = '';
    public pattern:string = '';
    public className:string = '';
    public testType:string = '';
    public subjects:string[] = [];
    public removeAndAddInputFile:boolean = true;
    public selectedPaperIds:SubjectIdModel[] = [];
    public paperIdString:string = '';
    public allChapterIds:SubjectIdModel[] = [];
    public tabSubjectIds:SubjectIdModel[] = [];
    public constructor(){}
}




