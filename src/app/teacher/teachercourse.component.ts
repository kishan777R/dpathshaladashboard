







import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-teachercourse',
  templateUrl: './teachercourse.component.html',
  styleUrls: ['./teachercourse.component.css']
})
export class TeachercourseComponent implements OnInit {
  coursedata: any;
  searchform: boolean = false;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  coursedataList: any;

  private sub: any;

  throttle = 300;  // infinescroll
  scrollDistance = 1;  // infinescroll
  scrollUpDistance = 2;  // infinescroll
  limitInOneTime: number = 10;// infinescroll
  skipDocument: number = 0;// infinescroll
  totalRecord: number = 0;// infinescroll
  searchedFunctionClick: boolean = false;// infinescroll
  infinescrollerstatus: boolean = false;//infinescroll
  coursestatus: any;
  teacherdataList: any;


  constructor(private route: ActivatedRoute, private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService) {


    this.sub = this.route.params.subscribe(params => {
      this.coursestatus = params['coursestatus']; // 

      this.resetInfineScroll();
      this.coursedataList = undefined;
      this.getTeacherList();
this.CommonServiceService.getCourseList();



    });

  }

  publish(courseobj) {

    var r = confirm("By Publishing this course, you will be adding this course to main stream. And this process is non-reversable.Before Publishing, must check that teacher have uploaded all the video of course. Press OK if still you want to Publish !");

    if (r) {



      this.CommonServiceService.updateCousrsepublishStatus('PUBLISHED', courseobj, '').subscribe(res => {
        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster(res.message, 'success');
          courseobj.course_publish_status = "PUBLISHED";
           
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });
    }
    else {
      return false;
    }
  }

  pendingCorse(courseobj) {
    if (courseobj.course_publish_status == 'PUBLISHED') {
      var r = confirm("Back to Under review will not be changing existing data of this course ! Under review is for new changes , made by teacher !");
    } else {
      var r = true;
    }
    if (r) {



      this.CommonServiceService.updateCousrseStatus('PENDING', courseobj, '').subscribe(res => {
        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster(res.message, 'success');
          courseobj.course_review_status = "PENDING";
          
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });
    }
    else {
      return false;
    }
  }
  rejectCorse(courseobj) {
    if (courseobj.course_publish_status == 'PUBLISHED') {
      var r = confirm("Rejection will not be changing existing data of this course ! Rejection is for new changes , made by teacher !");
    } else {
      var r = true;
    }
    if (r) {

      var reason = prompt("Please enter reason of rejection !");

      this.CommonServiceService.updateCousrseStatus('REJECTED', courseobj, reason).subscribe(res => {
        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster(res.message, 'success');
          courseobj.course_review_status = "REJECTED";
          courseobj.rejection_reason = reason;
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });
    }
    else {
      return false;
    }
  }


  approvecourse(courseobj) {
    if (courseobj.course_publish_status == 'PUBLISHED') {
      var r = confirm("If you approve this course details then changes will reflect in main courses and in Mobile App");
    } else {
      var r = true;
    }
    if (r) {
      this.CommonServiceService.updateCousrseStatus('APPROVED', courseobj, '').subscribe(res => {
        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster(res.message, 'success');
          courseobj.course_review_status = "APPROVED";
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }


      });
    }
    else {
      return false;
    }
  }
  ngOnInit() {

  }

  getTeacherList() {
    this.CommonServiceService.getTeacherList(100000, 0, -1).subscribe(res => {

      this.teacherdataList = res.teacherList;
      this.resetcoursedata();
    });
  }
  getTeachername(teacherid) {
    for (var t = 0; t < this.teacherdataList.length; t++) {
      if (teacherid == this.teacherdataList[t].table_id_for_query) {
        return this.teacherdataList[t].first_name + ' ' + this.teacherdataList[t].last_name;
      }
    }
  }

  getCourseList() {
    this.CommonServiceService.getCourseListTeacher(this.limitInOneTime, this.skipDocument, this.totalRecord, this.coursestatus).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
      if (this.coursedataList && this.coursedataList.length > 0) {
        this.coursedataList = this.coursedataList.concat(res.courseList);
      } else {
        this.coursedataList = res.courseList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;
      this.scrollToDataDiv();
    });
  }



  resetcoursedata() {
    this.resetcoursedatajust();
    this.searchcourse('startagain');
  }
  resetcoursedatajust() {
    this.coursedata = { course_name: '', created_by: '', from_reg_date: "", to_reg_date: "" };


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
      this.searchcourse('extend');
    } else {
      this.getCourseList();
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


  searchcourse(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;
    var filledFound_search = false;
    if (this.coursedata.course_name !== '' && this.coursedata.course_name !== undefined) {


      filledFound_search = true;
    }
    if (this.coursedata.created_by !== '' && this.coursedata.created_by !== undefined) {
      filledFound_search = true;
    }









    if (this.coursedata.from_reg_date !== '' && this.coursedata.from_reg_date !== undefined) {
      filledFound_search = true;
    }


    if (this.coursedata.to_reg_date !== '' && this.coursedata.to_reg_date !== undefined) {
      filledFound_search = true;
    }



    if (filledFound_search == false) {
      //  this.createAlert('Fill at least one search parameter', 'warning');
      // return false;
    }
    this.searchaction = true;
    if (startagainAction == 'startagain') { // infinescroll
      this.coursedataList = undefined;
      this.resetInfineScroll();
    }



    this.CommonServiceService.searchCoursesTeacher(this.coursedata, this.limitInOneTime, this.skipDocument, this.totalRecord, this.coursestatus).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.coursedataList && this.coursedataList.length > 0) {
        this.coursedataList = this.coursedataList.concat(res.courseList);
      } else {
        this.coursedataList = res.courseList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;




    });

  }



  //modal
  modalObjData: any = {};
  openModal(qObj, myModal) {

    this.modalObjData = qObj;
    console.log(this.modalObjData.question);
    myModal.style.display = "block";
  }
  closemodal(myModal) {

    myModal.style.display = "none";

  }
  //modal end

}

