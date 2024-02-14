


import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-submitted-answer-by-client',
  templateUrl: './submitted-answer-by-client.component.html',
  styleUrls: ['./submitted-answer-by-client.component.css']
})
export class SubmittedAnswerByClientComponent implements OnInit {



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
  searchform: boolean = false;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  submittedAnswerList: any;
  subcourseList: any;
  courseListforthisModule: any = [];
  subcourseListcanBe: any;
  courseListforthisModule_perclient: any;

  modalObjData: any = {};
  clientdataList: any = [];
  from_min_date: any = "";

  to_max_date: any = '';
  private sub: any;
  review_statusFromURL; any;

  throttle = 300;  // infinescroll
  scrollDistance = 1;  // infinescroll
  scrollUpDistance = 2;  // infinescroll
  limitInOneTime: number = 10;// infinescroll
  skipDocument: number = 0;// infinescroll
  totalRecord: number = 0;// infinescroll
  searchedFunctionClick: boolean = false;// infinescroll
  infinescrollerstatus: boolean = false;//infinescroll
  column: any;
  value: any;
  constructor(private route: ActivatedRoute, private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService) {
    this.sub = this.route.params.subscribe(params => {

      this.value = params['value'];
      if (this.value == 'ALL') {
        this.review_statusFromURL = '';
      } else {
        this.review_statusFromURL = this.value;
      }


    });

  }

  scrollToDataDiv() {

    let el = (<HTMLInputElement>document.getElementById('datadiv'));

    el.scrollIntoView();
  }

  ngOnInit() {

    this.resetquestiondata();
    this.submittedAnswerList_search('startagain');
    this.getClientList();
    this.getCourseList();
    this.CommonServiceService.getSubCourseList();



  }
  convertIntoColoredvalue(objofpoint_per, word) {
    for (var t = 0; t < objofpoint_per.colored_word_array.length; t++) {
      if (objofpoint_per.colored_word_array[t] == word) {
        return "green";
      }
    }
    return "";
  }
  deleteSubmittedAnswer() {
    if (this.questiondata.c_id !== '' && this.questiondata.c_id !== undefined) {


      this.searchaction = true;

      this.CommonServiceService.deleteSubmittedAnswer(this.questiondata.c_id).subscribe(res => {
        this.searchaction = false;
        if (res.status == 'SUCCESS') {
          this.submittedAnswerList_search('startagain');
        } else {
          this.createAlert(res.message, 'warning');
          return false;
        }


      })
    }
    else {
      this.createAlert('Select Client', 'warning');
      return false;
    }


  }
  maxmarkofpassage: number = 0;
  obtainedmarkofpassage: number = 0;
  showingwhatinmodal: any;
  rowinmodal: number;
  modalerror: any = '';
  modalsuccess: any = '';
  openModal(qObj, myModal, showingwhatinmodal, i) {
    this.maxmarkofpassage = 0;
    this.rowinmodal = i;
    this.modalObjData = qObj;

    this.showingwhatinmodal = showingwhatinmodal;

    this.maxmarkofpassage = this.modalObjData.questionpaperMarks_passage;
    this.obtainedmarkofpassage = this.modalObjData.total_marks_obtained_passage;

    myModal.style.display = "block";
  }
  saveactionOfPassage = false;

