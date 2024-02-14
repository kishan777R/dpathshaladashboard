import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-questionslist',
  templateUrl: './questionslist.component.html',
  styleUrls: ['./questionslist.component.css']
})
export class QuestionslistComponent implements OnInit {
  questiondata: any;
  message: string; 
  searchform: boolean = false;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  questiondataList: any;
  modalObjData: any = {};

  subcourseList: any;
  throttle = 300;  // infinescroll
  scrollDistance = 1;  // infinescroll
  scrollUpDistance = 2;  // infinescroll
  limitInOneTime: number = 10;// infinescroll
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

    this.getQuestionsList();
    this.resetquestiondata();

  }

  openModal(qObj, myModal) {

    this.modalObjData = qObj;
    console.log(this.modalObjData.question);
    myModal.style.display = "block";
  }
  closemodal(myModal) {

    myModal.style.display = "none";

  }
  getQuestionsList() {
    this.CommonServiceService.getQuestionsList(this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
      this.scrollToDataDiv();
      if (this.questiondataList && this.questiondataList.length > 0) {
        this.questiondataList = this.questiondataList.concat(res.questionList);
      } else {
        this.questiondataList = res.questionList;
      }
      this.totalRecord = res.totalRecord;

      this.skipDocument = this.skipDocument + this.limitInOneTime;

    });
  }

  resetquestiondata() {
    this.questiondata = { question: '', course_id: '', day_number: '', sub_course_id: "", category: '', question_type: '', duration_of_question: "", mark: '', remark: '', audio_line: '', level: '' };
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
      this.searchQuestion('extend');
    } else {
      this.getQuestionsList();
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
    this.searchaction = false;
  }


  searchQuestion(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;
    var filledFound_search = false;
    this.questiondata.course_name = '';
    this.questiondata.sub_course_name = '';

    if (this.questiondata.question !== '' && this.questiondata.question !== undefined) {


      filledFound_search = true;
    }
    if (this.questiondata.category !== '' && this.questiondata.category !== undefined) {
      filledFound_search = true;
    }
    if (this.questiondata.course_id !== '' && this.questiondata.course_id !== undefined) {
      filledFound_search = true;

      for (let percourse of this.CommonServiceService.courseList) {
        if (percourse._id == this.questiondata.course_id) {
          this.questiondata.course_name = percourse.course_name;

        }
      }

    }
    if (this.questiondata.sub_course_id !== '' && this.questiondata.sub_course_id !== undefined) {
      filledFound_search = true;
      for (let percourse of this.subcourseList) {
        if (percourse._id == this.questiondata.sub_course_id) {
          this.questiondata.sub_course_name = percourse.course_name;

        }
      }
    }
    if (this.questiondata.audio_line !== '' && this.questiondata.audio_line !== undefined) {
      filledFound_search = true;
    }
    if (this.questiondata.question_type !== '' && this.questiondata.question_type !== undefined) {
      filledFound_search = true;
    }

    if (this.questiondata.remark !== '' && this.questiondata.remark !== undefined) {
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
    }
    else if (this.questiondata.category == 'Final') {
      this.questiondata.level = 0; this.questiondata.day_number = 0;
    }



    if (this.questiondata.category !== 'Final') {
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
    



    if (this.questiondata.mark !== '' && this.questiondata.mark !== undefined) {
      filledFound_search = true;
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
      filledFound_search = true;
      this.questiondata.duration_of_question = +this.questiondata.duration_of_question;
      if (Number.isNaN(this.questiondata.duration_of_question)) {
        this.createAlert('Question duration must be a number ', 'warning');
        return false;

      } else {


        if (this.questiondata.duration_of_question < 1) {


          this.createAlert('Question duration must be more than 0', 'warning');
          return false;
        }
      }
    }


    if (filledFound_search == false) {
      //  this.createAlert('Fill at least one search parameter', 'warning');
      // return false;
    }
    this.searchaction = true;
    if (startagainAction == 'startagain') { // infinescroll
      this.questiondataList = undefined;
      this.resetInfineScroll();
    }



    this.CommonServiceService.searchQuestions(this.questiondata, this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.questiondataList && this.questiondataList.length > 0) {
        this.questiondataList = this.questiondataList.concat(res.questionList);
      } else {
        this.questiondataList = res.questionList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;




    });

  }

  updateQ_in_for_query(questiondata) {
    this.searchaction = true;
    this.CommonServiceService.saveQuestions(questiondata, questiondata._id).subscribe(res => {
      this.searchaction = false;

      if (res.status == 'ERROR') {


        this.createAlert(res.message, 'warning');

      } else {
        this.createAlert(res.message, 'success');




      }


    });
  }
  deleteQuestion(obj, index) {
    if (confirm('Are you sure you want to delete this question !')) {

      this.CommonServiceService.deleteQuestion(obj).subscribe(res => {


        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster("Question " + obj.question + " deleted successfully !", 'success');
          this.questiondataList.splice(index, 1);
          this.totalRecord = this.totalRecord - 1; // infinescroll
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });

    }
  }


}
