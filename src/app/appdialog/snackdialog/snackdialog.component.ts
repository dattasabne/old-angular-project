import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snackdialog',
  templateUrl: './snackdialog.component.html',
  styleUrls: ['./snackdialog.component.css']
})
export class SnackdialogComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

}
