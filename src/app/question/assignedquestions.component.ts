
import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";



@Component({
  selector: 'app-assignedquestions',
  templateUrl: './assignedquestions.component.html',
  styleUrls: ['./assignedquestions.component.css']
})


export class AssignedquestionsComponent implements OnInit {
  questiondata: any;
  searchform: boolean = false;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  questiondataList: any;
  subcourseList: any;
  courseListforthisModule: any;
  subcourseListcanBe: any;
  courseListforthisModule_perclient: any;

  modalObjData: any = {};
  clientdataList: any;
  from_min_date: any = "";
  submitted: number;
  to_max_date: any = '';
  private sub: any;
  assignedQMessage: string;

  throttle = 300;  // infinescroll
  scrollDistance = 1;  // infinescroll
  scrollUpDistance = 2;  // infinescroll
  limitInOneTime: number = 10;// infinescroll   set in resetfunction also
  skipDocument: number = 0;// infinescroll
  totalRecord: number = 0;// infinescroll
  searchedFunctionClick: boolean = false;// infinescroll
  infinescrollerstatus: boolean = false;//infinescroll
  constructor(private route: ActivatedRoute, private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService) {
    this.sub = this.route.params.subscribe(params => {

      this.resetInfineScroll();
      this.questiondataList = undefined;
      this.submitted = params['submitted'];
      this.getAssignedQuestionsList();
    });

  }

  scrollToDataDiv() {

    let el = (<HTMLInputElement>document.getElementById('datadiv'));

    el.scrollIntoView();
  }

