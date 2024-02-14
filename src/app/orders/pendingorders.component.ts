





import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-pendingorders',
  templateUrl: './pendingorders.component.html',
  styleUrls: ['./pendingorders.component.css']
})
export class PendingordersComponent implements OnInit {

  searchaction: boolean; searchaction1: boolean;
  orderlist: any;
  orderlistPending: any;
  constructor(private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService) {

  }
  scrollToDataDiv() {

    // let el = (<HTMLInputElement>document.getElementById('datadiv'));

    // el.scrollIntoView();
  }
  ngOnInit() {
    this.CommonServiceService.getCourseList();

    this.getPendingOrderist();
    this.getNonPendingOrderist();
  }

  getNonPendingOrderist() {
    this.searchaction1 = true;
    this.CommonServiceService.getNonPendingOrderist().subscribe(res => {
      this.searchaction1 = false;
      this.scrollToDataDiv();

      console.log(res);

      this.orderlist = res;

    });
  }

  getPendingOrderist() {
    this.searchaction1 = true;
    this.CommonServiceService.getPendingOrderist().subscribe(res => {
      this.searchaction1 = false;
      this.scrollToDataDiv();

      console.log(res);

      this.orderlistPending = res;

    });
  }
  //run_check_payment_status_in_backened
  checkStatusAgain(orderNo) {
    this.searchaction = true;
    this.CommonServiceService.checkStatusAgainOfOrder(orderNo).subscribe(res => {




      if (res.status == 'ERROR') {
        this.searchaction = false;
        this.HeaderdataService.settoaster(res.message, 'danger');


      } else {
        this.HeaderdataService.settoaster(res.message, 'success');
        if (res.status == 'SUCCESS') {
          this.run_check_payment_status_in_backened(orderNo);
        } else {
          this.searchaction = false;
        }
      }

    });
  }
  run_check_payment_status_in_backened(orderNo) {
    this.CommonServiceService.run_check_payment_status_in_backened(orderNo).subscribe(res => {
      setTimeout(() => {
        this.HeaderdataService.settoaster(res, 'warning');
        this.searchaction = false;
      }, 1000);





    });
  }

  onScrollDown(ev) {   // infinescroll
    console.log('scrolled down!!', ev);



  }

  onUp(ev) { // infinescroll
    console.log('scrolled up!', ev);

  }









}

