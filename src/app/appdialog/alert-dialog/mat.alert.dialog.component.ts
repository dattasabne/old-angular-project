import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModel } from './../../app-models/mat.dialog.model';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';



@Component({
  selector: 'app-matalert-dialog',
  templateUrl: './mat.alert.dialog.component.html',
  styleUrls: ['./mat.alert.dialog.component.css']
})
export class MatAlertDialogComponent implements OnInit ,  AfterViewInit , OnDestroy{
  public constructor(@Inject(MAT_DIALOG_DATA) public data: MatDialogModel){}
  ngOnInit(): void{}
  ngAfterViewInit(): void{}
  ngOnDestroy(): void{}

}
