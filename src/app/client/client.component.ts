

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
import * as xlsx from 'xlsx';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clientdata: any;
  searchform: boolean = false;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  clientdataList: any;
  module: any;
  courses_subcourse_both_list: any;
  private sub: any;
  courses_list: any;
  subcourse_list: any;
  throttle = 300;  // infinescroll
  scrollDistance = 1;  // infinescroll
  scrollUpDistance = 2;  // infinescroll
  limitInOneTime: number = 10;// infinescroll
  skipDocument: number = 0;// infinescroll
  totalRecord: number = 0;// infinescroll
  searchedFunctionClick: boolean = false;// infinescroll
  infinescrollerstatus: boolean = false;//infinescroll

  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  constructor(private route: ActivatedRoute, private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService) {


    this.sub = this.route.params.subscribe(params => {


      this.resetInfineScroll();
      this.clientdataList = undefined;
      this.module = params['module'];
      // this.getClientList();
      this.resetclientdata();
      this.get_courses_subcourse_both();

    });

  }

  ngOnInit() {

  }
  checkifamountkeyExists(objtocheck) {


    if (objtocheck) {
      if ('amount' in objtocheck) {

        if (objtocheck.amount) {
          return true;
        } else {
          return false;
        }
      } else {

        return false;
      }
    } else {

      return false;
    }
  }
  combineURLForEmail: any;

  SendEmail(obj, objC) {

    objC.sending = true;
    this.CommonServiceService.getinvoice_url().subscribe((res) => {
      var email_url = res.email_url;
      var invoice_url = res.invoice_url;

      var pdfurl_sub = res.pdfurl_sub;

      this.getOrderDetails(obj, objC, email_url, invoice_url, pdfurl_sub);

    }, (err) => {
      this.createAlert('Something is wrong', 'warning'); objC.sending = false;
    });
  }
  getOrderDetails(clientdata, coursedata, email_url, invoice_url, pdfurl_sub) {

    this.CommonServiceService.getOrderDetails(clientdata.c_id_int, coursedata.course_id, coursedata.sub_course_id).subscribe(res => {
      if (res) {


        coursedata.order_no = res.order_no;
        this.combineURLForEmail = email_url + "?data=" + clientdata._id + "*" + coursedata.order_no + "*Email";
        this.SendEmailWorking(coursedata);
      } else {
        this.createAlert('Something is wrong ', 'warning');
      }
    });
  }
  SendEmailWorking(objC) {
    this.CommonServiceService.SendEmailWorking(this.combineURLForEmail).subscribe((res) => {
      if (res.mailresponse == 1) {
        this.createAlert('Email sent successfully', 'success');
      } else {
        this.createAlert('Something is wrong ' + res.mailresponse, 'warning');
      }
      objC.sending = false;
    }, (err) => {
      this.createAlert('Something is wrong ' + err, 'warning'); objC.sending = false;
    });
  }
  get_courses_subcourse_both() {
    this.CommonServiceService.get_courses_subcourse_both().subscribe(res => {
      this.courses_subcourse_both_list = res;
      var courses_list = [];
      this.courses_subcourse_both_list.forEach(function (value) {
        if (value.parent_course == 0) {
          courses_list.push(value);
        }

      });
      this.courses_list = courses_list;
    });
  }
  getCourse_name(course_or_sub_course_id, coursetype) {

    for (let y = 0; y < this.courses_subcourse_both_list.length; y++) {
      if (course_or_sub_course_id == this.courses_subcourse_both_list[y]['_id']) {
        return this.courses_subcourse_both_list[y]['course_name'];
      }
    }

  }
  getSubcourseByIdOfCourse() {
    this.clientdata.sub_course_id = "";
    this.subcourse_list = [];
    var subcourse_list = [];
    var course_id = this.clientdata.course_id;
    this.courses_subcourse_both_list.forEach(function (value) {
      if (value.parent_course == course_id) {
        subcourse_list.push(value);
      }

    });
    this.subcourse_list = subcourse_list;
  }
  getClientList() {
    this.CommonServiceService.getClientList(this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
      if (this.clientdataList && this.clientdataList.length > 0) {
        this.clientdataList = this.clientdataList.concat(res.clientList);
      } else {
        this.clientdataList = res.clientList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;
      this.scrollToDataDiv();
    });
  }

  resetclientdata() {
    this.resetclientdatajust();
    this.searchclient('startagain');
  }
  resetclientdatajust() {
    if (this.module == 'Client') {
      this.clientdata = { final_status: "", client_added_by: "", from_certificate_issued: "", to_certificate_issued: "", duration: '', certificate_issued: '', course_status: '', first_name: '', last_name: '', sub_course_id: "", from_reg_date: "", to_reg_date: "",from_order_date: "",coupon: "", to_order_date: "", course_id: "", customer_id: "", email: '', mobile: '', alternate_mobile: '' };

    } else if (this.module == 'Issue') {
      this.clientdata = { final_status: "Pass", client_added_by: "", from_certificate_issued: "", to_certificate_issued: "", duration: '', certificate_issued: 'NO', course_status: 'Completed', first_name: '', last_name: '', sub_course_id: "", from_reg_date: "", to_reg_date: "",from_order_date: "",coupon: "",  to_order_date: "", course_id: "", customer_id: "", email: '', mobile: '', alternate_mobile: '' };

    } else if (this.module == 'Issued') {
      this.clientdata = { final_status: "Pass", client_added_by: "", from_certificate_issued: "", to_certificate_issued: "", duration: '', certificate_issued: 'YES', course_status: 'Completed', first_name: '', last_name: '', sub_course_id: "", from_reg_date: "", to_reg_date: "", from_order_date: "",coupon: "",  to_order_date: "",course_id: "", customer_id: "", email: '', mobile: '', alternate_mobile: '' };

    }

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
      this.searchclient('extend');
    } else {
      this.getClientList();
    }

  }

  scrollToDataDiv() {

    let el = (<HTMLInputElement>document.getElementById('datadiv'));

    el.scrollIntoView();
  }
  issue_unissue(clientObj, courseindex, action) {

    clientObj.course[courseindex].issueingAction = true;
    this.CommonServiceService.issue_unissue(clientObj._id, courseindex, action).subscribe(res => {

      clientObj.course[courseindex].issueingAction = false;
      if (res.status == 'SUCCESS') {
        this.HeaderdataService.settoaster(res.message, 'success');
        clientObj.course[courseindex].certificate_issued = action;
        if (action == 'YES') {
          clientObj.course[courseindex].certificate_issued_date = new Date();
        }

      } else {

        this.HeaderdataService.settoaster(res.message, 'danger');
      }

    });
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


  searchclient(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;
    var filledFound_search = false;
    if (this.clientdata.first_name !== '' && this.clientdata.first_name !== undefined) {


      filledFound_search = true;
    }
    if (this.clientdata.last_name !== '' && this.clientdata.last_name !== undefined) {
      filledFound_search = true;
    }
    if (this.clientdata.customer_id !== '' && this.clientdata.customer_id !== undefined) {
      filledFound_search = true;
    }

    if (this.clientdata.email !== '' && this.clientdata.email !== undefined) {
      filledFound_search = true;
    }
    if (this.clientdata.mobile !== '' && this.clientdata.mobile !== undefined) {
      filledFound_search = true;
    }
    if (this.clientdata.alternate_mobile !== '' && this.clientdata.alternate_mobile !== undefined) {
      filledFound_search = true;
    }

    if (this.clientdata.course_id !== '' && this.clientdata.course_id !== undefined) {
      filledFound_search = true;
    }


    if (this.clientdata.sub_course_id !== '' && this.clientdata.sub_course_id !== undefined) {
      filledFound_search = true;
    }


    if (this.clientdata.from_reg_date !== '' && this.clientdata.from_reg_date !== undefined) {
      filledFound_search = true;
    }


    if (this.clientdata.to_reg_date !== '' && this.clientdata.to_reg_date !== undefined) {
      filledFound_search = true;
    }
     
    if (this.clientdata.from_order_date !== '' && this.clientdata.from_order_date !== undefined) {
      filledFound_search = true;
    }


    if (this.clientdata.to_order_date !== '' && this.clientdata.to_order_date !== undefined) {
      filledFound_search = true;
    }

    if (this.clientdata.duration !== '' && this.clientdata.duration !== undefined) {

      if (this.clientdata.duration !== '' && this.clientdata.duration !== undefined) {
        filledFound_search = true;
        this.clientdata.duration = +this.clientdata.duration;
        if (Number.isInteger(this.clientdata.duration)) {


        } else {
          this.createAlert('Duration must be integer', 'warning');
          return false;
        }
      }
    }
    if (this.clientdata.certificate_issued !== '' && this.clientdata.certificate_issued !== undefined) {
      filledFound_search = true;
    }
    if (this.clientdata.course_status !== '' && this.clientdata.course_status !== undefined) {
      filledFound_search = true;
    }
    if (this.clientdata.final_status !== '' && this.clientdata.final_status !== undefined) {
      filledFound_search = true;
    }


    if (this.clientdata.from_certificate_issued !== '' && this.clientdata.from_certificate_issued !== undefined) {
      filledFound_search = true;
    }
    if (this.clientdata.to_certificate_issued !== '' && this.clientdata.to_certificate_issued !== undefined) {
      filledFound_search = true;
    }
    if (filledFound_search == false) {
      //  this.createAlert('Fill at least one search parameter', 'warning');
      // return false;
    }
    this.searchaction = true;
    if (startagainAction == 'startagain') { // infinescroll
      this.clientdataList = undefined;
      this.resetInfineScroll();
    }

    if (this.forexcel) {
      var limitInOneTime = 100000000000;
    } else {
      var limitInOneTime = this.limitInOneTime;
    }

    this.CommonServiceService.searchClients(this.clientdata, limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.clientdataList && this.clientdataList.length > 0) {
        this.clientdataList = this.clientdataList.concat(res.clientList);
      } else {
        this.clientdataList = res.clientList;
      }


      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + limitInOneTime;

      if (this.forexcel) {
        this.getOrderList();
      }


    });

  }
  orderlist: any=[];
  forexcel: boolean = false; clientdataListForExcel: any = [];
  exportToExcel() {
    this.searchaction = true;
    this.forexcel = true;
    this.searchclient('extend');
  }

  getOrderList() {
    var clientdatc_id_int_array = [];
    for (var t = 0; t < this.clientdataList.length; t++) {
      clientdatc_id_int_array.push(this.clientdataList[t].c_id_int);
    }
    if (clientdatc_id_int_array.length > 0) {


      this.CommonServiceService.getOrderListOfSelectedClient(clientdatc_id_int_array).subscribe(res => {
     
        this.orderlist = res;
        this.makeListForexcel();

      });
    } else {
      alert("No data to export");
    }
  }
  exportToExcelWorking() {

    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'clientList.xlsx');
    this.searchaction = false; this.forexcel = false;
  }

  makeListForexcel() {
    this.clientdataListForExcel = [];
    for (var t = 0; t < this.clientdataList.length; t++) {
      var obj = this.clientdataList[t];
      if (obj.course.length > 0) {
        for (var x = 0; x < obj.course.length; x++) {
          var courseOBJ = obj.course[x];
          var orderOBJ = obj.orders[x];
          var discount = 0; var amount = 0; var paid_amount = 0;
          var trnsaction_id='';
          for (var y = 0; y < this.orderlist.length; y++) {
            if (this.orderlist[y].order_no == orderOBJ.order_no) {
              discount = this.orderlist[y].discount; amount = this.orderlist[y].amount; paid_amount = this.orderlist[y].paid_amount;
              trnsaction_id= this.orderlist[y].bank_array[0].TXNID;
            }
          }

          var objSave = {
            "customer_id": obj.customer_id, "name": obj.first_name + " " + obj.last_name, "email": obj.email, "mobile": obj.mobile, "created_on": obj.created_on,
            "sub_course_id": courseOBJ.sub_course_id,
            "course_id": courseOBJ.course_id,
            "order_no": orderOBJ.order_no,
            "order_date": orderOBJ.order_date,
            "amount": amount,
            "paid_amount": paid_amount, "discount": discount,"trnsaction_id":trnsaction_id

          };
          this.clientdataListForExcel.push(objSave);
        }
      } else {
        var objSave1 = {
          "customer_id": obj.customer_id, "name": obj.first_name + " " + obj.last_name, "email": obj.email, "mobile": obj.mobile, "created_on": obj.created_on,
          
          
          "order_no": "",
          "order_date": "",
          "amount": 0,
          "paid_amount": 0, "discount": 0,"trnsaction_id":''

        };
        this.clientdataListForExcel.push(objSave1);
      }


    }
    this.clientdataListForExcel;
    this.exportToExcelWorking();
  }
  deleteclient(obj, index) {
    if (confirm('Are you sure you want to delete this client !')) {

      this.CommonServiceService.deleteClient(obj).subscribe(res => {


        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster("client " + obj.first_name + " deleted successfully !", 'success');
          this.clientdataList.splice(index, 1);
          this.totalRecord = this.totalRecord - 1; // infinescroll
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });

    }
  }


}
