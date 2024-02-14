


import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
import { HeaderdataService } from '../headerdata.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from '../file-upload.service';
@Component({
  selector: 'app-addvideo',
  templateUrl: './addvideo.component.html',
  styleUrls: ['./addvideo.component.css']
})
export class AddvideoComponent implements OnInit {
  videodata: any;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  editingid: number = 0;
  saveaction: boolean;
  fileuploadAction: boolean;
  fileuploadAction_img: boolean;
  fileuploadAction_support: boolean;
  fileuploadAction_pdf: boolean;
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
  private sub: any;
  subcourseList: any;
  fileUpload_img = { status: '',filetype: '', message: '', filePath: '', serverpath: "", image_path: "" };

  fileUpload_support = { status: '',filetype: '', message: '', filePath: '', serverpath: "", support_path: "" };
  fileUpload_pdf = { status: '', filetype: '',message: '', filePath: '', serverpath: "", pdf_path: "" };
  fileUpload = { status: '', filetype: '',message: '', filePath: '', serverpath: "", video_path: "" };
  profileForm: FormGroup;
  profileForm_img: FormGroup;
  profileForm_support: FormGroup;
  profileForm_pdf: FormGroup;
  pdfpath: any = "";
  supportpath: any = "";
   //change
   imagepathPrevious: any;
   videopathPrevious: any;
   pdfpathPrevious: any;
   supportpathPrevious: any;
   serverpathPrevious: any;
 
   //change end
  constructor(private sanitizer: DomSanitizer, private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService, private route: ActivatedRoute, private fb: FormBuilder, private fileUploadService: FileUploadService) {
    this.CommonServiceService.getCourseList();


    this.sub = this.route.params.subscribe(params => {
      this.editingid = params['vid']; // (+) converts string 'id' to a number

      if (this.editingid == 0) {
        this.resetvideodata();
      } else {

        this.CommonServiceService.getVideo_byid(this.editingid).subscribe(res => {

          this.videodata = res;
          this.imagepath = this.videodata.imagepath; this.videopath = this.videodata.videopath;
          this.pdfpath = this.videodata.pdfpath; this.supportpath = this.videodata.supportpath;


          
          ///change
          this.imagepathPrevious = this.videodata.imagepath;
          this.videopathPrevious = this.videodata.videopath;
          this.pdfpathPrevious = this.videodata.pdfpath;
          this.supportpathPrevious = this.videodata.supportpath;
          this.serverpathPrevious = this.videodata.serverpath;

          ///change end
          this.getSubcourseByIdOfCourse();
        });

      }
    });


  }
  topiclist: any;
  getTopicByIdOfCourse() {


    if (this.videodata.course_id !== '' && this.videodata.course_id !== undefined && this.videodata.sub_course_id !== '' && this.videodata.sub_course_id !== undefined) {


      this.CommonServiceService.searchTopics({ "course_id": this.videodata.course_id, "sub_course_id": this.videodata.sub_course_id }, 90000, 0, -1).subscribe(res => {

        this.topiclist = res.topicList;

      });
    }
  }
  ngOnInit() {
    this.profileForm = this.fb.group({

      profile: ['']
    });

    this.profileForm_img = this.fb.group({

      profile_img: ['']
    });


    this.profileForm_support = this.fb.group({

      profile_support: ['']
    });




    this.profileForm_pdf = this.fb.group({

      profile_pdf: ['']
    });
  }
  videoduration: number = 0; videoUrl: any;
  getDuration(e) {
    const duration = e.target.duration;
    this.videoduration = duration;
    this.onSubmitFileUpload();
  }

