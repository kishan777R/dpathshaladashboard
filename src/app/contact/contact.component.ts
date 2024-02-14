


import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactdata: any;
  message: string; searchform: boolean = false;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  contactlist: any;
  modalObjData: any = {};

  subcourseList: any;
  throttle = 300;  // infinescroll
  scrollDistance = 1;  // infinescroll
  scrollUpDistance = 2;  // infinescroll
  limitInOneTime: number = 10;// infinescroll
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
    this.CommonServiceService.getCourseList();

    this.getContactList();
    this.resetcontatcdata();

  }

  openModal(qObj, myModal) {

    this.modalObjData = qObj;
    console.log(this.modalObjData.question);
    myModal.style.display = "block";
  }
  closemodal(myModal) {

    myModal.style.display = "none";

  }
  getContactList() {
    this.CommonServiceService.getContactList(this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
      this.scrollToDataDiv();
      if (this.contactlist && this.contactlist.length > 0) {
        this.contactlist = this.contactlist.concat(res.contactlist);
      } else {
        this.contactlist = res.contactlist;
      }
      this.totalRecord = res.totalRecord;

      this.skipDocument = this.skipDocument + this.limitInOneTime;

    });
  }

  resetcontatcdata() {
    this.contactdata = { first_name: '', last_name: '', mobile: "", email: '', subject: "", message: '', from_contact_date: "", to_contact_date: "" };
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
      this.searchContact('extend');
    } else {
      this.getContactList();
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
  searchContact(startagainAction) {
  
      this.reset();
      this.searchedFunctionClick = true;
      var filledFound_search = false;
  
      if (this.contactdata.first_name !== '' && this.contactdata.first_name !== undefined) {
  
  
        filledFound_search = true;
      }
  
  
      if (this.contactdata.last_name !== '' && this.contactdata.last_name !== undefined) {
        filledFound_search = true;
  
  
      }
     
     
      if (this.contactdata.from_contact_date !== '' && this.contactdata.from_contact_date !== undefined) {
        filledFound_search = true;
      }
  
  
      if (this.contactdata.to_contact_date !== '' && this.contactdata.to_contact_date !== undefined) {
        filledFound_search = true;
  
      }
      if (this.contactdata.mobile !== '' && this.contactdata.mobile !== undefined) {
        filledFound_search = true;
  
      }
      if (this.contactdata.email !== '' && this.contactdata.email !== undefined) {
        filledFound_search = true;
      }
  
      if (this.contactdata.subject !== '' && this.contactdata.subject !== undefined) {
        filledFound_search = true;
  
      }
      if (this.contactdata.message !== '' && this.contactdata.message !== undefined) {
        filledFound_search = true;
      }
      
      
      this.contactdata.mobile =+this.contactdata.mobile ;
  
      if (filledFound_search == false) {
        //  this.createAlert('Fill at least one search parameter', 'warning');
        // return false;
      }
      this.searchaction = true;
      if (startagainAction == 'startagain') { // infinescroll
        this.contactlist = undefined;
        this.resetInfineScroll();
      }
  
  
  
      this.CommonServiceService.searchContact(this.contactdata, this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
        this.searchaction = false;
        if (startagainAction == 'startagain') { // infinescroll
          this.scrollToDataDiv();
        }
        this.infinescrollerstatus = false; //infinescroll
        if (this.contactlist && this.contactlist.length > 0) {
          this.contactlist = this.contactlist.concat(res.contactlist);
        } else {
          this.contactlist = res.contactlist;
        }
        this.totalRecord = res.totalRecord;
        this.skipDocument = this.skipDocument + this.limitInOneTime;
  
  
  
  
      });
  
    }







}