  ngOnInit() {


    this.getClientList();
    this.getCourseList();



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
  getClientList() {
    this.CommonServiceService.getClientList(500000, 0, 1).subscribe(res => {
      this.clientdataList = [];
      for (var f = 0; f < res.clientList.length; f++) {
        if (res.clientList[f].customer_id_int > 0) {
          this.clientdataList.push(res.clientList[f]);
        }

      }
      //customer_id_int
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
  getAssignedQuestionsList() {


    this.CommonServiceService.getAssignedQuestionsList(this.limitInOneTime, this.skipDocument, this.totalRecord, this.submitted).subscribe(res => {
      this.scrollToDataDiv();

      this.infinescrollerstatus = false; //infinescroll


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
    //(<HTMLInputElement>document.getElementById('clientsearched')).value = '';
    this.questiondata = { test_level: "", from_exam_date: '', to_exam_date: '', category: '', level: '', c_id: '', course_id: '', sub_course_id: "" };
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
      this.searchAssignedQuestions('extend');

    } else {
      this.getAssignedQuestionsList();
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
    for (let y = 0; y < this.clientdataList.length; y++) {
      if (c_id == this.clientdataList[y]['_id']) {
        return this.clientdataList[y]['matchstr'];
      }
    }
  }

  searchAssignedQuestions(startagainAction) {
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


    if (this.questiondata.test_level !== '' && this.questiondata.test_level !== undefined) {
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
    if (this.questiondata.test_level !== '' && this.questiondata.test_level !== undefined) {

      this.questiondata.test_level = +this.questiondata.test_level;
      if (Number.isInteger(this.questiondata.test_level)) {

        if (this.questiondata.test_level < 1) {


          this.createAlert('Practice Round must be more than 0', 'warning');
          return false;
        }
      } else {
        this.createAlert('Practice Round  must be integer', 'warning');
        return false;
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



    this.CommonServiceService.searchAssignedQuestions(this.questiondata, this.limitInOneTime, this.skipDocument, this.totalRecord, this.submitted).subscribe(res => {
      this.searchaction = false;
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      this.infinescrollerstatus = false; //infinescroll
      if (this.questiondataList && this.questiondataList.length > 0) {
        this.questiondataList = this.questiondataList.concat(res.questionList);
      } else {
        this.questiondataList = res.questionList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;




    });

  }
  deleteduplicateQuestionAssigned() {
    if (this.questiondata.c_id !== '' && this.questiondata.c_id !== undefined) {
      var cid = this.questiondata.c_id;
    }
    else {
      var cid = undefined;
    }
    this.searchaction = true;

    this.CommonServiceService.deleteduplicateQuestionAssigned(cid).subscribe(res => {
      this.searchaction = false;
      if (res.status == 'SUCCESS') {
        this.searchAssignedQuestions('startagain');
      } else {
        this.createAlert(res.message, 'warning');
        return false;
      }


    })


  }
  deleteQuestionAssigned() {
    if (this.questiondata.c_id !== '' && this.questiondata.c_id !== undefined) {


      this.searchaction = true;

      this.CommonServiceService.deleteQuestionAssigned(this.questiondata.c_id).subscribe(res => {
        this.searchaction = false;
        if (res.status == 'SUCCESS') {
          this.searchAssignedQuestions('startagain');
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
  assignQuestionAutomaticApi() {
    var c_id = 0;
    var date = "";
    if (this.questiondata.c_id !== '' && this.questiondata.c_id !== undefined) {


      c_id = this.questiondata.c_id;
    }
    if (this.questiondata.from_exam_date !== '' && this.questiondata.from_exam_date !== undefined) {
      date = this.questiondata.from_exam_date;
    }


    //this.questiondata.from_exam_date ="";



    this.assignedQMessage = '';
    this.CommonServiceService.assignQuestionAutomaticApi(c_id, date).subscribe(res => {
      

      this.assignedQMessage = res.message;
    })
  }

  submitSet() {

    var QuestionArr = [];
    for (let qa = 0; qa < this.questiondataList.length; qa++) {

      QuestionArr.push(this.questiondataList[qa].questiondata[0]);


    }
    for (let qa = 0; qa < QuestionArr.length; qa++) {
      QuestionArr[qa]['user_attempt'] = {};
      for (let optionInc = 0; optionInc < QuestionArr[qa].options.length; optionInc++) {
        if (QuestionArr[qa].options[optionInc]['status']) {
          var realanswerofthisquestion = QuestionArr[qa].options[optionInc]['value'];
        }
      }





      QuestionArr[qa]['user_attempt']['starting_time_of_this_question'] = "05:10:10";/// dynamic
      QuestionArr[qa]['user_attempt']['ending_time_of_this_question'] = "05:20:10";/// dynamic
      QuestionArr[qa]['user_attempt']['time_taken_for_this_question'] = "00:10:00";/// dynamic
      QuestionArr[qa]['user_attempt']['answer_submitted_status'] = "SUBMITTED";/// dynamic
      if (QuestionArr[qa]['user_attempt']['answer_submitted_status'] == "SUBMITTED") {
        QuestionArr[qa]['user_attempt']['answer_by_user'] = "dedde";/// dynamic

        if (QuestionArr[qa]['user_attempt']['answer_by_user'] === realanswerofthisquestion) {
          QuestionArr[qa]['user_attempt']['answer_status'] = 'TRUE';
        } else {
          QuestionArr[qa]['user_attempt']['answer_status'] = 'FALSE';
        }


        if (QuestionArr[qa]['user_attempt']['answer_status'] == 'TRUE') {
          if (QuestionArr[qa]['audio_line']) {
            // this below arrayis the array of those  one strings which will we decide from out of four sufgestions 
            //(if all  four sugesstion does not match then we wil take first one),

            QuestionArr[qa]['user_attempt']['audio_try_array_for_this_question_and_this_attempt'] = ['where are you', 'where were you']; /// dynamic

            // we will consider last string as final (for week test and final test there would be one string in array beacuse no more than 1 chance)
            var lengthofArrOfAttemptAudio = QuestionArr[qa]['user_attempt']['audio_try_array_for_this_question_and_this_attempt'].length;
            QuestionArr[qa]['user_attempt']['how_many_attempts_for_audio'] = lengthofArrOfAttemptAudio;
            QuestionArr[qa]['user_attempt']['audio_selected_finally'] = QuestionArr[qa]['user_attempt']['audio_try_array_for_this_question_and_this_attempt'][lengthofArrOfAttemptAudio - 1];



            if (QuestionArr[qa]['audio_line'] == QuestionArr[qa]['user_attempt']['audio_selected_finally']) {
              QuestionArr[qa]['user_attempt']['audio_status'] = 'TRUE';

            } else {
              QuestionArr[qa]['user_attempt']['audio_status'] = 'FALSE';

            }


          }
          else {
            QuestionArr[qa]['user_attempt']['audio_try_array_for_this_question_and_this_attempt'] = [];
            QuestionArr[qa]['user_attempt']['audio_selected_finally'] = '';
            QuestionArr[qa]['user_attempt']['audio_status'] = 'No Audio';
            QuestionArr[qa]['user_attempt']['how_many_attempts_for_audio'] = 0;
          }
        } else {
          QuestionArr[qa]['user_attempt']['audio_try_array_for_this_question_and_this_attempt'] = [];
          QuestionArr[qa]['user_attempt']['audio_selected_finally'] = '';
          if (QuestionArr[qa]['audio_line']) {
            QuestionArr[qa]['user_attempt']['audio_status'] = 'Wrong Answer';
          } else {
            QuestionArr[qa]['user_attempt']['audio_status'] = 'No Audio';
          }
          QuestionArr[qa]['user_attempt']['how_many_attempts_for_audio'] = 0;
        }

      } else if (QuestionArr[qa]['user_attempt']['answer_submitted_status'] == "SKIPPED") {
        QuestionArr[qa]['user_attempt']['answer_by_user'] = "";
        QuestionArr[qa]['user_attempt']['answer_status'] = 'FALSE';
        QuestionArr[qa]['user_attempt']['audio_try_array_for_this_question_and_this_attempt'] = [];
        QuestionArr[qa]['user_attempt']['audio_selected_finally'] = '';
        QuestionArr[qa]['user_attempt']['audio_status'] = 'SKIPPED';
      }

      // marks start 
      if ((QuestionArr[qa]['user_attempt']['audio_status'] == 'TRUE' || QuestionArr[qa]['user_attempt']['audio_status'] == 'No Audio') && QuestionArr[qa]['user_attempt']['answer_status'] == 'TRUE') {
        QuestionArr[qa]['user_attempt']['marks_obtained'] = QuestionArr[qa]['mark'];
      } else if ((QuestionArr[qa]['user_attempt']['audio_status'] !== 'TRUE' && QuestionArr[qa]['user_attempt']['audio_status'] !== 'No Audio') && QuestionArr[qa]['user_attempt']['answer_status'] == 'TRUE') {
        QuestionArr[qa]['user_attempt']['marks_obtained'] = (QuestionArr[qa]['mark']) / 2;
      } else if (QuestionArr[qa]['user_attempt']['answer_status'] == 'FALSE') {
        QuestionArr[qa]['user_attempt']['marks_obtained'] = 0;
      }


      // marks end


    }

    let finalSetdataToSubmit = {
      test_level: this.questiondata.test_level, "question_details_array": QuestionArr,
      exam_date: this.questiondata.from_exam_date, category: this.questiondata.category, level: this.questiondata.level,
      c_id: this.questiondata.c_id, course_id: this.questiondata.course_id,
      sub_course_id: this.questiondata.sub_course_id_actual
    };




    this.CommonServiceService.submitSet(finalSetdataToSubmit).subscribe(res => {

      console.log(res);


    });

  }


}
