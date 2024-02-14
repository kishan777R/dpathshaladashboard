





import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-lecturetopiclist',
  templateUrl: './lecturetopiclist.component.html',
  styleUrls: ['./lecturetopiclist.component.css']
})
export class LecturetopiclistComponent implements OnInit {
  topicdata: any;
  message: string;
  searchform: boolean = false;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  topicdataList: any;
  modalObjData: any = {};

  subcourseList: any;
  throttle = 300;  // infinescroll
  scrollDistance = 1;  // infinescroll
  scrollUpDistance = 2;  // infinescroll
  limitInOneTime: number = 30;// infinescroll
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

    this.getTopicList();
    this.resettopicdata();
    this.getCourseList();
    this.CommonServiceService.getSubCourseList();
  }

  openModal(qObj, myModal) {

    this.modalObjData = qObj;

    myModal.style.display = "block";
  }
  closemodal(myModal) {

    myModal.style.display = "none";

  }

  courseListforthisModule: any;
  getCourseList() {
    this.CommonServiceService.getCourseListReurn().subscribe(res => {
      this.courseListforthisModule = res;

    });
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
  getTopicList() {
    this.CommonServiceService.getTopicList(this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
      this.scrollToDataDiv();
      if (this.topicdataList && this.topicdataList.length > 0) {
        this.topicdataList = this.topicdataList.concat(res.topicList);
      } else {
        this.topicdataList = res.topicList;
      }
      this.totalRecord = res.totalRecord;

      this.skipDocument = this.skipDocument + this.limitInOneTime;

    });
  }

  resettopicdata() {
    this.topicdata = { topic_name: '', course_id: '', details: '', sub_course_id: "" };
  }
  resetInfineScroll() { // infinescroll
    this.limitInOneTime = 30;
    this.skipDocument = 0;
    this.totalRecord = 0;
  }
  onScrollDown(ev) {   // infinescroll
    console.log('scrolled down!!', ev);

    this.infinescrollerstatus = true; //infinescroll
    if (this.searchedFunctionClick) {
      this.searchTopic('extend');
    } else {
      this.getTopicList();
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


    if (this.topicdata.course_id !== '' && this.topicdata.course_id !== undefined) {


      this.CommonServiceService.getSubcourseByIdOfCourse(this.topicdata.course_id).subscribe(res => {

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


  searchTopic(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;
    var filledFound_search = false;

    if (this.topicdata.topic_name !== '' && this.topicdata.topic_name !== undefined) {


      filledFound_search = true;
    }

    if (this.topicdata.course_id !== '' && this.topicdata.course_id !== undefined) {
      filledFound_search = true;


    }
    if (this.topicdata.sub_course_id !== '' && this.topicdata.sub_course_id !== undefined) {
      filledFound_search = true;

    }








    if (filledFound_search == false) {
      //  this.createAlert('Fill at least one search parameter', 'warning');
      // return false;
    }
    this.searchaction = true;
    if (startagainAction == 'startagain') { // infinescroll
      this.topicdataList = undefined;
      this.resetInfineScroll();
    }



    this.CommonServiceService.searchTopics(this.topicdata, this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.topicdataList && this.topicdataList.length > 0) {
        this.topicdataList = this.topicdataList.concat(res.topicList);
      } else {
        this.topicdataList = res.topicList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;




    });

  }


  deleteTopic(obj, index) {
    if (confirm('Are you sure you want to delete this topic !')) {

      this.CommonServiceService.deleteTopic(obj).subscribe(res => {


        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster("Topic " + obj.topic_name + " deleted successfully !", 'success');
          this.topicdataList.splice(index, 1);
          this.totalRecord = this.totalRecord - 1; // infinescroll
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });

    }
  }


}
