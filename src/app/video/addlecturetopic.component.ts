 


import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
import { HeaderdataService } from '../headerdata.service';
import { DomSanitizer } from '@angular/platform-browser';

import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'app-addlecturetopic',
  templateUrl: './addlecturetopic.component.html',
  styleUrls: ['./addlecturetopic.component.css']
})
export class AddlecturetopicComponent implements OnInit {
  topicdata: any;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  editingid: number = 0;
  saveaction: boolean;
  fileuploadAction: boolean;
  fileuploadAction_img: boolean;

  private sub: any;
  subcourseList: any;
  fileUpload_img = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };
  fileUpload = { status: '', message: '', filePath: '', serverpath: "", topic_path: "" };
  profileForm: FormGroup;
  profileForm_img: FormGroup;
   

  constructor(private sanitizer: DomSanitizer,private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService, private route: ActivatedRoute, private fb: FormBuilder, private fileUploadService: FileUploadService) {
    this.CommonServiceService.getCourseList();


    this.sub = this.route.params.subscribe(params => {
      this.editingid = params['tid']; // (+) converts string 'id' to a number

      if (this.editingid == 0) {
        this.resettopicdata();
      } else {

        this.CommonServiceService.getTopic_byid(this.editingid).subscribe(res => {

          this.topicdata = res;
          this.getSubcourseByIdOfCourse();
        });

      }
    });


  }

  ngOnInit() {
    
  }
   
  
  ngOnDestroy() {
    this.sub.unsubscribe();
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
    this.saveaction = false;

  }
  resettopicdata() {
    this.topicdata = { id: this.editingid, course_id: '', sub_course_id: "", topic_name: ''  };
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



  saveTopic() {
     
    this.reset();
  
    if (this.topicdata.topic_name == '' || this.topicdata.topic_name == undefined) {


      this.createAlert('Please fill topic name field', 'warning');
      return false;
    }
     
    if (this.topicdata.course_id == '' || this.topicdata.course_id == undefined) {


      this.createAlert('Please fill course field ', 'warning');
      return false;
    }
    if (this.topicdata.sub_course_id == '' || this.topicdata.sub_course_id == undefined) {


      this.createAlert('Please fill sub course field ', 'warning');
      return false;
    }


  
 

    this.saveaction = true;
    this.CommonServiceService.saveTopic(this.topicdata, this.editingid).subscribe(res => {
      this.saveaction = false;

      if (res.status == 'ERROR') {


        this.createAlert(res.message, 'warning');

      } else {
        this.createAlert(res.message, 'success');
        if (this.editingid == 0) {
          this.resettopicdata();
        } else {

        }


      }


    });

  }
}
