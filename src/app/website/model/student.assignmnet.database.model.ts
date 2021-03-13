export interface CreateAssignmentModel{
   assignments:StudentAssignmentDataBaseModel[];
   testBranches:TestBranchId[];
   testCreatedJSON:string;
   uniqueClassName:string;
   testId:string;
   allBranchId:string;
   batch:string;
   scheduleUpdate:boolean;
}
export interface TestBranchId{
  id:string;
	branch:string;
	branchID:string;
	allBranchID:string;
	uniqueclassname:string;
	academicYear:string;
	batchMasterId:string;
	childId:string;
	course:string;
}

export interface StudentAssignmentDataBaseModel{
  id:number;
  batchMasterId:number;
  testId:number;
  batch:string;
  course:string;
  branch:string;
  division:string;
  subDivision:string;
  assignmentType:string;
  assignmentDate:string;
  assignmentTime:string;
  percentage:string;
  timeSpent:string;
  testDescription:string;
  assignmentPracticeLevel:number;
  subjectName:string;
  uniqueClassName:string;
  solutionDate:string;
  solutionTime:string;
  dateTimeStamp:string;
  patternName:string;
  // ---------------------- new parameter from here ----------------------
  isShuffle:boolean;
  isReAttempt:boolean;
  availableTillDuration:string;
  availableTillDate:string;
  availableTillTime:string;
  solutionReleaseDuration:string;
  testAutoSubmitDuration:string;
  testAutoSubmitDate:string;
  testAutoSubmitTime:string;
  onlineId:string;
  allBranchId:string;
}
