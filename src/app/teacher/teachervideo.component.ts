

import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-teachervideo',
  templateUrl: './teachervideo.component.html',
  styleUrls: ['./teachervideo.component.css']
})
export class TeachervideoComponent implements OnInit {
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
  lecturestatus: any;
  teacherdataList: any;
  lecturedataList: any;
  lecturedata: { title: string; topic_id: string; sub_course_id: string; created_by: string; from_reg_date: string; to_reg_date: string; };


  constructor(private route: ActivatedRoute, private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService) {


    this.sub = this.route.params.subscribe(params => {
      this.lecturestatus = params['lecturestatus']; // 
      this.lecturedataList = undefined;
      this.searchaction = true;

      this.resetInfineScroll();
      this.coursedataList = undefined;
      this.getTeacherList();

      this.CommonServiceService.getCourseList();


    });

  }


  pendinglecture(videoobj) {



    for (var f = 0; f < this.coursedataList.length; f++) {
      if (this.coursedataList[f]._id == videoobj.sub_course_id) {
        var courseobj = this.coursedataList[f];
      }
    }
    if (courseobj.course_publish_status == 'PUBLISHED') {
      var r = confirm("Back to Under review will not be changing existing data of this lecture ! Under review is for new changes , made by teacher !");
    } else {
      var r = true;
    }
    if (r) {



      this.CommonServiceService.updateLectureStatus('PENDING', courseobj, videoobj, '').subscribe(res => {
        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster(res.message, 'success');
          videoobj.video_review_status = "PENDING";

        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });
    }
    else {
      return false;
    }
  }
  rejectlecture(videoobj) {
    for (var f = 0; f < this.coursedataList.length; f++) {
      if (this.coursedataList[f]._id == videoobj.sub_course_id) {
        var courseobj = this.coursedataList[f];
      }
    }
    if (courseobj.course_publish_status == 'PUBLISHED') {
      var r = confirm("Rejection will not be changing existing data of this lecture ! Rejection is for new changes , made by teacher !");
    } else {
      var r = true;
    }
    if (r) {

      var reason = prompt("Please enter reason of rejection !");

      this.CommonServiceService.updateLectureStatus('REJECTED', courseobj, videoobj, reason).subscribe(res => {
        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster(res.message, 'success');
          videoobj.video_review_status = "REJECTED";
          videoobj.rejection_reason = reason;
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });
    }
    else {
      return false;
    }
  }

  checkifpublishednot(videoobj) {
    for (var f = 0; f < this.coursedataList.length; f++) {
      if (this.coursedataList[f]._id == videoobj.sub_course_id) {
        var courseobj = this.coursedataList[f];
      }
    }
    if (courseobj.course_publish_status == 'PUBLISHED') {
      return false;
    } else {
      return true;
    }
  }
  
  checkifcourseApproved(videoobj) {
    for (var f = 0; f < this.coursedataList.length; f++) {
      if (this.coursedataList[f]._id == videoobj.sub_course_id) {
        var courseobj = this.coursedataList[f];
      }
    }
    if (courseobj.course_review_status == 'APPROVED') {
      return true;
    } else {
      return false;
    }
  }
 
