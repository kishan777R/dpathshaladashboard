import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from './commonservice.service';
import { HeaderdataService } from './headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notificationdata: any;
  message: string;
  searchform: boolean = false;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  notificationdataList: any;
  modalObjData: any = {};
  clientdataList: any = [];

  subcourseList: any;
  throttle = 300;  // infinescroll
  scrollDistance = 1;  // infinescroll
  scrollUpDistance = 2;  // infinescroll
  limitInOneTime: number = 50;// infinescroll
  skipDocument: number = 0;// infinescroll
  totalRecord: number = 0;// infinescroll
  searchedFunctionClick: boolean = false;// infinescroll
  infinescrollerstatus: boolean = false;//infinescroll
  constructor(private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService) {

  }
  scrollToDataDiv() {

    let el = (<HTMLInputElement>document.getElementById('datadiv'));

    el.scrollIntoView();
  }
  ngOnInit() {

    this.getClientList();
    this.getNotificationsList();
    this.resetnotificationdata();

  }
  getClientList() {
    this.CommonServiceService.getClientList(500000, 0, 1).subscribe(res => {
      this.clientdataList = [];
      for (var f = 0; f < res.clientList.length; f++) {
        if (res.clientList[f].first_name) {
        if (res.clientList[f].customer_id_int > 0) {
          
        }else{
          res.clientList[f].customer_id="Not paid till now";
        }
        this.clientdataList.push(res.clientList[f]);
      }
      }
      for (let y = 0; y < this.clientdataList.length; y++) {
        var matchstr = this.clientdataList[y]['first_name'] + " " + this.clientdataList[y]['last_name'] + " (" + this.clientdataList[y]['customer_id'] + ")";

        this.clientdataList[y]['matchstr'] = matchstr;
      }
    });
  }
  onSortChange(e) {
    if (e.target.value !== '') {
      for (let y = 0; y < this.clientdataList.length; y++) {
        if (e.target.value == this.clientdataList[y]['matchstr']) {
          this.notificationdata.c_id_int = this.clientdataList[y]['c_id_int'];

        }
      }
    }
  }
  openModal(qObj, myModal) {

    this.modalObjData = qObj;
     
    myModal.style.display = "block";
  }
  closemodal(myModal) {

    myModal.style.display = "none";

  }
  getNotificationsList() {
    this.CommonServiceService.getNotificationsList(this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
      this.scrollToDataDiv();

      
 


      if (this.notificationdataList && this.notificationdataList.length > 0) {
        this.notificationdataList = this.notificationdataList.concat(res.notificationList);
      } else {
        this.notificationdataList = res.notificationList;
      }
      this.totalRecord = res.totalRecord;

      this.skipDocument = this.skipDocument + this.limitInOneTime;

    });
  }

  resetnotificationdata() {
    this.notificationdata = { message: '', from_to_be_sent_on: '', generated_type: "", sent_status: "", seen_status: '', to_to_be_sent_on: '', send_after_hour: '', c_id_int: "" };
  }
  resetInfineScroll() { // infinescroll
    this.limitInOneTime = 10;
    this.skipDocument = 0;
    this.totalRecord = 0;
  }
  onScrollDown(ev) {   // infinescroll
    console.log('scrolled down!!', ev);

    this.infinescrollerstatus = true; //infinescroll
    if (this.searchedFunctionClick) {
      this.searchNotification('extend');
    } else {
      this.getNotificationsList();
    }

  }

  onUp(ev) { // infinescroll
    console.log('scrolled up!', ev);

  }
  createAlert(message, action) {
    if (action == 'success') {
      this.message = message;
      this.messageClass = 'success';
      this.messageClassIcon = 'check-circle';
    } else if (action == 'warning') {
      this.message = message;
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    }
  }

  reset() {
    this.message = '';
    this.messageClass = '';
    this.messageClassIcon = '';
    this.searchaction = false;
  }


  searchNotification(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;
    var filledFound_search = false;


    if (this.notificationdata.message !== '' && this.notificationdata.message !== undefined) {


      filledFound_search = true;
    }
    if (this.notificationdata.c_id_int !== '' && this.notificationdata.c_id_int !== undefined) {
      filledFound_search = true;
    }
    if (this.notificationdata.to_to_be_sent_on !== '' && this.notificationdata.to_to_be_sent_on !== undefined) {
      filledFound_search = true;
    }
    if (this.notificationdata.from_to_be_sent_on !== '' && this.notificationdata.from_to_be_sent_on !== undefined) {
      filledFound_search = true;
    }



    if (this.notificationdata.seen_status !== '' && this.notificationdata.seen_status !== undefined) {
      filledFound_search = true;
    }


    if (this.notificationdata.sent_status !== '' && this.notificationdata.sent_status !== undefined) {
      filledFound_search = true;
    }



    if (this.notificationdata.send_after_hour !== '' && this.notificationdata.send_after_hour !== undefined) {
      filledFound_search = true;
      this.notificationdata.send_after_hour = +this.notificationdata.send_after_hour;
      if (Number.isNaN(this.notificationdata.send_after_hour)) {
        this.createAlert('Notification send after hour must be a number ', 'warning');
        return false;

      } else {


        if (this.notificationdata.send_after_hour < 1) {


          this.createAlert('Notification send after hour must be more than 0', 'warning');
          return false;
        }
        else if (this.notificationdata.send_after_hour > 23) {


          this.createAlert('Notification send after hour must be less than 23', 'warning');
          return false;
        }
      }
    }



    if (filledFound_search == false) {
      //  this.createAlert('Fill at least one search parameter', 'warning');
      // return false;
    }
    this.searchaction = true;
    if (startagainAction == 'startagain') { // infinescroll
      this.notificationdataList = undefined;
      this.resetInfineScroll();
    }



    this.CommonServiceService.searchNotifications(this.notificationdata, this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.notificationdataList && this.notificationdataList.length > 0) {
        this.notificationdataList = this.notificationdataList.concat(res.notificationList);
      } else {
        this.notificationdataList = res.notificationList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;




    });

  }
  getClientname(c_id) {
    for (let y = 0; y < this.clientdataList.length; y++) {
      if (c_id == this.clientdataList[y]['c_id_int']) {
        return this.clientdataList[y]['matchstr'];
      }
    }
  }

  deleteNotification(obj, index) {
    if (confirm('Are you sure you want to delete this notification !')) {

      this.CommonServiceService.deleteNotification(obj).subscribe(res => {


        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster("Notification " + obj.notification + " deleted successfully !", 'success');
          this.notificationdataList.splice(index, 1);
          this.totalRecord = this.totalRecord - 1; // infinescroll
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });

    }
  }


}

