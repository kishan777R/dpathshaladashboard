



import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
import { HeaderdataService } from '../headerdata.service';
import { FormBuilder, FormGroup, ControlContainer } from '@angular/forms';
import { FileUploadService } from '../file-upload.service';

import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-addtutorial',
  templateUrl: './addtutorial.component.html',
  styleUrls: ['./addtutorial.component.css']
})
export class AddtutorialComponent implements OnInit {



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
  questiondata: any;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  editingid: number = 0;
  describeArr: any;
  saveaction: boolean;
  functioningonwhat: string;
  private sub: any;
  fileaction: boolean;
  fileUpload_img = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };
  profileForm_img: FormGroup;
  fileuploadAction_img: boolean;



  fileUpload_img_thumb = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };
  profileForm_img_thumb: FormGroup;
  fileuploadAction_img_thumb: boolean;





  subcourseList: any;
  uploadingwhat: string = '';
  screennumber: any = '';
  pdfname: any = ''; videoname: any = ''; audioname: any = ''; imagename: any = '';
  videoclass: string = '';
  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private fileUploadService: FileUploadService, private HeaderdataService: HeaderdataService, private CommonServiceService: CommonServiceService) {
    this.CommonServiceService.getCourseList();


    this.sub = this.route.params.subscribe(params => {
      this.editingid = params['tid']; // (+) converts string 'id' to a number

      if (this.editingid == 0) {
        this.resetquestiondata();
        this.functioningonwhat = "tutorial";

      } else if (this.editingid == -2) {
        this.functioningonwhat = "introduction";

        this.CommonServiceService.getTutorial_byid(this.functioningonwhat).subscribe(res => {


          if (res) {
            this.questiondata = res;
          } else {
            this.resetquestiondata();
          }
        });
      } else {
        this.functioningonwhat = "tutorial";
        this.CommonServiceService.getTutorial_byid(this.editingid).subscribe(res => {

          this.questiondata = res;
          this.getSubcourseByIdOfCourse();
        });

      }
    });


  }

  ngOnInit() {
    this.profileForm_img = this.fb.group({

      profile_img: ['']
    });
    this.profileForm_img_thumb = this.fb.group({

      profile_img_thumb: ['']
    });


  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  //

  onSelectedFile_img_thumb(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }


    if (event.target.files.length > 0) {
      const file_img_thumb = event.target.files[0];

      this.profileForm_img_thumb.get('profile_img_thumb').setValue(file_img_thumb);
      this.onSubmitFileUpload_img_thumb();
    }
  }

  onSelectedFile_img(event) {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }



    if (this.uploadingwhat == '') {
      alert("Select  what type of file you are uploading ");
      return false;
    }
    if (this.screennumber == '') {
      alert("Select Screen number");
      return false;
    }
    if (this.uploadingwhat == 'pdf') {
      if (this.pdfname == '') {

        // alert("Fill PDF Title ");
        // return false;
      }
    }
    if (this.uploadingwhat == 'video') {
      if (this.videoname == '') {

        // alert("Fill Video Title ");
        // return false;
      }
      if (this.videoclass == '') {
        alert("Fill Video Style ");
        return false;
      }
    }
    if (this.uploadingwhat == 'audio') {
      if (this.audioname == '') {

        //  alert("Fill audio title ");
        //  return false;
      }
    }
    if (this.uploadingwhat == 'image') {
      if (this.imagename == '') {

        //alert("Fill image title ");
        // return false;
      }
    }
    console.log(event);
    if (event.target.files.length > 0) {
      const file_img = event.target.files[0];

      this.profileForm_img.get('profile_img').setValue(file_img);
      this.onSubmitFileUpload_img();
    }
  }

  onSubmitFileUpload_img_thumb() {
    this.reset();
    this.fileuploadAction_img_thumb = false;
    this.fileaction = false;
    this.fileUpload_img_thumb = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };


    const formData_img_thumb = new FormData();
    formData_img_thumb.append("uploadingwhat", "image");
    formData_img_thumb.append("filetype", "" + this.profileForm_img_thumb.get('profile_img_thumb').value.type);///new

    formData_img_thumb.append('profile', this.profileForm_img_thumb.get('profile_img_thumb').value);
    this.fileuploadAction_img_thumb = true; this.fileaction = true;
    this.fileUploadService.upload(formData_img_thumb, 'uploadfileAPI_for_tutorial_module').subscribe(
      res => {
        this.fileuploadAction_img_thumb = false;


        this.fileUpload_img_thumb = res;
        if (this.fileUpload_img_thumb.status == 'success') {

          this.questiondata.describeArr[this.screennumber][0].videothumbnailserver = res.serverpath;
          this.questiondata.describeArr[this.screennumber][0].videothumbnailpath = res.video_image_path;



          this.fileaction = false;

          this.HeaderdataService.settoaster("Thumbnail File uploaded successfully", 'success');
        } else if (this.fileUpload_img_thumb.status == 'error') {
          //this.error=res.message;
          this.fileuploadAction_img_thumb = false; this.fileaction = false;

          this.HeaderdataService.settoaster(res.message, 'warning');
        }
      },
      err => {
        //this.error = err;
        this.fileuploadAction_img_thumb = false;
        this.fileaction = false;
        this.HeaderdataService.settoaster("Something is wrong", 'warning');
      }
    );
  }

  onSubmitFileUpload_img() {
    this.reset();
    this.fileuploadAction_img = false;
    this.fileaction = false;
    this.fileUpload_img = { status: '', message: '', filePath: '', serverpath: "", image_path: "" };


    const formData_img = new FormData();
    formData_img.append("uploadingwhat", "" + this.uploadingwhat); 
    
    formData_img.append("filetype", "" + this.profileForm_img.get('profile_img').value.type);///new
 
    formData_img.append('profile', this.profileForm_img.get('profile_img').value);
    this.fileuploadAction_img = true; this.fileaction = true;
    this.fileUploadService.upload(formData_img, 'uploadfileAPI_for_tutorial_module').subscribe(
      res => {
        this.fileuploadAction_img = false;


        this.fileUpload_img = res;
        if (this.fileUpload_img.status == 'success') {
          // note  because of shortage of time... uploaded files are adding in first heading of ech screen
          if (this.uploadingwhat == 'pdf') {
            this.questiondata.describeArr[this.screennumber][0].pdfserver = res.serverpath;
            this.questiondata.describeArr[this.screennumber][0].pdfpath = res.video_image_path;
            this.questiondata.describeArr[this.screennumber][0].pdfname = this.pdfname;

          } else if (this.uploadingwhat == 'image') {
            this.questiondata.describeArr[this.screennumber][0].imageserver = res.serverpath;
            this.questiondata.describeArr[this.screennumber][0].imagepath = res.video_image_path;
            this.questiondata.describeArr[this.screennumber][0].imagename = this.imagename;

          } else if (this.uploadingwhat == 'audio') {
            this.questiondata.describeArr[this.screennumber][0].audioserver = res.serverpath;
            this.questiondata.describeArr[this.screennumber][0].audiopath = res.video_image_path;
            this.questiondata.describeArr[this.screennumber][0].audioname = this.audioname;

          } else if (this.uploadingwhat == 'video') {
            this.questiondata.describeArr[this.screennumber][0].videoserver = res.serverpath;
            this.questiondata.describeArr[this.screennumber][0].videopath = res.video_image_path;
            this.questiondata.describeArr[this.screennumber][0].videoname = this.videoname;
            this.questiondata.describeArr[this.screennumber][0].videoclass = this.videoclass;

          }
          this.fileaction = false;
          console.log(this.questiondata.describeArr[this.screennumber]);
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

  isfileEditing: boolean = false;

  saveEdting() {
    if (this.fileaction) {
      alert("Wait other action is in progress..");
      return false;
    }



    if (this.uploadingwhat == '') {
      alert("Select  what type of file you are uploading ");
      return false;
    }
    if (this.screennumber == '' && this.screennumber != 0) {
      alert("Select Screen number");


      return false;
    }

    if (this.uploadingwhat == 'video') {

      if (this.videoclass == '') {
        alert("Fill Video Style ");
        return false;
      }
    }
    if (this.uploadingwhat == 'pdf') {

      this.questiondata.describeArr[this.screennumber][0].pdfname = this.pdfname;

    } else if (this.uploadingwhat == 'image') {

      this.questiondata.describeArr[this.screennumber][0].imagename = this.imagename;

    } else if (this.uploadingwhat == 'audio') {

      this.questiondata.describeArr[this.screennumber][0].audioname = this.audioname;

    } else if (this.uploadingwhat == 'video') {

      this.questiondata.describeArr[this.screennumber][0].videoname = this.videoname;
      this.questiondata.describeArr[this.screennumber][0].videoclass = this.videoclass;

    }
    this.scrollToDataDiv('filepanel' + this.screennumber);

    this.pdfname = this.imagename = this.audioname = this.screennumber = this.uploadingwhat = this.videoclass = '';
    this.isfileEditing = false;
  }
  editFile(editingwhat, indexofscreen) {


    this.isfileEditing = true;
    this.uploadingwhat = editingwhat; this.screennumber = indexofscreen;

    if (editingwhat == 'pdf') {
      this.pdfname = this.questiondata.describeArr[this.screennumber][0].pdfname;
    }
    if (editingwhat == 'image') {
      this.imagename = this.questiondata.describeArr[this.screennumber][0].imagename;

    }
    if (editingwhat == 'audio') {
      this.audioname = this.questiondata.describeArr[this.screennumber][0].audioname;

    }
    if (editingwhat == 'video') {
      this.videoname = this.questiondata.describeArr[this.screennumber][0].videoname;
      this.videoclass = this.questiondata.describeArr[this.screennumber][0].videoclass;

    }
    this.scrollToDataDiv('datadiv');

  }
  scrollToDataDiv(id) {

    let el = (<HTMLInputElement>document.getElementById(id));

    el.scrollIntoView();
  }
  removeFile(removingwhat, indexofscreen) {
    if (removingwhat == 'pdf') {
      this.questiondata.describeArr[indexofscreen][0].pdfserver = '';
      this.questiondata.describeArr[indexofscreen][0].pdfpath = '';
      this.questiondata.describeArr[indexofscreen][0].pdfname = '';

    } else if (removingwhat == 'image') {
      this.questiondata.describeArr[indexofscreen][0].imageserver = '';
      this.questiondata.describeArr[indexofscreen][0].imagepath = '';
      this.questiondata.describeArr[indexofscreen][0].imagename = '';
    } else if (removingwhat == 'audio') {
      this.questiondata.describeArr[indexofscreen][0].audioserver = '';
      this.questiondata.describeArr[indexofscreen][0].audiopath = '';
      this.questiondata.describeArr[indexofscreen][0].audioname = '';
    } else if (removingwhat == 'video') {
      this.questiondata.describeArr[indexofscreen][0].videoserver = '';
      this.questiondata.describeArr[indexofscreen][0].videopath = '';
      this.questiondata.describeArr[indexofscreen][0].videothumbnailserver = '';
      this.questiondata.describeArr[indexofscreen][0].videothumbnailpath = '';
      this.questiondata.describeArr[indexofscreen][0].videoname = '';
      this.questiondata.describeArr[indexofscreen][0].videoclass = '';


    }
  }

  ///

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
  }


  resetquestiondata() {
    this.describeArr = [];
    var screenObjectArr = [];
    var pointsArr = { "pointvalue": "", "pointvalue_language": "english", "is_example": false, "word_array": [], "colored_word_array": [] };

    var perHeadingObj = { "max_mark": 10, "do_need_to_speek_by_system": true, "content_when_we_do_not_need_speeker": '', "screen_position": "Before", "is_it_normal_flow_screen": true, "what_type_of_screen_if_not_normal_flow": "", "passageOrVocabluryUniqueCode": "", "imagepath": "", "imageserver": "", "audiopath": "", "audioserver": "", "videothumbnailserver": "", "videothumbnailpath": "", "videoserver": "", "videopath": "", "pdfname": "", "videoclass": '', "videoname": "", "audioname": "", "imagename": "", "pdfpath": "", "pdfserver": "", "headingvalue": "", "headingvalue_language": "english", pointsArr: [pointsArr] };
    screenObjectArr.push(perHeadingObj);
    this.describeArr.push(screenObjectArr);
    this.questiondata = {
      id: this.editingid,
      course_id: '',
      sub_course_id: "",
      topic: '', day_number: '',
      describeArr: this.describeArr
    };
  }

  breakintowords(objPoint, screenIndex, headingindex, pointindex) {

    if (objPoint.pointvalue != '' && objPoint.pointvalue != undefined) {
      var str = objPoint.pointvalue;

      var word_array = [];
      var res = str.split(" ");
      for (var t = 0; t < res.length; t++) {
        if (res[t] != '') {
          word_array.push({ "perword": res[t] });
        }

      }
      objPoint.word_array = word_array;
    }


  }
  removeScreen(index) {
    var tmp = [];

    for (var t = 0; t < this.questiondata.describeArr.length; t++) {
      if (index != t) {
        tmp.push(this.questiondata.describeArr[t]);
      }

    }
    this.questiondata.describeArr = tmp;
  }
  addmoreScreen(where) {
    var screenObjectArr = [];
    var pointsArr = { "pointvalue": "", "pointvalue_language": "english", "is_example": false, "word_array": [], "colored_word_array": [] };

    var perHeadingObj = { "max_mark": 10, "do_need_to_speek_by_system": true, "content_when_we_do_not_need_speeker": '', "screen_position": "Before", "is_it_normal_flow_screen": true, "what_type_of_screen_if_not_normal_flow": "", "passageOrVocabluryUniqueCode": "", "imagepath": "", "imageserver": "", "audiopath": "", "audioserver": "", "videothumbnailserver": "", "videothumbnailpath": "", "videoserver": "", "videopath": "", "pdfname": "", "videoclass": '', "videoname": "", "audioname": "", "imagename": "", "pdfpath": "", "pdfserver": "", "headingvalue": "", "headingvalue_language": "english", pointsArr: [pointsArr] };
    screenObjectArr.push(perHeadingObj);
    if (where == "last") {
      this.questiondata.describeArr.push(screenObjectArr);

    } else {
      var tmp = [];
      tmp.push(screenObjectArr);
      for (var t = 0; t < this.questiondata.describeArr.length; t++) {
        tmp.push(this.questiondata.describeArr[t]);
      }
      this.questiondata.describeArr = tmp;
    }
  }
  addmoreheading(screenIndex) {
    var pointsArr = { "pointvalue": "", "pointvalue_language": "english", "is_example": false, "word_array": [], "colored_word_array": [] };

    var perHeadingObj = { "max_mark": 10, "do_need_to_speek_by_system": true, "content_when_we_do_not_need_speeker": '', "screen_position": "Before", "is_it_normal_flow_screen": true, "what_type_of_screen_if_not_normal_flow": "", "passageOrVocabluryUniqueCode": "", "imagepath": "", "imageserver": "", "audiopath": "", "audioserver": "", "videothumbnailserver": "", "videothumbnailpath": "", "videoserver": "", "videopath": "", "pdfname": "", "videoclass": '', "videoname": "", "audioname": "", "imagename": "", "pdfpath": "", "pdfserver": "", "headingvalue": "", "headingvalue_language": "english", pointsArr: [pointsArr] };
    this.questiondata.describeArr[screenIndex].push(perHeadingObj);
  }
  addmorepoints(screenIndex, headingindex) {
    var pointsArr = { "pointvalue": "", "pointvalue_language": "english", "is_example": false, "word_array": [], "colored_word_array": [] };

    this.questiondata.describeArr[screenIndex][headingindex].pointsArr.push(pointsArr);
  }
  addmorepoint_after_this_line(screenIndex, headingindex, pointindex) {
    var pointsArr = { "pointvalue": "", "pointvalue_language": "english", "is_example": false, "word_array": [], "colored_word_array": [] };
    const items = this.questiondata.describeArr[screenIndex][headingindex].pointsArr;
    const insert = (arr, index, newItem) => [
      // part of the array before the specified index
      ...arr.slice(0, index),
      // inserted item
      newItem,
      // part of the array after the specified index
      ...arr.slice(index)
    ]
    this.questiondata.describeArr[screenIndex][headingindex].pointsArr = insert(items, pointindex + 1, pointsArr);
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

  saveTutorial() {

    this.reset();

    if (this.functioningonwhat != "introduction") {


      if (this.questiondata.course_id == '' || this.questiondata.course_id == undefined) {


        this.createAlert('Please fill course field ', 'warning');
        return false;
      } if (this.questiondata.sub_course_id == '' || this.questiondata.sub_course_id == undefined) {


        this.createAlert('Please fill sub course field ', 'warning');
        return false;
      }
      if (this.questiondata.topic == '' || this.questiondata.topic == undefined) {


        this.createAlert('Please fill topic field ', 'warning');
        return false;
      }

      if (this.questiondata.day_number == '' || this.questiondata.day_number == undefined) {


        this.createAlert('Please fill day number field ', 'warning');
        return false;
      }

      if (this.questiondata.day_number !== '' && this.questiondata.day_number !== undefined) {

        this.questiondata.day_number = +this.questiondata.day_number;
        if (Number.isNaN(this.questiondata.day_number)) {
          this.createAlert('Day number must be a number ', 'warning');
          return false;

        } else {


          if (this.questiondata.day_number < 1) {


            this.createAlert('Day number must be more than 0', 'warning');
            return false;
          }
        }
      }
    }
    if (this.functioningonwhat == "introduction") {
      this.questiondata.topic = "Introduction";


    }
    var finalDescribe = [];
    for (var t = 0; t < this.questiondata.describeArr.length; t++) {
      var caninclde = false;
      var perHeadingObj = {
        "max_mark": 10, "do_need_to_speek_by_system": true, "content_when_we_do_not_need_speeker": '',
        "screen_position": "Before",
        "is_it_normal_flow_screen": true,
        "what_type_of_screen_if_not_normal_flow": "",
        "passageOrVocabluryUniqueCode": "",
        "imagepath": "", "imageserver": "", "audiopath": "", "audioserver": "",
        "videothumbnailserver": "", "videothumbnailpath": "", "videoserver": "", "videopath": "",
        "pdfname": "", "videoclass": '', "videoname": "", "audioname": "", "imagename": "",
        "pdfpath": "", "pdfserver": "", "headingvalue": "", "headingvalue_language": "english", pointsArr: []
      };

      
        if ( (this.questiondata.describeArr[t][0].is_it_normal_flow_screen || this.questiondata.describeArr[t][0].what_type_of_screen_if_not_normal_flow=='Notes') 
          &&
          (this.questiondata.describeArr[t][0].imagepath != '' || this.questiondata.describeArr[t][0].pdfpath != '' || this.questiondata.describeArr[t][0].videopath != '' || this.questiondata.describeArr[t][0].audiopath != '')
          ) {
          caninclde = true;
        } else {
          if (this.questiondata.describeArr[t][0].do_need_to_speek_by_system == true) {
            for (var i_for_inside_screen = 0; i_for_inside_screen < this.questiondata.describeArr[t].length; i_for_inside_screen++) {
              var perscreenPerHeadingobjhere = this.questiondata.describeArr[t][i_for_inside_screen];
              if (perscreenPerHeadingobjhere.headingvalue != '') {
                caninclde = true;
              } else {
                for (var i_for_inside_screen_inside_point = 0; i_for_inside_screen_inside_point < perscreenPerHeadingobjhere.pointsArr.length; i_for_inside_screen_inside_point++) {

                  if (perscreenPerHeadingobjhere.pointsArr[i_for_inside_screen_inside_point].pointvalue != '') {
                    caninclde = true;
                  }

                }

              }

            }
          } else {
            if (this.questiondata.describeArr[t][0].content_when_we_do_not_need_speeker != '') {
              caninclde = true;
            }

          }
        }
        if(caninclde){
          finalDescribe.push(this.questiondata.describeArr[t]);
        }
       
    }
    this.questiondata.describeArr= finalDescribe;


    for (var t = 0; t < this.questiondata.describeArr.length; t++) {
      var d = new Date();
      var newUniqueId = this.questiondata.day_number + '' + d.getTime() + "" + t;
      this.questiondata.describeArr[t][0].passageOrVocabluryUniqueCode = newUniqueId;
    }



    this.saveaction = true;
    this.CommonServiceService.saveTutorial(this.questiondata, this.editingid).subscribe(res => {
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