  updatemarksofpassage() {
    this.modalsuccess = ''; this.modalerror = '';

    for (var t = 0; t < this.modalObjData.submitted_passageArray.length; t++) {
      if (this.modalObjData.submitted_passageArray[t].audiopath!='') {
        if (!this.modalObjData.submitted_passageArray[t].marks_obtained) {
        this.modalerror = "Fill marks of all passages !";
        this.HeaderdataService.settoaster("Fill marks of all passages !", 'warning');

        return false;
      }
    }
    }
    this.saveactionOfPassage = true;
    this.CommonServiceService.updatemarksofpassage(this.modalObjData).subscribe(res => {
      if (res.status == 'ERROR') {

        this.saveactionOfPassage = false;
        this.modalerror = res.message;

        this.HeaderdataService.settoaster(res.message, 'danger');

      } else {
        this.submittedAnswerList[this.rowinmodal].review_on = new Date();
        this.submittedAnswerList[this.rowinmodal].review_status = 'Reviewed Manually';
        this.submittedAnswerList[this.rowinmodal].final_status = res.final_status;
        this.submittedAnswerList[this.rowinmodal].total_marks_obtained_passage = res.total_marks_obtained_passage;
        this.submittedAnswerList[this.rowinmodal].questionpaperMarks_passage = res.questionpaperMarks_passage;
        this.submittedAnswerList[this.rowinmodal].passage_reviewed = true;

        this.HeaderdataService.settoaster(res.message, 'success');
        this.saveactionOfPassage = false;
        this.modalsuccess = res.message;

      }

    });
  }
  closemodal(myModal) {
    this.modalsuccess = ''; this.modalerror = '';
    this.saveactionOfPassage = false;
    myModal.style.display = "none";

  }
  getClientList() {
    this.CommonServiceService.getClientList(500000, 0, 1).subscribe(res => {
      this.clientdataList = [];
      for (var f = 0; f < res.clientList.length; f++) {
        if (res.clientList[f].customer_id_int > 0) {
          this.clientdataList.push(res.clientList[f]);
        }

      }
      for (let y = 0; y < this.clientdataList.length; y++) {
        var matchstr = this.clientdataList[y]['first_name'] + " " + this.clientdataList[y]['last_name'] + " (" + this.clientdataList[y]['customer_id'] + ")";

        this.clientdataList[y]['matchstr'] = matchstr;
      }
    });
  }
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
  updateFinalStatus(setObj) {
    if (setObj.passage_submitted && !setObj.passage_reviewed) {
      this.HeaderdataService.settoaster("First Review Passage/Vocablury !", 'warning');
      return false;
    }
    this.CommonServiceService.updateFinalStatus(setObj).subscribe(res => {
      if (res.status == 'ERROR') {



        this.HeaderdataService.settoaster(res.message, 'danger');

      } else {
        setObj.review_on = new Date();
        setObj.review_status = 'Reviewed Manually';
        this.HeaderdataService.settoaster(res.message, 'success');


      }

    });
  }
  onSortChange(e) {
    if (e.target.value !== '') {
      for (let y = 0; y < this.clientdataList.length; y++) {
        if (e.target.value == this.clientdataList[y]['matchstr']) {
          this.subcourseListcanBe = [];

          this.courseListforthisModule_perclient = [];
          this.subcourseListcanBe = this.clientdataList[y].course;
          for (let yq = 0; yq < this.clientdataList[y].course.length; yq++) {

            for (let r = 0; r < this.courseListforthisModule.length; r++) {
              if (this.courseListforthisModule[r]['_id'] == this.clientdataList[y].course[yq]['course_id']) {
                var course_name = this.courseListforthisModule[r]['course_name'];

              }
            }



            this.courseListforthisModule_perclient.push({ "_id": this.clientdataList[y].course[yq]['course_id'], "course_name": course_name });


          }
          this.courseListforthisModule = this.courseListforthisModule_perclient;
          this.questiondata.c_id = this.clientdataList[y]['_id'];
          this.questiondata.course_id = '';
          this.questiondata.sub_course_id = '';
          this.questiondata.sub_course_id_actual = '';
          this.subcourseList = [];
        }
      }
    } else {
      this.from_min_date = '';
      this.to_max_date = '';
      this.questiondata.c_id = '';
      this.getCourseList();
      this.subcourseListcanBe = [];
      this.subcourseList = [];

    }
  }

  getSubcourseByIdOfCourse() {


    if (this.questiondata.course_id !== '' && this.questiondata.course_id !== undefined) {
      this.questiondata.sub_course_id = "";

      this.CommonServiceService.getSubcourseByIdOfCourse(this.questiondata.course_id).subscribe(res => {


        if (this.questiondata.c_id != '') {
          var newsubcourselistacoordingtocustomer = [];
          this.subcourseList = res;

          for (let g = 0; g < this.subcourseListcanBe.length; g++) {
            for (let g1 = 0; g1 < this.subcourseList.length; g1++) {
              if (this.subcourseList[g1]['_id'] == this.subcourseListcanBe[g]['sub_course_id']) {

                newsubcourselistacoordingtocustomer.push({ "_id": this.subcourseListcanBe[g]['sub_course_id'], "course_name": this.subcourseList[g1]['course_name'], "starting_date": this.CommonServiceService.changedateformat(this.subcourseListcanBe[g]['starting_date']), "ending_date": this.CommonServiceService.changedateformat(this.subcourseListcanBe[g]['ending_date']) });
              }
            }
          }
          this.subcourseList = newsubcourselistacoordingtocustomer;

        }
        else {
          this.subcourseList = res;
        }
      });
    }

  }

