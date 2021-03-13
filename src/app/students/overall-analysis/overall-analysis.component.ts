import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TestDetails } from '../library/interfaces/test-details';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-overall-analysis',
  templateUrl: './overall-analysis.component.html',
  styleUrls: ['./overall-analysis.component.css']
})
export class OverallAnalysisComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['12-06-2019', '13-06-2019', '14-06-2019', '15-06-2019', '16-06-2019', '17-06-2019', ,'18-06-2019','19-06-2019', '30-06-2019', '10-07-2019', '12-07-2019', '17-07-2019', '18-07-2019','19-07-2019', '20-07-2019', '23-07-2019', '25-07-2019', '27-07-2019'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, -80, 81, -56, 55, 40, 24, 12, 40, -19, 86, -27, 90, 28, 24, 28, 60, -39], label: 'Physics' },
    { data: [24, 12, 40, -19, 86, -27, 90, 65, 59, -80, 81, -56, 55, 40, -54, 27, 42, 24, 28], label: 'Chemistry' },
    { data: [24, 28, 60, -39, 81, 27, 18, 24, 12, 40, -19, 86, -27, 90, 70, 39, 46, -57, 28], label: 'Biology' },
    { data: [48, -48, 82, 19, -54, 27, 42, 24, 28, 60, -39, 81, 27, 18, 42, 24, 28, 60, -39], label: 'Mathematics' },
    { data: [28, -92, 70, 39, 46, -57, 28, 24, 28, 60, -39, 81, 27, 18, -80, 81, -56, 55, 40], label: 'PCM' },
    { data: [80, 48, -40, 18, -86, 27, 70, 24, 12, 40, -19, 86, -27, 90, 40, -19, 86, -27, 90], label: 'PCB' }
  ];

  public records: FormControl = new FormControl("ALL", []);
  public allSubject: FormControl = new FormControl("ALL", []);
  public chapter: FormControl = new FormControl("ALL", []);
  public question: FormControl = new FormControl("ALL", []);
  constructor() { }

  ngOnInit() {
  }
  public ascRightOrWrong:boolean = true;
  public ascOrDesc:boolean = true;

  public sortByRightOrWrong() {
    this.ascRightOrWrong = !this.ascRightOrWrong;
    this.ascOrDesc = this.ascRightOrWrong;
  }

  public monthlyRecords:any = [
    "All","July-2019","Jun-2019","May-2019"
  ]
  public subjects:any = [
    "All","Physics","Chemistry","Mathematics","Biology"
  ]
  public chapters:any = [
    "All","Chapter1","Chapter2","Chapter3","Chapter4"
  ]
  public questionType:any = [
    "All","Single",
  ]

  public data: TestDetails[] = [
    {testId: 1, subject: 'Physics', solvedDate: "12-06-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "13-06-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "14-06-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "15-06-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "16-06-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "17-06-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "18-06-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "19-06-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "30-06-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "10-07-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "12-07-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
    {testId: 1, subject: 'Physics', solvedDate: "17-07-2019", percentage: "30",testType:"final",patternName:"JEE",class:"12th"},
  ];
  displayedColumns: string[] = ['testId', 'subject', 'solvedDate', 'percentage','testType','patternName','class'];
  dataSource = this.data;

  public prevData() {}
  public nextData() {}
}
