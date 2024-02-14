


import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { FormBuilder, FormGroup, ControlContainer } from '@angular/forms';
import { FileUploadService } from '../file-upload.service';
@Component({
  selector: 'app-subcourse',
  templateUrl: './subcourse.component.html',
  styleUrls: ['./subcourse.component.css']
})
export class SubcourseComponent implements OnInit {
  searchform: boolean = false;
  enteringCouse: string; amount: number; duration: number;pre_amount: number;
  subjectcode: string;bonus_subject_id: string;
  teacher_email: string;
  wheretoshowinwebsite:string; 

  studentnumber: string;    sub_title:string;

  skilllevel: string;
  language: string;
  teacher_occupation: string;
  teacher_about: string;


  subjectstatus: string = '';
  certificate_type: string = '';
  message: string;
  enteringSubCouse: string;
  messageClass: string;
  describeArr: any;
  cardArr: any;
  modalObjData: any = {};
  messageClassIcon: string;
  editingid: any = 0;
  saveaction: boolean;
  showbackground: boolean = true;
  thumbnailpath: any = undefined;
  teacherimagepath: any = undefined;
  demovideopath: any = undefined;
  constructor(private fb: FormBuilder, private fileUploadService: FileUploadService, private HeaderdataService: HeaderdataService, private CommonServiceService: CommonServiceService) {
    this.enteringCouse = '';
    this.enteringSubCouse = '';

    this.CommonServiceService.getCourseList();
    this.CommonServiceService.getSubCourseList();
    this.resetDescribeArr();
  } scrollToDataDiv() {

    let el = (<HTMLInputElement>document.getElementById('datadiv'));

    el.scrollIntoView();
  }
  ngOnInit() {
    this.profileForm_img = this.fb.group({

      profile_img: ['']
    });

    this.profileForm_img_b = this.fb.group({

      profile_img_b: ['']
    });

    this.profileForm_img_th = this.fb.group({

      profile_img_th: ['']
    });
    this.profileForm_img_teacher = this.fb.group({

      profile_img_teacher: ['']
    });
    this.profileForm_img_th_v = this.fb.group({

      profile_img_th_v: ['']
    });
    this.profileForm_img_y = this.fb.group({

      profile_img_y: ['']
    });
  }
  reset() {
    this.message = '';
    this.messageClass = '';
    this.messageClassIcon = '';
    this.saveaction = false;
  }

  openModal(qObj, myModal) {

    this.modalObjData = qObj;
    console.log(this.modalObjData.question);
    myModal.style.display = "block";
  }
  closemodal(myModal) {

    myModal.style.display = "none";

  }
  imagepath: string = undefined;
  backgroundimagepath: string = undefined;
  instructor: string = undefined; rating: number = undefined;
  yourcourse_imagepath: string = undefined;
  fileaction: boolean = false;

