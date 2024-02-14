import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'app-addquestions',
  templateUrl: './addquestions.component.html',
  styleUrls: ['./addquestions.component.css']
})
export class AddquestionsComponent implements OnInit {
  questiondata: any;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  editingid: number = 0;
  saveaction: boolean;
  fileuploadAction: boolean;
  private sub: any;
  subcourseList: any;
  fileUpload = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };
  profileForm: FormGroup;

  constructor(private router: Router, private CommonServiceService: CommonServiceService, private route: ActivatedRoute, private fb: FormBuilder, private fileUploadService: FileUploadService) {
    this.CommonServiceService.getCourseList();


    this.sub = this.route.params.subscribe(params => {
      this.editingid = params['qid']; // (+) converts string 'id' to a number

      if (this.editingid == 0) {
        this.resetquestiondata();
      } else {

        this.CommonServiceService.getQuestions_byid(this.editingid).subscribe(res => {

          this.questiondata = res;
          this.getSubcourseByIdOfCourse();
        });

      }
    });


  }

  ngOnInit() {
    this.profileForm = this.fb.group({

      profile: ['']
    });
  }

  onSelectedFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      this.profileForm.get('profile').setValue(file);
      this.onSubmitFileUpload();
    }
  }

  onSubmitFileUpload() {
    this.reset();
    if (this.questiondata.course_id == '' || this.questiondata.course_id == undefined) {


      this.createAlert('Please fill course field ', 'warning');
      return false;
    }
    if (this.questiondata.sub_course_id == '' || this.questiondata.sub_course_id == undefined) {


      this.createAlert('Please fill sub course field ', 'warning');
      return false;
    }
    for (let percourse of this.CommonServiceService.courseList) {
      if (percourse._id == this.questiondata.course_id) {
        this.questiondata.course_name = percourse.course_name;
      }
    }
    for (let percourse of this.subcourseList) {
      if (percourse._id == this.questiondata.sub_course_id) {
        this.questiondata.sub_course_name = percourse.course_name;
      }
    }

    this.fileUpload = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };
    const formData = new FormData();
    formData.append("course_id", "" + this.questiondata.course_id);
    formData.append("sub_course_id", "" + this.questiondata.sub_course_id);
    formData.append("course_name", "" + this.questiondata.course_name);
    formData.append("sub_course_name", "" + this.questiondata.sub_course_name);
    formData.append('profile', this.profileForm.get('profile').value);
    formData.append("filetype", "" + this.profileForm.get('profile').value.type);///new

    this.fileuploadAction = true;
    this.fileUploadService.upload(formData, 'uploadQuestionAPI').subscribe(
      res => {
        this.fileuploadAction = false;


        this.fileUpload = res;
        if (this.fileUpload.status == 'success') {

          this.createAlert(res.message, 'success');

        } else if (this.fileUpload.status == 'error') {
          //this.error=res.message;

          this.createAlert(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction = false;

        this.createAlert(err, 'warning');
      }
    );
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  uncheckOtherCheckbox(objOptions, index) {
    if (!objOptions.status) {
      // alert(objOptions.status);
      let y = 0;
      for (let peroption of this.questiondata.options) {
        if (index !== y) {
          this.questiondata.options[y]['status'] = false;
        }
        y++;
      }
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
    this.saveaction = false;
    this.fileuploadAction = false;
  }
  resetquestiondata() {
    this.questiondata = { id: this.editingid, question: '', course_id: '', day_number: '', sub_course_id: "", category: 'Daily', level: '',question_type:"", remark: '', audio_line: '', mark: '', duration_of_question: "", options: [{ value: '', status: false }, { value: '', status: false }, { value: '', status: false }, { value: '', status: false }] };
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
  addmoreoptions() {
    this.questiondata.options.push({ value: '', status: false });
  }

  onquestionBlur(){
   this.questiondata.audio_line= this.questiondata.question;
  }
  saveQuestion() {

    this.reset();

    if (this.questiondata.question == '' || this.questiondata.question == undefined) {


      this.createAlert('Please fill question field', 'warning');
      return false;
    }
    if (this.questiondata.category == '' || this.questiondata.category == undefined) {


      this.createAlert('Please fill category field ', 'warning');
      return false;
    }
    if (this.questiondata.course_id == '' || this.questiondata.course_id == undefined) {


      this.createAlert('Please fill course field ', 'warning');
      return false;
    }
    if (this.questiondata.sub_course_id == '' || this.questiondata.sub_course_id == undefined) {


      this.createAlert('Please fill sub course field ', 'warning');
      return false;
    }
  
    if (this.questiondata.question_type == '' || this.questiondata.question_type == undefined) {


      this.createAlert('Please fill Question Type  field ', 'warning');
      return false;
    }

    if (this.questiondata.duration_of_question == '' || this.questiondata.duration_of_question == undefined) {


      this.createAlert('Please fill Question duration  field ', 'warning');
      return false;
    }
    if (this.questiondata.mark == '' || this.questiondata.mark == undefined) {


      this.createAlert('Please fill Question weightage  field ', 'warning');
      return false;
    }
    if (this.questiondata.level == '' || this.questiondata.level == undefined) {

      if (this.questiondata.category !== 'Final') {
        this.createAlert('Please fill level field ' + this.questiondata.category, 'warning');
        return false;
      }

    }
    if (this.questiondata.day_number == '' || this.questiondata.day_number == undefined) {

      if (this.questiondata.category !== 'Final') {
        this.createAlert('Please fill day number ', 'warning');
        return false;
      }

    }
    //day_number
    if (this.questiondata.level !== '' && this.questiondata.level !== undefined) {
      this.questiondata.level = +this.questiondata.level;
      if (Number.isInteger(this.questiondata.level)) {

        if (this.questiondata.level < 1) {

          if (this.questiondata.category !== 'Final') {
            this.createAlert('Week number must be more than 0', 'warning');
            return false;
          }
        }
      } else {
        if (this.questiondata.category !== 'Final') {
          this.createAlert('Week number must be integer', 'warning');
          return false;
        }
      }
    }

    if (this.questiondata.day_number !== '' && this.questiondata.day_number !== undefined) {
      this.questiondata.day_number = +this.questiondata.day_number;
      if (Number.isInteger(this.questiondata.day_number)) {

        if (this.questiondata.day_number < 1) {

          if (this.questiondata.category !== 'Final') {
            this.createAlert('Day number must be more than 0', 'warning');
            return false;
          }
        }
      } else {
        if (this.questiondata.category !== 'Final') {
          this.createAlert('Day number must be integer', 'warning');
          return false;
        }
      }
    }
    if (this.questiondata.mark !== '' && this.questiondata.mark !== undefined) {
      this.questiondata.mark = +this.questiondata.mark;
      if (Number.isNaN(this.questiondata.mark)) {
        this.createAlert('Question weightage must be a number ', 'warning');
        return false;

      } else {


        if (this.questiondata.mark < 1) {


          this.createAlert('Question weightage must be more than 0', 'warning');
          return false;
        }
      }
    }

    if (this.questiondata.duration_of_question !== '' && this.questiondata.duration_of_question !== undefined) {
      this.questiondata.duration_of_question = +this.questiondata.duration_of_question;
      if (Number.isNaN(this.questiondata.duration_of_question)) {
        this.createAlert('Question duration  must be a number ', 'warning');
        return false;

      } else {


        if (this.questiondata.duration_of_question < 1) {


          this.createAlert('Question duration must be more than 0', 'warning');
          return false;
        }
      }
    }

    var filledOFund = false;
    var answerfound = false;
    for (let peroption of this.questiondata.options) {
      if (peroption.value !== '' && peroption.value !== undefined) {
        filledOFund = true;
      }
      if (peroption.status) {
        if (peroption.value !== '' && peroption.value !== undefined) {
          answerfound = true;
        }
      }
    }

    if (filledOFund == false) {
      this.createAlert('Please fill options', 'warning');
      return false;
    }
    if (answerfound == false) {
      this.createAlert('Please select correct answer that have filled value also', 'warning');
      return false;
    }
    for (let percourse of this.CommonServiceService.courseList) {
      if (percourse._id == this.questiondata.course_id) {
        this.questiondata.course_name = percourse.course_name;
      }
    }
    for (let percourse of this.subcourseList) {
      if (percourse._id == this.questiondata.sub_course_id) {
        this.questiondata.sub_course_name = percourse.course_name;
      }
    }
    if (this.questiondata.category == 'Final') {
      this.questiondata.level = 0; this.questiondata.day_number = 0;
    }
     

    this.saveaction = true;
    this.CommonServiceService.saveQuestions(this.questiondata, this.editingid).subscribe(res => {
      this.saveaction = false;

      if (res.status == 'ERROR') {


        this.createAlert(res.message, 'warning');

      } else {
        this.createAlert(res.message, 'success');
        if (this.editingid == 0) {
          this.resetquestiondata();
        } else {

        }


      }


    });

  }
}
