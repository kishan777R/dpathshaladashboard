

import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from './commonservice.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-addnotification',
  templateUrl: './addnotification.component.html',
  styleUrls: ['./addnotification.component.css']
})
export class AddnotificationComponent implements OnInit {
  notificationdata: any;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  editingid: number = 0;
  saveaction: boolean;

  private sub: any;
  subcourseList: any;
  checkboxModel: boolean = false;
  fileUpload = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };
  profileForm: FormGroup;

  constructor(private router: Router, private CommonServiceService: CommonServiceService, private route: ActivatedRoute, private fb: FormBuilder) {



    this.sub = this.route.params.subscribe(params => {
      this.editingid = params['nid']; // (+) converts string 'id' to a number

      if (this.editingid == 0) {
        this.resetnotificationdata();
      } else {

        this.CommonServiceService.getNotifications_byid(this.editingid).subscribe(res => {

          this.notificationdata = res;
          if (this.notificationdata.c_id_int == -1) {
            this.checkboxModel = true;
          } else {

          }

        });

      }
    });


  }
  clientdataList: any = [];
  ngOnInit() {
    this.getClientList();
  }

  updateACIDINT() {
    if (!this.checkboxModel) {
      this.notificationdata.c_id_int = -1;
    } else {
      this.notificationdata.c_id_int = "";
    }

  }
  onchangeCientWhenEditing() {
    if (this.notificationdata.c_id_int != "") {
      this.checkboxModel = false;
    }
  }
  getClientList() {
    this.CommonServiceService.getClientList(500000, 0, 1).subscribe(res => {
      this.clientdataList = [];
      for (var f = 0; f < res.clientList.length; f++) {

         
        if (res.clientList[f].first_name  ) {
          if (res.clientList[f].customer_id_int > 0) {

          } else {
            res.clientList[f].customer_id = "Not paid till now";
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
          this.checkboxModel = false;
        }
      }
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }



  reset() {
    this.message = '';
    this.messageClass = '';
    this.messageClassIcon = '';
    this.saveaction = false;

  }
  resetnotificationdata() {

    this.notificationdata = { id: this.editingid, message: '', to_be_sent_on: '', c_id_int: '', send_after_hour: '' };
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



  saveNotification() {

    this.reset();

    if (this.notificationdata.message == '' || this.notificationdata.message == undefined) {


      this.createAlert('Please fill message field', 'warning');
      return false;
    }

    if (this.notificationdata.c_id_int == '' || this.notificationdata.c_id_int == undefined) {


      this.createAlert('Please fill client field ', 'warning');
      return false;
    }
    if (this.notificationdata.send_after_hour == '' || this.notificationdata.send_after_hour == undefined) {


      this.createAlert('Please fill send after hour field', 'warning');
      return false;
    }

    if (this.notificationdata.send_after_hour !== '' && this.notificationdata.send_after_hour !== undefined) {

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

    this.saveaction = true;
    this.CommonServiceService.saveNotifications(this.notificationdata, this.editingid).subscribe(res => {
      this.saveaction = false;

      if (res.status == 'ERROR') {


        this.createAlert(res.message, 'warning');

      } else {
        this.createAlert(res.message, 'success');
        if (this.editingid == 0) {
          this.resetnotificationdata();
        } else {

        }


      }


    });

  }
}