  getCourseStatus(videoobj) {
    for (var f = 0; f < this.coursedataList.length; f++) {
      if (this.coursedataList[f]._id == videoobj.sub_course_id) {
        var courseobj = this.coursedataList[f];
      }
    }
     
      return courseobj.course_review_status;
     
  }

  
  approvelecture(videoobj) {
    for (var f = 0; f < this.coursedataList.length; f++) {
      if (this.coursedataList[f]._id == videoobj.sub_course_id) {
        var courseobj = this.coursedataList[f];
      }
    }
    if (courseobj.course_publish_status == 'PUBLISHED') {
      var r = confirm("If you approve this lecture details then changes will reflect in main lectures and in Mobile App");
    } else {
      var r = true;
    }
    if (r) {
      this.CommonServiceService.updateLectureStatus('APPROVED', courseobj, videoobj, '').subscribe(res => {
        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster(res.message, 'success');
          videoobj.video_review_status = "APPROVED";
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
  getTeacherCourseList() {
    this.CommonServiceService.getCourseListTeacher(100000, 0, -1, 'ALL').subscribe(res => {

      this.coursedataList = res.courseList;
      this.resetlecturedata();
    });
  }
  getTeacherList() {
    this.CommonServiceService.getTeacherList(100000, 0, -1).subscribe(res => {

      this.teacherdataList = res.teacherList;
      this.getTeacherCourseList();
    });
  }
  getTeachername(teacherid) {
    for (var t = 0; t < this.teacherdataList.length; t++) {
      if (teacherid == this.teacherdataList[t].table_id_for_query) {
        return this.teacherdataList[t].first_name + ' ' + this.teacherdataList[t].last_name;
      }
    }
  }
  getTeacherCourse_name(sub_course_id) {
    for (let y = 0; y < this.coursedataList.length; y++) {
      if (sub_course_id == this.coursedataList[y]['_id']) {
        return this.coursedataList[y]['course_name'];
      }
    }
  }
  getLectureList() {
    this.CommonServiceService.getLectureListTeacher(this.limitInOneTime, this.skipDocument, this.totalRecord, this.lecturestatus).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
      if (this.lecturedataList && this.lecturedataList.length > 0) {
        this.lecturedataList = this.lecturedataList.concat(res.lectureList);
      } else {
        this.lecturedataList = res.lectureList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;
      this.scrollToDataDiv();
    });
  }



  resetlecturedata() {
    this.resetlecturedatajust();
    this.searchLecture('startagain');
  }
  resetlecturedatajust() {
    this.lecturedata = { topic_id: '', sub_course_id: "", title: '', created_by: '', from_reg_date: "", to_reg_date: "" };


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
      this.searchLecture('extend');
    } else {
      this.getLectureList();
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
  topiclist: any = [];
  getTopicList() {
    if (this.topiclist.length == 0) {
      this.CommonServiceService.getTopicListByTeacher().subscribe(res => {
        this.topiclist = res.topiclist;




      });
    }
  }

  searchLecture(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;
    var filledFound_search = false;
    if (this.lecturedata.sub_course_id !== '' && this.lecturedata.sub_course_id !== undefined) {


      filledFound_search = true;
    }
    if (this.lecturedata.created_by !== '' && this.lecturedata.created_by !== undefined) {
      filledFound_search = true;
    }
    if (this.lecturedata.title !== '' && this.lecturedata.title !== undefined) {
      filledFound_search = true;
    }
    if (this.lecturedata.topic_id !== '' && this.lecturedata.topic_id !== undefined) {
      filledFound_search = true;
    }
    if (this.lecturedata.from_reg_date !== '' && this.lecturedata.from_reg_date !== undefined) {
      filledFound_search = true;
    }


    if (this.lecturedata.to_reg_date !== '' && this.lecturedata.to_reg_date !== undefined) {
      filledFound_search = true;
    }



    if (filledFound_search == false) {
      //  this.createAlert('Fill at least one search parameter', 'warning');
      // return false;
    }
    this.searchaction = true;
    if (startagainAction == 'startagain') { // infinescroll
      this.lecturedataList = undefined;
      this.resetInfineScroll();
    }



    this.CommonServiceService.searchLectureTeacher(this.lecturedata, this.limitInOneTime, this.skipDocument, this.totalRecord, this.lecturestatus).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.lecturedataList && this.lecturedataList.length > 0) {
        this.lecturedataList = this.lecturedataList.concat(res.lectureList);
      } else {
        this.lecturedataList = res.lectureList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;




    });

  }



  //modal
  modalObjData: any = {};
  openModal(qObj, myModal) {

    this.modalObjData = qObj;

    myModal.style.display = "block";
  }
  closemodal(myModal) {

    myModal.style.display = "none";

  }
  //modal end

}

