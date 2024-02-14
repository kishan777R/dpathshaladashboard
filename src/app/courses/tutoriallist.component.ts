

import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-tutoriallist',
  templateUrl: './tutoriallist.component.html',
  styleUrls: ['./tutoriallist.component.css']
})
export class TutoriallistComponent implements OnInit {
  questiondata: any;
  message: string; searchform: boolean = true;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  tutdataList: any;
  modalObjData: any = {};
  courseListforthisModule: any = [];

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
    this.getCourseList();
    this.CommonServiceService.getSubCourseList();
    this.getTutList();
    this.resetquestiondata();

  }
  getCourseList() {
    this.CommonServiceService.getCourseListReurn().subscribe(res => {
      this.courseListforthisModule = res;

    });
  }
  openModal(qObj, myModal) {

    this.modalObjData = qObj;

    myModal.style.display = "block";
  }
  closemodal(myModal) {

    myModal.style.display = "none";

  }

  getCourse_name(course_or_sub_course_id, coursetype) {
    if (coursetype == 'SUB') {
      for (let y = 0; y < this.CommonServiceService.subcourseList.length; y++) {
        if (course_or_sub_course_id == this.CommonServiceService.subcourseList[y]['_id']) {
          return this.CommonServiceService.subcourseList[y]['course_name'];
        }
      }
    } else if (coursetype == 'MAIN') {


      for (let y = 0; y < this.courseListforthisModule.length; y++) {
        if (course_or_sub_course_id == this.courseListforthisModule[y]['_id']) {
          return this.courseListforthisModule[y]['course_name'];
        }
      }
    }
  }

  getTutList() {
    this.CommonServiceService.getTutList(this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
     // this.scrollToDataDiv();
      if (this.tutdataList && this.tutdataList.length > 0) {
        this.tutdataList = this.tutdataList.concat(res.tutorialList);
      } else {
        this.tutdataList = res.tutorialList;
      }
      this.totalRecord = res.totalRecord;

      this.skipDocument = this.skipDocument + this.limitInOneTime;

    });
  }

  resetquestiondata() {

    this.questiondata = {

      course_id: '',
      sub_course_id: "",
      topic: '', day_number: '',

    };

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
      this.searchTut('extend');
    } else {
      this.getTutList();
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
  getSubcourseByIdOfCourse() {


    if (this.questiondata.course_id !== '' && this.questiondata.course_id !== undefined) {


      this.CommonServiceService.getSubcourseByIdOfCourse(this.questiondata.course_id).subscribe(res => {

        this.subcourseList = res;

      });
    }
  }
  reset() {
    this.message = '';
    this.messageClass = '';
    this.messageClassIcon = '';
    this.searchaction = false;
  }


  searchTut(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;
    var filledFound_search = false;
    this.questiondata.course_name = '';
    this.questiondata.sub_course_name = '';

    if (this.questiondata.course_id !== '' && this.questiondata.course_id !== undefined) {
      filledFound_search = true;

      for (let percourse of this.CommonServiceService.courseList) {
        if (percourse._id == this.questiondata.course_id) {
          this.questiondata.course_name = percourse.course_name;

        }
      }

    }
    if (this.questiondata.sub_course_id !== '' && this.questiondata.sub_course_id !== undefined) {
      filledFound_search = true;
      for (let percourse of this.subcourseList) {
        if (percourse._id == this.questiondata.sub_course_id) {
          this.questiondata.sub_course_name = percourse.course_name;

        }
      }
    }
    if (this.questiondata.topic !== '' && this.questiondata.topic !== undefined) {
      filledFound_search = true;

    }


    if (this.questiondata.day_number !== '' && this.questiondata.day_number !== undefined) {
      filledFound_search = true;
      this.questiondata.day_number = +this.questiondata.day_number;
      if (Number.isNaN(this.questiondata.day_number)) {
        this.createAlert('Day number must be a number ', 'warning');
        return false;

      } else {


        if (this.questiondata.day_number < 1) {


          this.createAlert('Day number must be more than 0', 'warning');
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
      this.tutdataList = undefined;
      this.resetInfineScroll();
    }



    this.CommonServiceService.searchTut(this.questiondata, this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.tutdataList && this.tutdataList.length > 0) {
        this.tutdataList = this.tutdataList.concat(res.tutorialList);
      } else {
        this.tutdataList = res.tutorialList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;




    });

  }

  convertIntoColoredvalue(objofpoint_per, word) {
    for (var t = 0; t < objofpoint_per.colored_word_array.length; t++) {
      if (objofpoint_per.colored_word_array[t] == word) {
        return "green";
      }
    }
    return "";
  }
  deleteTut(obj, index) {
    if (confirm('Are you sure you want to delete this question !')) {

      this.CommonServiceService.deleteTut(obj).subscribe(res => {


        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster("Tutorial " + obj.topic + " deleted successfully !", 'success');
          this.tutdataList.splice(index, 1);
          this.totalRecord = this.totalRecord - 1; // infinescroll
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });

    }
  }


}
