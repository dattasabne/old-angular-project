import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MatCheckboxChange } from "@angular/material";
import { Question } from "../../library/interfaces/question-interface";
@Component({
    selector:'matrix-option',
    templateUrl:'./matrix-option.html',
    styleUrls:['./matrix-option.css']
})
export class MatrixOption implements OnInit , AfterViewInit{
    public constructor(){}
    ngAfterViewInit():void{
    }
    public row:Array<string> = new Array<string>();
    public column:Array<string> = new Array<string>();
    public matrix = {rows:[],colums:[],matrix:[],answers:[]};
    public matrixArray = [];
      ngOnInit():void{

        this.matrix.rows = ["a","b","c"];
        this.matrix.colums =  ["A","B","C","D"];

        this.matrix.rows.forEach(row=>{
            let eachRow = [];
            this.matrix.colums.forEach(column=>{
                let option = {
                    row:row,
                    column:column,
                    value:row+""+column,
                    isChecked:false
                };
                eachRow.push(option);
            });
            this.matrix.matrix.push(eachRow);
        });     
        this.matrixArray.push(this.matrix);
        this.matrix = {rows:[],colums:[],matrix:[],answers:[]};
        



        this.matrix.rows = ["1","2","3","4","5"];
        this.matrix.colums =  ["A","B","C","D","E"];


        this.matrix.rows.forEach(row=>{
            let eachRow = [];
            this.matrix.colums.forEach(column=>{
                let option = {
                    row:row,
                    column:column,
                    value:row+""+column,
                    isChecked:false
                };
                eachRow.push(option);
            });
            this.matrix.matrix.push(eachRow);
        });
        this.matrixArray.push(this.matrix);
        this.matrix = this.matrixArray[0];
    }
    public matrixAnswers = [];

    public matrixCheckBox(checkBox:MatCheckboxChange,option:any):void{
        if(checkBox.checked){
            this.matrix.answers.push(checkBox.source.value);
        }else{
            let index = this.matrix.answers.indexOf(checkBox.source.value);
            if(index!=-1){
                this.matrix.answers.splice(index,1);
            }
        }
        option.isChecked  = checkBox.checked;
        console.log(this.matrix.answers);
    }

    
    public matrixOptions:Array<Array<string>> = new Array<Array<string>>();
    public next(){
        this.matrix = this.matrixArray[1];
    }
    public back(){
        this.matrix = this.matrixArray[0];
    }
}
