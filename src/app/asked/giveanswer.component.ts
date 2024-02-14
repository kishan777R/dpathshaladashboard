




import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-giveanswer',
  templateUrl: './giveanswer.component.html',
  styleUrls: ['./giveanswer.component.css']
})
export class GiveanswerComponent implements OnInit {
  askedQdata: any;
  searchform: boolean = false;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  askedQuestionList: any;
  askedquestiontype: any;
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

  clientdataList: any;
  constructor(private route: ActivatedRoute, private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService) {


    this.sub = this.route.params.subscribe(params => {


      this.resetInfineScroll();
      this.askedQuestionList = undefined;
      this.askedquestiontype = params['askedquestiontype'];

      this.resetaskedQdata();
      this.get_courses_subcourse_both();

    });

  }


  ngOnInit() {
    this.getClientList();
    this.getCourseList();
    this.CommonServiceService.getSubCourseList();

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

  getSubcourseByIdOfCourse() {
    this.askedQdata.sub_course_id = "";
    this.subcourse_list = [];
    var subcourse_list = [];
    var course_id = this.askedQdata.course_id;
    this.courses_subcourse_both_list.forEach(function (value) {
      if (value.parent_course == course_id) {
        subcourse_list.push(value);
      }

    });
    this.subcourse_list = subcourse_list;
  }
  getAskedQuestionList() {
    this.CommonServiceService.getAskedQuestionList(this.limitInOneTime, this.skipDocument, this.totalRecord, this.askedquestiontype).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
      if (this.askedQuestionList && this.askedQuestionList.length > 0) {
        this.askedQuestionList = this.askedQuestionList.concat(res.askedQuestionList);
      } else {
        this.askedQuestionList = res.askedQuestionList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;
      this.scrollToDataDiv();
    });
  }
  getClientList() {
    this.CommonServiceService.getClientList(500000, 0, 1).subscribe(res => {
      this.clientdataList = [];
      for (var f = 0; f < res.clientList.length; f++) {
        if (res.clientList[f].customer_id_int > 0) {
          this.clientdataList.push(res.clientList[f]);
        }

      }
      //customer_id_int
      for (let y = 0; y < this.clientdataList.length; y++) {
        var matchstr = this.clientdataList[y]['first_name'] + " " + this.clientdataList[y]['last_name'] + " (" + this.clientdataList[y]['customer_id'] + ")";

        this.clientdataList[y]['matchstr'] = matchstr;
      }
    });
  }
  courseListforthisModule: any;
  getCourseList() {
    this.CommonServiceService.getCourseListReurn().subscribe(res => {
      this.courseListforthisModule = res;

    });
  }

  getClientname(c_id_int) {
    console.log("clientdataList");
    console.log(this.clientdataList);
    for (let y = 0; y < this.clientdataList.length; y++) {
      if (c_id_int == this.clientdataList[y]['c_id_int']) {
        return this.clientdataList[y]['matchstr'];
      }
    }
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
  onSortChange(e) {
    if (e.target.value !== '') {
      for (let y = 0; y < this.clientdataList.length; y++) {
        if (e.target.value == this.clientdataList[y]['matchstr']) {

          this.askedQdata.c_id_int = this.clientdataList[y]['c_id_int'];

        }
      }
    } else {

      this.askedQdata.c_id_int = '';



    }
  }
  resetaskedQdata() {
    this.askedQdata = { from_asked_date: "", to_asked_date: "", c_id_int: "" };
    this.searchaskedQ('startagain');
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
      this.searchaskedQ('extend');
    } else {
      this.getAskedQuestionList();
    }

  }

  scrollToDataDiv() {

    let el = (<HTMLInputElement>document.getElementById('datadiv'));

    el.scrollIntoView();
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


  searchaskedQ(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;
    var filledFound_search = false;

    if (this.askedQdata.c_id_int !== '' && this.askedQdata.c_id_int !== undefined) {
      filledFound_search = true;
    }




    if (this.askedQdata.from_asked_date !== '' && this.askedQdata.from_asked_date !== undefined) {
      filledFound_search = true;
    }


    if (this.askedQdata.to_asked_date !== '' && this.askedQdata.to_asked_date !== undefined) {
      filledFound_search = true;
    }

    if (filledFound_search == false) {
      //  this.createAlert('Fill at least one search parameter', 'warning');
      // return false;
    }
    this.searchaction = true;
    if (startagainAction == 'startagain') { // infinescroll
      this.askedQuestionList = undefined;
      this.resetInfineScroll();
    }



    this.CommonServiceService.searchaskedQ(this.askedQdata, this.limitInOneTime, this.skipDocument, this.totalRecord, this.askedquestiontype).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.askedQuestionList && this.askedQuestionList.length > 0) {
        this.askedQuestionList = this.askedQuestionList.concat(res.askedQuestionList);
      } else {
        this.askedQuestionList = res.askedQuestionList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;

    });

  }


 


}
