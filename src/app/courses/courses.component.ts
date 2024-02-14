import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  enteringCouse: string;
  upper_level_id: string = "-1";
  message: string;
  messageClass: string;
  messageClassIcon: string;
  editingid: number = 0;
  saveaction: boolean;
  before_upper_level_id: any = "-1";
  iconforfirstcategory: string;
  before_level_number: string;
  before_is_it_last_level: string;
  constructor(private HeaderdataService: HeaderdataService, private CommonServiceService: CommonServiceService) {
    this.enteringCouse = '';
    this.CommonServiceService.getCourseList();
  }


  ngOnInit() {
   
  }
  reset() {
    this.message = '';
    this.messageClass = '';
    this.messageClassIcon = '';
    this.saveaction = false;
  }

  saveCourse() {
    this.reset();
    if (this.enteringCouse == '' || this.enteringCouse == undefined) {
      this.message = 'Please Enter Course Name !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.upper_level_id == '-1' || this.upper_level_id == undefined) {
      this.message = 'Please Enter Parent category !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else {
      this.saveaction = true;
      var upper_level_obj = {};
      if (this.upper_level_id != '') {
        for (var d = 0; d < this.CommonServiceService.courseList.length; d++) {
          if (this.CommonServiceService.courseList[d]._id == this.upper_level_id) {
            upper_level_obj = this.CommonServiceService.courseList[d];
          }

        }
      }
      var before_upper_level_id_obj = {};
      if (this.before_upper_level_id != '' && this.before_upper_level_id != '-1') {
        for (var d = 0; d < this.CommonServiceService.courseList.length; d++) {
          if (this.CommonServiceService.courseList[d]._id == this.before_upper_level_id) {
            before_upper_level_id_obj = this.CommonServiceService.courseList[d];
          }

        }
      }

      this.CommonServiceService.saveCourse(this.iconforfirstcategory,this.CommonServiceService.courseList,this.upper_level_id, this.enteringCouse, this.editingid, upper_level_obj, this.before_upper_level_id, this.before_level_number, this.before_is_it_last_level, before_upper_level_id_obj).subscribe(res => {
        this.saveaction = false;
        if (res.status == 'ERROR') {


          this.message = res.message;
          this.messageClass = 'warning';
          this.messageClassIcon = 'warning';


        } else {

          if (this.editingid == 0) {
            this.message = 'Course Added Successfully ! ';
          } else {
            this.message = 'Course Edited Successfully ! ';
          }

          this.messageClass = 'success';
          this.messageClassIcon = 'check-circle';
          this.enteringCouse = '';
          this.upper_level_id = '-1';this.iconforfirstcategory= '';
          this.before_upper_level_id = '-1';
          this.before_is_it_last_level = '-1'; this.before_level_number = '-1';
          this.editingid = 0;
          this.CommonServiceService.getCourseList();
          this.CommonServiceService.makeCourseListForForm(this.editingid);
        }


      });




      //  get new couses list toether is response and upate in common servce
    }



  }

  clickedEditButton(obj) {
    this.enteringCouse = obj.course_name;
    this.editingid = obj._id;
    this.CommonServiceService.makeCourseListForForm(this.editingid);
    this.upper_level_id = obj.upper_level_id; this.before_upper_level_id = obj.upper_level_id;
    this.before_is_it_last_level = obj.is_it_last_level; this.before_level_number = obj.level_number;this.iconforfirstcategory= obj.iconforfirstcategory;
    this.reset();
  }
  deleteCourse(obj) {
    if (confirm('Are you sure you want to delete this Category !')) {

      this.CommonServiceService.deletecourse(obj).subscribe(res => {


        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster("Course " + obj.course_name + " deleted successfully !", 'success');

          this.CommonServiceService.getCourseList();
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });

    }
  }

}


