
import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from '../file-upload.service';
import { HeaderdataService } from '../headerdata.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-giveanswer-form',
  templateUrl: './giveanswer-form.component.html',
  styleUrls: ['./giveanswer-form.component.css']
})
export class GiveanswerFormComponent implements OnInit {
  askeddata: any;
  chatdata: any;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  editingid: number = 0;
  saveaction: boolean;
  fileuploadAction: boolean;
  private sub: any;


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '100',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  fileUpload = { status: '', message: '', filetype: '', filePath: '', serverpath: "" };
  profileForm: FormGroup;
  obj: Object;

  constructor(private router: Router, private HeaderdataService: HeaderdataService, private CommonServiceService: CommonServiceService, private route: ActivatedRoute, private fb: FormBuilder, private fileUploadService: FileUploadService) {
    this.CommonServiceService.getCourseList();
this.getCourseList();

    this.sub = this.route.params.subscribe(params => {
      this.editingid = params['aid']; // (+) converts string 'id' to a number

      if (this.editingid == 0) {
        this.resetaskeddata();
      } else {

        this.getAnserdetails();



      }
    });


  }
  getChatDetails() {

    this.CommonServiceService.askedQuestion_chatByRId(this.editingid).subscribe(res => {

      this.chatdata = res;

    });

  }
  c_id_int:any;
  questionasked: any;
  getAnserdetails() {

    this.CommonServiceService.askedQuestionById(this.editingid).subscribe(res => {

      this.askeddata = res;
      this.obj = res;

      this.questionasked = this.askeddata.asked_question;
      this.c_id_int=this.askeddata.c_id_int;
      this.getChatDetails();

    });

  }
  courseListforthisModule: any;
  getCourseList() {
    this.CommonServiceService.getCourseListReurn().subscribe(res => {
      this.courseListforthisModule = res;

    });
  }

  getCourse_name(course_or_sub_course_id, coursetype) {   
   

      for (let y = 0; y < this.courseListforthisModule.length; y++) {
        if (course_or_sub_course_id == this.courseListforthisModule[y]['_id']) {
          return this.courseListforthisModule[y]['course_name'];
        }
      }
     
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


    this.fileUpload = { status: '', message: '', filetype: '', filePath: '', serverpath: "" };
    const formData = new FormData();

    //formData.append("sub_course_name", "" + this.askeddata.sub_course_name);
    formData.append('profile', this.profileForm.get('profile').value);
    formData.append("filetype", "" + this.profileForm.get('profile').value.type);///new

    this.fileuploadAction = true;
    this.fileUploadService.upload(formData, 'uploadAskQuestionAPI').subscribe(
      res => {
        


        this.fileUpload = res;
        if (this.fileUpload.status == 'success') {
          this.askeddata.filePath = res.filePath;
          this.askeddata.filetype = res.filetype;
          this.askeddata.serverpath = res.serverpath;
          this.HeaderdataService.settoaster(res.message, 'success');
          this.fileuploadAction = false;
        } else if (this.fileUpload.status == 'error') {
          //this.error=res.message;
          this.HeaderdataService.settoaster(res.message, 'warning');
          this.fileuploadAction = false;
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction = false;
        this.HeaderdataService.settoaster(err, 'warning');
         
      }
    );
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  reset() {
    this.message = '';
    this.messageClass = '';
    this.messageClassIcon = '';
    this.saveaction = false;
    this.fileuploadAction = false;
  }
  resetaskeddata() {
    this.askeddata = { _id: this.editingid, answer: '', filePath: '', filetype: '' };
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
  chatanswer: any = '';
  savechat() {
    if (this.chatanswer == '' || this.chatanswer == undefined) {
      return false;
    }




    this.CommonServiceService.saveAskedQuestion_chat(this.editingid, this.chatanswer,this.questionasked,this.c_id_int).subscribe(res => {


      if (res.status == 'ERROR') {

        this.HeaderdataService.settoaster(res.message, 'danger');
      } else {
        this.getChatDetails();
        this.chatanswer = '';
        this.HeaderdataService.settoaster("Message saved successfully !", 'success');



      }
    },
      (error) => {

        this.createAlert("Something is wwrong ", 'warning');

      });

  }

  deletemessageofchat(obj) {
    if (confirm('Are you sure you want to delete this chat message !')) {

      this.CommonServiceService.deletemessageofchat(obj).subscribe(res => {


        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster("Message deleted successfully !", 'success');
          this.getChatDetails();
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });

    }
  }
  giveanswer() {

    this.reset();

    if (this.askeddata.answer == '' || this.askeddata.answer == undefined) {


      this.createAlert('Please fill question field', 'warning');
      return false;
    }



    this.saveaction = true;
    this.CommonServiceService.giveanswer(this.askeddata).subscribe(res => {
      this.saveaction = false;

      if (res.status == 'ERROR') {


        this.createAlert(res.message, 'warning');

      } else {
        this.createAlert(res.message, 'success');
        if (this.editingid == 0) {
          this.resetaskeddata();
        } else {

        }


      }


    });

  }
}
