import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from './commonservice.service';
import {IMyDrpOptions} from 'mydaterangepicker';
import { HeaderdataService } from './headerdata.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dateType: any = "ALL";
  from_date: any = ''; to_date: any = '';
  frompage:any=false;
  model:any;
  // private model: any = {beginDate: {year: 2020, month: 10, day: 9},
  // endDate: {year: 2018, month: 10, day: 19}};
  myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy', width: '200px',
};
  constructor(private HeaderdataService: HeaderdataService, private CommonServiceService: CommonServiceService) {
   

  }
  dashdataObj: any; dashdataObjToday: any;
  working: boolean
  ngOnInit() {

    this.dashboardadata(this.dateType);
    this.dashboardadata("Today");
  }

  dashboardadata(dateTypePased) {

    this.working = true;
     
    this.CommonServiceService.geDahboarddata({ "dateType": dateTypePased, "from_date": this.from_date, "to_date": this.to_date }).subscribe(res => {



      if (dateTypePased == 'Today') {
        this.dashdataObjToday = res;

      } else {
        this.dashdataObj = res;
      }

      if ( this.frompage==true || dateTypePased == 'Today') {

        this.working = false;
      }
      this.frompage=false;

    });
  }
  refresh() {

    this.dashboardadata(this.dateType);
    this.dashboardadata("Today");
  }
  buttonPressedFromPafe(dateTypeFromPage) {
    this.frompage=true;
    this.dateType = dateTypeFromPage;

    this.dashboardadata(this.dateType);
    this.dashboardadata("Today");
  }

  onDateRangeChanged(ev){
    
  this.from_date=ev.beginJsDate;
  this.to_date=ev.endJsDate;

    this.frompage=true;
    this.dateType = "Range";

    this.dashboardadata(this.dateType);
    this.dashboardadata("Today");

  }
}
