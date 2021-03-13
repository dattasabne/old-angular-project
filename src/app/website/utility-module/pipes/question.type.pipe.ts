import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name:'questionType'
})
export class QuestionTypePipe implements PipeTransform{
  public constructor(){}
  public transform(input:string){

    let number:number = 0 ;
    try{
      number = Number(input);
    }catch(ex){
      number = 0 ;
    }
    let questionType:string = "";
    switch(number){
      case 1:
              questionType = `${number} [Single Correct Option]`;
              break;
      case 2:
              questionType = `${number} [Multiple Correct Options]`;
              break;
      case 3:
              questionType = `${number} [Reasoning]`;
              break;
      case 4:
              questionType = `${number} [Matrix Match]`;
              break;
      case 5:
              questionType = `${number} [Comprehension]`;
              break;
      case 6:
              questionType = `${number} [Numerical Value Answer]`;
              break;
      default:
              questionType = `${input} [invalid type]`;
    }
    return questionType;
  }
}