  setMaxMinDateAccordingToSubCourse() {
    if (this.subcourseListcanBe && this.subcourseListcanBe.length > 0) {
      if (this.questiondata.sub_course_id != '') {
        this.from_min_date = this.subcourseList[this.questiondata.sub_course_id]['starting_date'];
        this.to_max_date = this.subcourseList[this.questiondata.sub_course_id]['ending_date'];
      }

    } else {
      this.from_min_date = '';
      this.to_max_date = '';
    }
  }
  getsubmittedAnswerList() {

    this.CommonServiceService.submittedAnswerList(this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {

      console.log('fetch');
      this.infinescrollerstatus = false; //infinescroll
      this.scrollToDataDiv();

      if (this.submittedAnswerList && this.submittedAnswerList.length > 0) {
        this.submittedAnswerList = this.submittedAnswerList.concat(res.listofsubmittedsets);
      } else {
        this.submittedAnswerList = res.listofsubmittedsets;
      }
      this.totalRecord = res.totalRecord;

      this.skipDocument = this.skipDocument + this.limitInOneTime;
    });
  }
  resetquestiondataB() {
    this.review_statusFromURL = '';
    this.resetquestiondata();
  }
  resetquestiondata() {
    //(<HTMLInputElement>document.getElementById('clientsearched')).value = '';
    this.questiondata = { review_status: this.review_statusFromURL, from_exam_date: '', day_number: '', to_exam_date: '', category: '', final_status: '', level: '', c_id: '', course_id: '', sub_course_id: "" };
  }
  resetInfineScroll() { // infinescroll
    this.limitInOneTime = 10;
    this.skipDocument = 0;
    this.totalRecord = 0;
  }
  onScrollDown(ev) {   // infinescroll
    console.log('scrolled down!!', ev);
    this.infinescrollerstatus = true;
    if (this.searchedFunctionClick) {
      this.submittedAnswerList_search('extend');
    } else {
      this.getsubmittedAnswerList();
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

  reset() {
    this.message = '';
    this.messageClass = '';
    this.messageClassIcon = '';
    this.searchaction = false;
  }

  getClientname(c_id) {
    console.log("clientdataList");
    console.log(this.clientdataList);
    for (let y = 0; y < this.clientdataList.length; y++) {
      if (c_id == this.clientdataList[y]['_id']) {
        return this.clientdataList[y]['matchstr'];
      }
    }
  }

  submittedAnswerList_search(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;
    var filledFound_search = false;

    if (this.questiondata.c_id !== '' && this.questiondata.c_id !== undefined) {


      filledFound_search = true;
    }


    if (this.questiondata.course_id !== '' && this.questiondata.course_id !== undefined) {
      filledFound_search = true;


    }
    this.questiondata.sub_course_id_actual = undefined;
    if (this.questiondata.sub_course_id !== '' && this.questiondata.sub_course_id !== undefined) {
      filledFound_search = true;


      this.questiondata.sub_course_id_actual = this.subcourseList[this.questiondata.sub_course_id]['_id'];

    }
    if (this.questiondata.from_exam_date !== '' && this.questiondata.from_exam_date !== undefined) {
      filledFound_search = true;
    }


    if (this.questiondata.to_exam_date !== '' && this.questiondata.to_exam_date !== undefined) {
      filledFound_search = true;

    }


    if (this.questiondata.review_status !== '' && this.questiondata.review_status !== undefined) {
      filledFound_search = true;

    }



    if (this.questiondata.final_status !== '' && this.questiondata.final_status !== undefined) {
      filledFound_search = true;

    }


    if (this.questiondata.category !== '' && this.questiondata.category !== undefined) {
      filledFound_search = true;
    }
    if (this.questiondata.category !== 'Final' && this.questiondata.category !== '') {
      if (this.questiondata.level !== '' && this.questiondata.level !== undefined) {
        filledFound_search = true;
        this.questiondata.level = +this.questiondata.level;
        if (Number.isInteger(this.questiondata.level)) {

          if (this.questiondata.level < 1) {


            this.createAlert('Week number must be more than 0', 'warning');
            return false;
          }
        } else {
          this.createAlert('Week number must be integer', 'warning');
          return false;
        }
      }
    } else if (this.questiondata.category == 'Final') {
      this.questiondata.level = 0;
    }

    if (this.questiondata.category == 'Daily') {
      if (this.questiondata.day_number !== '' && this.questiondata.day_number !== undefined) {
        filledFound_search = true;
        this.questiondata.day_number = +this.questiondata.day_number;
        if (Number.isInteger(this.questiondata.day_number)) {

          if (this.questiondata.day_number < 1) {


            this.createAlert('Day number must be more than 0', 'warning');
            return false;
          }
        } else {
          this.createAlert('Day number must be integer', 'warning');
          return false;
        }
      }
    }
    else if (this.questiondata.category !== 'Daily') {
      this.questiondata.day_number = 0;
    }



    if (filledFound_search == false) {
      //  this.createAlert('Fill at least one search parameter', 'warning');
      // return false;
    }
    this.searchaction = true;
    if (startagainAction == 'startagain') { // infinescroll
      this.submittedAnswerList = undefined;
      this.resetInfineScroll();
    }



    this.CommonServiceService.submittedAnswerList_search(this.questiondata, this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.submittedAnswerList && this.submittedAnswerList.length > 0) {
        this.submittedAnswerList = this.submittedAnswerList.concat(res.listofsubmittedsets);
      } else {
        this.submittedAnswerList = res.listofsubmittedsets;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;




    });

  }



}
