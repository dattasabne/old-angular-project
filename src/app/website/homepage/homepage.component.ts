import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogModel } from 'src/app/app-models/mat.dialog.model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit , AfterViewInit , OnDestroy {
  constructor() { }
  ngOnInit(): void {

  }
  ngAfterViewInit(): void{}
  ngOnDestroy(): void{}

}
