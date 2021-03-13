export interface GenerateTable {
    chapterNames:string;
    availableQuestion?:string;
    requiredQuestion?:string;
    total?:string;
    subTopic?:string;
    isChecked?:boolean;
}

export interface Chapters {
    chapterName:string;
    availableQuestion?:number;
    requiredQuestion?:number;
    total?:number;
    subTopics:Array<Subtopic>;
    isChecked:boolean;
}

export interface Subtopic {
    subTopicName:string;
    isChecked:boolean
}

export interface ManualGenereteHeader {
    SrNo:string;
    pattern:string;
    testId:string;
    chapterName:string;
    chapterId:string;
    questions:string;
    reapeted?:string;
    notAvailable?:string;
}
export interface ManualGenerate {
    SrNo:number;
    pattern:string;
    testId:number;
    chapterName:string;
    chapterId:string;
    questions:number;
    reapeted?:string;
    notAvailable?:string;
}