  fileuploadAction_img: boolean;
  fileuploadAction_img_b: boolean; fileuploadAction_img_th: boolean; fileuploadAction_img_teacher: boolean; fileuploadAction_img_th_v: boolean;
  fileuploadAction_img_y: boolean;
  fileUpload_img = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };
  fileUpload_img_b = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };
  fileUpload_img_th = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };
  fileUpload_img_teacher = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };




  fileUpload_img_th_v = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };
  fileUpload_img_y = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };

  profileForm_img_b: FormGroup; profileForm_img_th: FormGroup; profileForm_img_teacher: FormGroup; profileForm_img_th_v: FormGroup;
  profileForm_img: FormGroup; profileForm_img_y: FormGroup;



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

  onSubmitFileUpload_img() {
    this.reset();
    this.fileuploadAction_img = false;
    this.fileaction = false;
    this.fileUpload_img = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };


    const formData_img = new FormData();
    formData_img.append("uploadingwhat", "" + "image");
    formData_img.append("isbackground", "" + "no"); formData_img.append("course_int", "" + this.course_int);
    formData_img.append('profile', this.profileForm_img.get('profile_img').value);
    formData_img.append("filetype", "" + this.profileForm_img.get('profile_img').value.type);///new

    this.fileuploadAction_img = true; this.fileaction = true;
    this.fileUploadService.upload(formData_img, 'uploadfileAPI_for_course_module').subscribe(
      res => {
        this.fileuploadAction_img = false;


        this.fileUpload_img = res;
        if (this.fileUpload_img.status == 'success') {
          this.imagepath = res.video_image_path;
          this.fileaction = false;
          this.HeaderdataService.settoaster("File uploaded successfully", 'success');
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



  ///


  onSelectedFile_img_y(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }
    console.log(event);
    if (event.target.files.length > 0) {
      const file_img_y = event.target.files[0];

      this.profileForm_img_y.get('profile_img_y').setValue(file_img_y);
      this.onSubmitFileUpload_img_y();
    }
  }

  onSubmitFileUpload_img_y() {
    this.reset();
    this.fileuploadAction_img_y = false;
    this.fileaction = false;
    this.fileUpload_img_y = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };


    const formData_img_y = new FormData();
    formData_img_y.append("uploadingwhat", "" + "image");
    formData_img_y.append("isbackground", "" + "no");
    formData_img_y.append("course_int", "" + this.course_int);
    formData_img_y.append('profile', this.profileForm_img_y.get('profile_img_y').value);
    formData_img_y.append("filetype", "" + this.profileForm_img_y.get('profile_img_y').value.type);///new

    this.fileuploadAction_img_y = true; this.fileaction = true;
    this.fileUploadService.upload(formData_img_y, 'uploadfileAPI_for_course_module').subscribe(
      res => {
        this.fileuploadAction_img_y = false;


        this.fileUpload_img_y = res;
        if (this.fileUpload_img_y.status == 'success') {
          this.yourcourse_imagepath = res.video_image_path;
          this.fileaction = false;
          this.HeaderdataService.settoaster("File uploaded successfully", 'success');
        } else if (this.fileUpload_img_y.status == 'error') {
          //this.error=res.message;
          this.fileuploadAction_img_y = false; this.fileaction = false;

          this.HeaderdataService.settoaster(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction_img_y = false;
        this.fileaction = false;
        this.HeaderdataService.settoaster("Something is wrong", 'warning');
      }
    );
  }
  ///
  onSelectedFile_img_b(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }
    console.log(event);
    if (event.target.files.length > 0) {
      const file_img_b = event.target.files[0];

      this.profileForm_img_b.get('profile_img_b').setValue(file_img_b);
      this.onSubmitFileUpload_img_b();
    }
  }

  onSubmitFileUpload_img_b() {
    this.reset();
    this.fileuploadAction_img_b = false;
    this.fileaction = false;
    this.fileUpload_img_b = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };


    const formData_img_b = new FormData();
    formData_img_b.append("uploadingwhat", "" + "image");
    formData_img_b.append("isbackground", "" + "yes");
    formData_img_b.append('profile', this.profileForm_img_b.get('profile_img_b').value);
    formData_img_b.append("filetype", "" + this.profileForm_img_b.get('profile_img_b').value.type);///new

    formData_img_b.append("course_int", "" + this.course_int);
    this.fileuploadAction_img_b = true; this.fileaction = true;
    this.fileUploadService.upload(formData_img_b, 'uploadfileAPI_for_course_module').subscribe(
      res => {
        this.fileuploadAction_img_b = false;


        this.fileUpload_img_b = res;
        if (this.fileUpload_img_b.status == 'success') {
          this.backgroundimagepath = res.video_image_path;
          this.fileaction = false;
          this.HeaderdataService.settoaster("File uploaded successfully", 'success');
        } else if (this.fileUpload_img_b.status == 'error') {
          //this.error=res.message;
          this.fileuploadAction_img_b = false; this.fileaction = false;

          this.HeaderdataService.settoaster(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction_img_b = false;
        this.fileaction = false;
        this.HeaderdataService.settoaster("Something is wrong", 'warning');
      }
    );
  }
  ///

  onSelectedFile_img_teacher(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }
    console.log(event);
    if (event.target.files.length > 0) {
      const file_img_teacher = event.target.files[0];

      this.profileForm_img_teacher.get('profile_img_teacher').setValue(file_img_teacher);
      this.onSubmitFileUpload_img_teacher();
    }
  }
  onSelectedFile_img_th(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }
    console.log(event);
    if (event.target.files.length > 0) {
      const file_img_th = event.target.files[0];

      this.profileForm_img_th.get('profile_img_th').setValue(file_img_th);
      this.onSubmitFileUpload_img_th();
    }
  }
  onSubmitFileUpload_img_teacher() {
    this.reset();
    this.fileuploadAction_img_teacher = false;
    this.fileaction = false;
    this.fileUpload_img_teacher = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };


    const formData_img_teacher = new FormData();
    formData_img_teacher.append("uploadingwhat", "" + "image");
    formData_img_teacher.append("isbackground", "" + "no");
    formData_img_teacher.append('profile', this.profileForm_img_teacher.get('profile_img_teacher').value);
    formData_img_teacher.append("course_int", "" + this.course_int);
    formData_img_teacher.append("filetype", "" + this.profileForm_img_teacher.get('profile_img_teacher').value.type);///new

    this.fileuploadAction_img_teacher = true; this.fileaction = true;
    this.fileUploadService.upload(formData_img_teacher, 'uploadfileAPI_for_course_module').subscribe(
      res => {
        this.fileuploadAction_img_teacher = false;


        this.fileUpload_img_teacher = res;
        if (this.fileUpload_img_teacher.status == 'success') {
          this.teacherimagepath = res.video_image_path;
          this.fileaction = false;
          this.HeaderdataService.settoaster("File uploaded successfully", 'success');
        } else if (this.fileUpload_img_teacher.status == 'error') {
          //this.error=res.message;
          this.fileuploadAction_img_teacher = false; this.fileaction = false;

          this.HeaderdataService.settoaster(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction_img_teacher = false;
        this.fileaction = false;
        this.HeaderdataService.settoaster("Something is wrong", 'warning');
      }
    );
  }
  onSubmitFileUpload_img_th() {
    this.reset();
    this.fileuploadAction_img_th = false;
    this.fileaction = false;
    this.fileUpload_img_th = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };


    const formData_img_th = new FormData();
    formData_img_th.append("uploadingwhat", "" + "image");
    formData_img_th.append("isbackground", "" + "no");
    formData_img_th.append('profile', this.profileForm_img_th.get('profile_img_th').value);
    formData_img_th.append("filetype", "" + this.profileForm_img_th.get('profile_img_th').value.type);///new

    formData_img_th.append("course_int", "" + this.course_int);
    this.fileuploadAction_img_th = true; this.fileaction = true;
    this.fileUploadService.upload(formData_img_th, 'uploadfileAPI_for_course_module').subscribe(
      res => {
        this.fileuploadAction_img_th = false;


        this.fileUpload_img_th = res;
        if (this.fileUpload_img_th.status == 'success') {
          this.thumbnailpath = res.video_image_path;
          this.fileaction = false;
          this.HeaderdataService.settoaster("File uploaded successfully", 'success');
        } else if (this.fileUpload_img_th.status == 'error') {
          //this.error=res.message;
          this.fileuploadAction_img_th = false; this.fileaction = false;

          this.HeaderdataService.settoaster(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction_img_th = false;
        this.fileaction = false;
        this.HeaderdataService.settoaster("Something is wrong", 'warning');
      }
    );
  }
  ///
  ///

  onSelectedFile_img_th_v(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }
    console.log(event);
    if (event.target.files.length > 0) {
      const file_img_th_v = event.target.files[0];

      this.profileForm_img_th_v.get('profile_img_th_v').setValue(file_img_th_v);
      this.onSubmitFileUpload_img_th_v();
    }
  }

  onSubmitFileUpload_img_th_v() {
    this.reset();
    this.fileuploadAction_img_th_v = false;
    this.fileaction = false;
    this.fileUpload_img_th_v = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };


    const formData_img_th_v = new FormData();
    formData_img_th_v.append("uploadingwhat", "" + "video");
    formData_img_th_v.append("isbackground", "" + "no");
    formData_img_th_v.append("filetype", "" + this.profileForm_img_th_v.get('profile_img_th_v').value.type);///new

    formData_img_th_v.append('profile', this.profileForm_img_th_v.get('profile_img_th_v').value);
    formData_img_th_v.append("course_int", "" + this.course_int);
    this.fileuploadAction_img_th_v = true; this.fileaction = true;
    this.fileUploadService.upload(formData_img_th_v, 'uploadfileAPI_for_course_module').subscribe(
      res => {
        this.fileuploadAction_img_th_v = false;


        this.fileUpload_img_th_v = res;
        if (this.fileUpload_img_th_v.status == 'success') {
          this.demovideopath = res.video_image_path;
          this.fileaction = false;
          this.HeaderdataService.settoaster("File uploaded successfully", 'success');
        } else if (this.fileUpload_img_th_v.status == 'error') {
          //this.error=res.message;
          this.fileuploadAction_img_th_v = false; this.fileaction = false;

          this.HeaderdataService.settoaster(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction_img_th_v = false;
        this.fileaction = false;
        this.HeaderdataService.settoaster("Something is wrong", 'warning');
      }
    );
  }
  ///
  resetDescribeArr() {
    this.describeArr = [];
    var perHeadingObj = { "headingvalue": "", "accordian": false, "checkbox": "", "card": false, "showingpoint": false, pointsArr: [{ "pointvalue": "", "pointvalueArr": [], "ischip": false, "iconApply": '' }, { "pointvalue": "", "pointvalueArr": [], "ischip": false, "iconApply": '' }, { "pointvalue": "", "pointvalueArr": [], "ischip": false, "iconApply": '' }] };
    this.describeArr.push(perHeadingObj);

  }
  breakintowords(objPoint, headingindex, pointindex) {

    if (objPoint.pointvalue != '' && objPoint.pointvalue != undefined) {
      var str = objPoint.pointvalue;

      var word_array = [];
      var res = str.split(" ");
      for (var t = 0; t < res.length; t++) {
        if (res[t] != '') {
          word_array.push({ "perword": res[t] });
        }

      }
      objPoint.pointvalueArr = word_array;
    }


  }
  addmoreheading() {
    var perHeadingObj = {
      "headingvalue": "", "accordian": false, "checkbox": "", "card": false, "showingpoint": false, pointsArr: [
        { "pointvalue": "", "pointvalueArr": [], "ischip": false, "iconApply": '' }, { "pointvalue": "", "pointvalueArr": [], "ischip": false, "iconApply": '' }, { "pointvalue": "", "pointvalueArr": [], "ischip": false, "iconApply": '' }]
    };
    this.describeArr.push(perHeadingObj);
  }
  addmorepoints(index) {

    this.describeArr[index].pointsArr.push({ "pointvalue": "", "pointvalueArr": [], "ischip": false, "iconApply": '' });
  }


  saveCourse() { 
    this.reset();
    if (this.enteringCouse == '' || this.enteringCouse == undefined) {
      this.message = 'Please Enter Course Name !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.enteringSubCouse == '' || this.enteringSubCouse == undefined) {
      this.message = 'Please Enter Sub Course Name !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.instructor == '' || this.instructor == undefined) {
      this.message = 'Please Enter instructor Name !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.rating == 0 || this.rating == undefined) {
      this.message = 'Please Enter rating   !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.amount == 0 || this.amount == undefined) {
      this.message = 'Please Enter Course Fee  !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.subjectcode == '' || this.subjectcode == undefined) {
      this.message = 'Please Enter Course Code  !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.subjectstatus == '' || this.subjectstatus == undefined) {
      this.message = 'Please Enter Course Status  !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.certificate_type == '' || this.certificate_type == undefined) {
      this.message = 'Please Select Certificate Type  !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.duration == 0 || this.duration == undefined) {
      this.message = 'Please Enter Course Duration !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.duration_type == '' || this.duration_type == undefined) {
      this.message = 'Please Select Course Duration Type !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.is_self_paced == '' || this.is_self_paced == undefined) {
      this.message = 'Is it Self Paced !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else if (this.editingid != 0 && (this.showbackground == null || this.showbackground == undefined)) {
      this.message = 'Do you want to show background image !';
      this.messageClass = 'warning';
      this.messageClassIcon = 'warning';
    } else {
      if (this.rating !== undefined) {
        this.rating = +this.rating;
        if (Number.isNaN(this.rating)) {
          this.message = 'rating number must be number !';
          this.messageClass = 'warning';
          this.messageClassIcon = 'warning';
          return false;
        }
      }
      if (this.duration !== undefined) {

        this.duration = +this.duration;
        if (Number.isInteger(this.duration)) {

          if (this.duration < 1) {

            this.message = 'Duration number must be more than 0 !';
            this.messageClass = 'warning';
            this.messageClassIcon = 'warning';

          } else {
            if (this.amount !== undefined) {

              this.amount = +this.amount;


              if (Number.isNaN(this.amount)) {
                this.message = 'Fee amount must be number !';
                this.messageClass = 'warning';
                this.messageClassIcon = 'warning';

              } else {
                if (this.amount < 1) {

                  this.message = 'Fee must be more than 0 !';
                  this.messageClass = 'warning';
                  this.messageClassIcon = 'warning';

                } else {

                 

                  if (this.pre_amount !== undefined && this.pre_amount!=null && this.pre_amount>0) {

                    console.log("1"+this.pre_amount);
                    if (Number.isNaN(this.pre_amount)) {
                      this.message = 'Fee previous amount must be number !';
                      this.messageClass = 'warning';
                      this.messageClassIcon = 'warning';  console.log("3"+this.pre_amount);
                      return false;
                    }else{
                      console.log("2"+this.pre_amount);
                      if (this.amount >= this.pre_amount) {
                        console.log("4"+this.pre_amount);
                        this.message = 'Fee previous amount must be more than current amount !';
                        this.messageClass = 'warning';
                        this.messageClassIcon = 'warning';
                        return false;
      
                      } 
                    }
                  }
                  this.saveaction = true;
                  if (this.is_self_paced == 'true') {
                    var is_self_paced = true;
                  } else {
                    var is_self_paced = false;
                  }
                  this.CommonServiceService.saveSubCourse(this.wheretoshowinwebsite, this.pre_amount,this.studentnumber,this.sub_title,
                    this.skilllevel,
                    this.language, this.teacher_email, this.teacher_occupation, this.teacher_about, this.rating, this.thumbnailpath, this.teacherimagepath, this.demovideopath, this.showbackground, this.cardArr, this.backgroundimagepath, this.instructor, this.yourcourse_imagepath, this.imagepath, this.describeArr, this.amount, this.subjectstatus, this.certificate_type, this.subjectcode, this.bonus_subject_id,this.duration, this.duration_type, is_self_paced, this.enteringSubCouse, this.enteringCouse, this.editingid).subscribe(res => {
                      this.saveaction = false;
                      if (res.status == 'ERROR') {


                        this.message = res.message;
                        this.messageClass = 'warning';
                        this.messageClassIcon = 'warning';


                      } else {
                        this.CommonServiceService.getSubCourseList();
                        if (this.editingid == 0) {
                          this.message = 'Sub Course Added Successfully ! ';
                        } else {
                          this.message = 'Sub Course Edited Successfully ! ';
                        }

                        this.messageClass = 'success';
                        this.messageClassIcon = 'check-circle';
                        if (this.editingid == 0) {
                          this.backtoempty();
                        }
                      }


                    });

                }

              }

            }
          }
        } else {

          this.message = 'Duration number must be integer !';
          this.messageClass = 'warning';
          this.messageClassIcon = 'warning';
        }

      }





      //  get new couses list toether is response and upate in common servce
    }



  }

  backtoempty() {
    this.enteringCouse = '';
    this.enteringSubCouse = '';
    this.duration = undefined; this.duration_type = ''; this.is_self_paced = '';
    this.cardArr = [];
    this.subjectcode = this.subjectstatus = this.certificate_type =this. bonus_subject_id='';
    this.amount =this.pre_amount= undefined; this.imagepath = undefined; this.demovideopath = this.thumbnailpath = this.teacherimagepath = this.backgroundimagepath = this.instructor = ''; this.rating = undefined; this.yourcourse_imagepath = undefined;
    this.editingid = 0;
    this.showbackground = true;
    this.teacher_email = undefined; this.teacher_occupation = undefined; this.teacher_about = undefined;
    this.wheretoshowinwebsite= undefined;
    this.studentnumber= undefined; this.sub_title=undefined;
    this.skilllevel= undefined; 
    this.language= undefined; 
    this.resetDescribeArr();
  }
  course_int: number = 0;
  is_self_paced: string = '';
  duration_type: string = '';
  removeDemoVideo(obj) {

    this.clickedEditButton(obj);

    this.demovideopath = this.thumbnailpath = undefined;
    this.saveCourse();
  }
  clickedEditButton(obj) {
    this.enteringCouse = obj.parent_course;
    this.enteringSubCouse = obj.course_name;
    this.amount = obj.amount;
    this.pre_amount=obj.pre_amount;
    this.imagepath = obj.imagepath; this.yourcourse_imagepath = obj.yourcourse_imagepath;
    this.demovideopath = obj.demovideopath; this.teacherimagepath = obj.teacherimagepath; this.thumbnailpath = obj.thumbnailpath; this.backgroundimagepath = obj.backgroundimagepath; this.showbackground = obj.showbackground;
    this.instructor = obj.instructor; this.rating = obj.rating;
    this.bonus_subject_id = obj.bonus_subject_id; this.subjectcode = obj.subjectcode;
    
    this.teacher_email = obj.teacher_email; this.teacher_occupation = obj.teacher_occupation; this.teacher_about = obj.teacher_about;
    this.wheretoshowinwebsite= obj.wheretoshowinwebsite;  


    this.studentnumber= obj.studentnumber; 
    this.sub_title=obj.sub_title;
    this.skilllevel= obj.skilllevel; 
    this.language= obj.language;

    this.cardArr = obj.cardArr;
    this.duration = obj.duration;
    if (obj.is_self_paced) {
      this.is_self_paced = 'true';
    } else {
      this.is_self_paced = 'false';
    }

    this.duration_type = obj.duration_type;
    this.certificate_type = obj.certificate_type;

    this.subjectstatus = obj.subjectstatus;
    this.course_int = obj.course_int;


    // if (obj.describeArr) {
    //   // obj.describeArr;
    //   this.describeArr = [];
    //   var perHeadingObj = { "headingvalue": "", "accordian": false, "checkbox": "", "card": false, "showingpoint": false, pointsArr: [{ "pointvalue": "", "pointvalueArr": [] }, { "pointvalue": "", "pointvalueArr": [] }, { "pointvalue": "", "pointvalueArr": [] }] };
    //   this.describeArr.push(perHeadingObj);
    //   for (var d = 0; d < obj.describeArr.length; d++) {
    //     this.describeArr.push(obj.describeArr[d]);
    //   }
    // }
    if (obj.describeArr) {
      this.describeArr = obj.describeArr;
    }
    else {
      this.describeArr = [];
      var perHeadingObj = { "headingvalue": "", "accordian": false, "checkbox": "", "card": false, "showingpoint": false, pointsArr: [{ "pointvalue": "", "pointvalueArr": [], "ischip": false, "iconApply": '' }, { "pointvalue": "", "pointvalueArr": [], "ischip": false, "iconApply": '' }, { "pointvalue": "", "pointvalueArr": [], "ischip": false, "iconApply": '' }] };
      this.describeArr.push(perHeadingObj);
    }
    this.editingid = obj._id;
    this.reset();
  }
  deleteCourse(obj) {
    if (confirm('Are you sure you want to delete this sub course !')) {

      this.CommonServiceService.deleteSubcourse(obj).subscribe(res => {


        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster("Sub Course " + obj.course_name + " deleted successfully !", 'success');

          this.CommonServiceService.getSubCourseList();
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });

    }
  }

}


