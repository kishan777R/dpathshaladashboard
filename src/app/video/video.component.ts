


import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  videodata: any;
  message: string;
  searchform: boolean = false;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  videodataList: any;
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

    //jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore d:\my_private_key.keystore app-release-unsigned.apk my_key_alias 
  }
  scrollToDataDiv() {

    let el = (<HTMLInputElement>document.getElementById('datadiv'));

    el.scrollIntoView();
  }
  ngOnInit() {
    this.CommonServiceService.getCourseList();

    this.getVideoList();
    this.resetvideodata();
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
  getVideoList() {
    this.CommonServiceService.getVideoList(this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
      this.scrollToDataDiv();
      if (this.videodataList && this.videodataList.length > 0) {
        this.videodataList = this.videodataList.concat(res.videoList);
      } else {
        this.videodataList = res.videoList;
      }
      this.totalRecord = res.totalRecord;

      this.skipDocument = this.skipDocument + this.limitInOneTime;

    });
  }

  resetvideodata() {
    this.videodata = { title: '', course_id: '', details: '', sub_course_id: "", active_status: '', topic_id: "" };
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
      this.searchVideo('extend');
    } else {
      this.getVideoList();
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


    if (this.videodata.course_id !== '' && this.videodata.course_id !== undefined) {


      this.CommonServiceService.getSubcourseByIdOfCourse(this.videodata.course_id).subscribe(res => {

        this.subcourseList = res;

      });
    }
  }
  topiclist: any;
  getTopicByIdOfCourse() {


    if (this.videodata.course_id !== '' && this.videodata.course_id !== undefined && this.videodata.sub_course_id !== '' && this.videodata.sub_course_id !== undefined) {


      this.CommonServiceService.searchTopics({ "course_id": this.videodata.course_id, "sub_course_id": this.videodata.sub_course_id }, 999999, 0, -1).subscribe(res => {

        this.topiclist = res.topicList;

      });
    }
  }

  reset() {
    this.message = '';
    this.messageClass = '';
    this.messageClassIcon = '';
    this.searchaction = false;
  }
searchedfunctionclickedForOrder:boolean=false;
updateImagePath(videoObject) {

  if (!videoObject.imagepath) {
    this.HeaderdataService.settoaster("Enter a path", 'danger');
  } else {
    this.CommonServiceService.updateImagePath(videoObject).subscribe(res => {
      if (res.status == 'ERROR') {
        this.HeaderdataService.settoaster(res.message, 'danger');



      } else {
        this.HeaderdataService.settoaster(res.message, 'success');



      }


    });
  }

}
  updateVideoorder(videoObject) {

    if (Number.isNaN(videoObject.order_number)) {
      this.HeaderdataService.settoaster("Enter a Number in order number", 'danger');
    } else {
      this.CommonServiceService.updateVideoorder(videoObject).subscribe(res => {
        if (res.status == 'ERROR') {
          this.HeaderdataService.settoaster(res.message, 'danger');



        } else {
          this.HeaderdataService.settoaster(res.message, 'success');



        }


      });
    }

  }
  searchVideo(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;

    this.searchedfunctionclickedForOrder=true;
    var filledFound_search = false;
    this.videodata.course_name = '';
    this.videodata.sub_course_name = '';

    if (this.videodata.title !== '' && this.videodata.title !== undefined) {


      filledFound_search = true;
    }
    if (this.videodata.details !== '' && this.videodata.details !== undefined) {
      filledFound_search = true;
    }
    if (this.videodata.course_id !== '' && this.videodata.course_id !== undefined) {
      filledFound_search = true;


    }
    if (this.videodata.sub_course_id !== '' && this.videodata.sub_course_id !== undefined) {
      filledFound_search = true;

    }
    if (this.videodata.active_status !== '' && this.videodata.active_status !== undefined) {
      filledFound_search = true;
    }

    if (this.videodata.topic_id !== '' && this.videodata.topic_id !== undefined) {
      filledFound_search = true;
    }






    if (filledFound_search == false) {
      //  this.createAlert('Fill at least one search parameter', 'warning');
      // return false;
    }
    this.searchaction = true;
    if (startagainAction == 'startagain') { // infinescroll
      this.videodataList = undefined;
      this.resetInfineScroll();
    }



    this.CommonServiceService.searchVideos(this.videodata, this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.videodataList && this.videodataList.length > 0) {
        this.videodataList = this.videodataList.concat(res.videoList);
      } else {
        this.videodataList = res.videoList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;




    });

  }


  deleteVideo(obj, index) {
    if (confirm('Are you sure you want to delete this video !')) {

      this.CommonServiceService.deleteVideo(obj).subscribe(res => {


        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster("Video " + obj.title + " deleted successfully !", 'success');
          this.videodataList.splice(index, 1);
          this.totalRecord = this.totalRecord - 1; // infinescroll
          this.CommonServiceService.deletefilefromserverNoMessage(obj.serverpath, obj.imagepath);
          this.CommonServiceService.deletefilefromserverNoMessage(obj.serverpath, obj.videopath);

          this.CommonServiceService.deletefilefromserverNoMessage(obj.serverpath, obj.pdfpath);

          this.CommonServiceService.deletefilefromserverNoMessage(obj.serverpath, obj.supportpath);
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });

    }
  }


}
