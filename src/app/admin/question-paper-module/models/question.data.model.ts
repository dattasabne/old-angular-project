
export interface Record{
  topicName:string;
  total:number;
  singleCorrect:SingleCorrect;
  numerical:Numerical;
  matrix:Matrix;
  reasoning:Reasoning;
  multipleCorrect:MultipleCorrect;
  comprehension:Comprehension;
  subTopics:Record[];
}
export interface SingleCorrect{
  singleTheory:number;
  singleNumber:number;
}
export interface Numerical{
  singleNumber:number;
}
export interface Matrix{
  singleNumber:number;
}
export interface Reasoning{
  singleNumber:number;
}
export interface MultipleCorrect{
  multipleTheory:number;
  multipleNumber:number;
}
export interface Comprehension{
  paragraph:number;
  questions:number;
}

