import { PrintingQuestionPaperDetails } from '../interfaces/question.paper.interface';
import { ClassProfile } from 'src/app/shared/model/class-profile-model';
import { GeneratedTest } from '../search-generated-test/generated-test-model';

export interface PapersetData{
    paperSet:PrintingQuestionPaperDetails,
    testRecord:GeneratedTest,
    classData:ClassProfile;
    teacherCopy:boolean;
    mainPaperSet:boolean;
    isWord:boolean;
    isPdf:boolean;
}