  onSelectedFile(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }
    if (event.target.files.length > 0) {


      const file = event.target.files[0];
      this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));

      this.profileForm.get('profile').setValue(file);



    }
  }
  onSelectedFile_img(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }
    console.log(event);
    if (event.target.files.length > 0) {
      const file_img = event.target.files[0];

      this.profileForm_img.get('profile_img').setValue(file_img);
      this.onSubmitFileUpload_img();
    }
  }

  onSelectedFile_pdf(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }
    console.log(event);
    if (event.target.files.length > 0) {
      const file_pdf = event.target.files[0];

      this.profileForm_pdf.get('profile_pdf').setValue(file_pdf);
      this.onSubmitFileUpload_pdf();
    }
  }

  onSelectedFile_support(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }
    console.log(event);
    if (event.target.files.length > 0) {
      const file_support = event.target.files[0];

      this.profileForm_support.get('profile_support').setValue(file_support);
      this.onSubmitFileUpload_support();
    }
  }




  imagepath: string = "";
  videopath: string = "";
  fileaction: boolean = false;
  onSubmitFileUpload() {
    this.reset();
    this.fileuploadAction = false;

    this.fileaction = false;
    this.fileUpload = { status: '', filetype: '',message: '', filePath: '', serverpath: "", video_path: "" };


    const formData = new FormData();
    formData.append("uploadingwhat", "" + "video");
    formData.append("filetype", "" + this.profileForm.get('profile').value.type);///new


    formData.append('profile', this.profileForm.get('profile').value);
    this.fileuploadAction = true; this.fileaction = true;
    this.fileUploadService.upload(formData, 'uploadfileAPI_for_video_module').subscribe(
      res => {
        this.fileuploadAction = false;


        this.fileUpload = res;
        if (this.fileUpload.status == 'success') {
          this.videopath = res.video_image_path;
          this.fileaction = false;
          this.HeaderdataService.settoaster("Video uploaded successfully", 'success');
        } else if (this.fileUpload.status == 'error') {
          //this.error=res.message;
          this.fileaction = false; this.fileuploadAction = false;
          this.HeaderdataService.settoaster(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction = false;
        this.fileaction = false;
        this.HeaderdataService.settoaster("Something is wrong ", 'warning');
      }
    );
  }
  onSubmitFileUpload_img() {
    this.reset();
    this.fileuploadAction_img = false;
    this.fileaction = false;
    this.fileUpload_img = { status: '',filetype: '', message: '', filePath: '', serverpath: "", image_path: "" };


    const formData_img = new FormData();
    formData_img.append("uploadingwhat", "" + "image");
    formData_img.append("filetype", "" + this.profileForm_img.get('profile_img').value.type);///new

    formData_img.append('profile', this.profileForm_img.get('profile_img').value);
    this.fileuploadAction_img = true; this.fileaction = true;
    this.fileUploadService.upload(formData_img, 'uploadfileAPI_for_video_module').subscribe(
      res => {
        this.fileuploadAction_img = false;


        this.fileUpload_img = res;
        if (this.fileUpload_img.status == 'success') {
          this.imagepath = res.video_image_path;
          this.fileaction = false;
          this.HeaderdataService.settoaster("Thumbnail uploaded successfully", 'success');
        } else if (this.fileUpload_img.status == 'error') {
          //this.error=res.message;
          this.fileuploadAction_img = false; this.fileaction = false;

          this.HeaderdataService.settoaster(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction_img = false;
        this.fileaction = false;
        this.HeaderdataService.settoaster("Something is wrong", 'warning');
      }
    );
  }


  onSubmitFileUpload_support() {
    this.reset();
    this.fileuploadAction_support = false;
    this.fileaction = false;
    this.fileUpload_support = { status: '', filetype: '',message: '', filePath: '', serverpath: "", support_path: "" };


    const formData_support = new FormData();
    formData_support.append("uploadingwhat", "" + "support");
    formData_support.append("filetype", "" + this.profileForm_support.get('profile_support').value.type);///new

    formData_support.append('profile', this.profileForm_support.get('profile_support').value);
    this.fileuploadAction_support = true; this.fileaction = true;
    this.fileUploadService.upload(formData_support, 'uploadfileAPI_for_video_module').subscribe(
      res => {
        this.fileuploadAction_support = false;


        this.fileUpload_support = res;
        if (this.fileUpload_support.status == 'success') {
          this.supportpath = res.video_image_path;
          this.videodata.supportfiletype = res.filetype;
          this.fileaction = false;
          this.HeaderdataService.settoaster("Support file uploaded successfully", 'success');
        } else if (this.fileUpload_support.status == 'error') {
          //this.error=res.message;
          this.fileuploadAction_support = false; this.fileaction = false;

          this.HeaderdataService.settoaster(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction_support = false;
        this.fileaction = false;
        this.HeaderdataService.settoaster("Something is wrong", 'warning');
      }
    );
  }
  onSubmitFileUpload_pdf() {
    this.reset();
    this.fileuploadAction_pdf = false;
    this.fileaction = false;
    this.fileUpload_pdf = { status: '',filetype: '', message: '', filePath: '', serverpath: "", pdf_path: "" };


    const formData_pdf = new FormData();
    formData_pdf.append("uploadingwhat", "" + "pdf");
    formData_pdf.append("filetype", "" + this.profileForm_pdf.get('profile_pdf').value.type);///new

    formData_pdf.append('profile', this.profileForm_pdf.get('profile_pdf').value);
    this.fileuploadAction_pdf = true; this.fileaction = true;
    this.fileUploadService.upload(formData_pdf, 'uploadfileAPI_for_video_module').subscribe(
      res => {
        this.fileuploadAction_pdf = false;


        this.fileUpload_pdf = res;
        if (this.fileUpload_pdf.status == 'success') {
          this.pdfpath = res.video_image_path;
          this.fileaction = false;
          this.HeaderdataService.settoaster("PDF uploaded successfully", 'success');
        } else if (this.fileUpload_pdf.status == 'error') {
          //this.error=res.message;
          this.fileuploadAction_pdf = false; this.fileaction = false;

          this.HeaderdataService.settoaster(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction_pdf = false;
        this.fileaction = false;
        this.HeaderdataService.settoaster("Something is wrong", 'warning');
      }
    );
  }




  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  getSubcourseByIdOfCourse() {


    if (this.videodata.course_id !== '' && this.videodata.course_id !== undefined) {


      this.CommonServiceService.getSubcourseByIdOfCourse(this.videodata.course_id).subscribe(res => {

        this.subcourseList = res;
        this.getTopicByIdOfCourse();

      });
    }
  }
  reset() {
    this.message = '';
    this.messageClass = '';
    this.messageClassIcon = '';
    this.saveaction = false;

  }
  resetvideodata() {
    this.videodata = { id: this.editingid, course_id: '', sub_course_id: "", details: '', title: '', active_status: 'Publish', topic_id: "" };
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



  saveVideo() {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }
    this.reset();
    this.fileuploadAction_support = false; this.fileuploadAction_pdf = false; this.fileuploadAction_img = false;
    this.fileuploadAction = false;


    if (this.videodata.title == '' || this.videodata.title == undefined) {


      this.createAlert('Please fill title field', 'warning');
      return false;
    }
    if (this.videodata.active_status == '' || this.videodata.active_status == undefined) {


      this.createAlert('Please fill Video Status field ', 'warning');
      return false;
    }
    if (this.videodata.course_id == '' || this.videodata.course_id == undefined) {


      this.createAlert('Please fill course field ', 'warning');
      return false;
    }
    if (this.videodata.sub_course_id == '' || this.videodata.sub_course_id == undefined) {


      this.createAlert('Please fill sub course field ', 'warning');
      return false;
    }
    if (this.videodata.topic_id == '' || this.videodata.topic_id == undefined) {


      this.createAlert('Please fill topic name field ', 'warning');
      return false;
    } else {
      for (var f = 0; f < this.topiclist.length; f++) {

        if (this.topiclist[f]._id == this.videodata.topic_id) {
          this.videodata.topic_name = this.topiclist[f].topic_name;
        }


      }
    }

    if (this.editingid == 0) {
      if (this.videopath == "" && this.pdfpath == "") {
        this.createAlert('Please upload video OR pdf ', 'warning');
        ///  return false;
      } if (this.imagepath == "") {
        this.createAlert('Please upload thumbnail ', 'warning');
        return false;
      }
      this.videodata.videopath = this.videopath;
      this.videodata.imagepath = this.imagepath;
      this.videodata.pdfpath = this.pdfpath;
      this.videodata.supportpath = this.supportpath;
    }

    else {
      if (this.videopath !== "") {
        this.videodata.videopath = this.videopath;

      } if (this.imagepath !== "") {
        this.videodata.imagepath = this.imagepath;
      }
      if (this.pdfpath !== "") {
        this.videodata.pdfpath = this.pdfpath;
      }
      if (this.supportpath !== "") {
        this.videodata.supportpath = this.supportpath;
      }
    }

    if (this.videoduration == 0) {
      if (this.editingid == 0) {
        if (this.videopath !== "") {
          this.createAlert('Contact admin, video duration is not there ', 'warning');
          return false;
        }
      }

    } else {
      this.videodata.videoduration = this.videoduration;

      this.videodata.videodurationHMS = new Date(this.videoduration * 1000).toISOString().substr(11, 8);
    }

    this.saveaction = true;
    this.CommonServiceService.saveVideo(this.videodata, this.editingid).subscribe(res => {
      this.saveaction = false;

      if (res.status == 'ERROR') {


        this.createAlert(res.message, 'warning');

      } else {
        this.createAlert(res.message, 'success');
        if (this.editingid == 0) {
          this.resetvideodata();
        } else {
  ///change

  this.startprocessifdeleteingpreviousfileorvideo();
  ///change end
        }


      }


    });

  }

  public startprocessifdeleteingpreviousfileorvideo() {
    ///change
     

    if (this.imagepathPrevious != this.videodata.imagepath) {
      this.CommonServiceService.deletefilefromserverNoMessage(this.serverpathPrevious, this.imagepathPrevious);
    }
    if (this.videopathPrevious != this.videodata.videopath) {
      this.CommonServiceService.deletefilefromserverNoMessage(this.serverpathPrevious, this.videopathPrevious);
    }
    if (this.pdfpathPrevious != this.videodata.pdfpath) {
      this.CommonServiceService.deletefilefromserverNoMessage(this.serverpathPrevious, this.pdfpathPrevious);
    }
    if (this.supportpathPrevious != this.videodata.supportpath) {
      this.CommonServiceService.deletefilefromserverNoMessage(this.serverpathPrevious, this.supportpathPrevious);
    }
    ///change end
  }
}
