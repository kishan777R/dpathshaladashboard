


import { Injectable } from '@angular/core';


import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { environment } from '../environments/environment';

import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest',
    'MyClientCert': '',        // This is empty
    'MyToken': ''
  })
};

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  uri: string;
  isLogined: boolean;
  courseList: any;
  subcourseList: any = [];
  urlofwebsite: string;
  constructor(private router: Router, private http: HttpClient) {

    this.uri = environment.commonURL;
    this.urlofwebsite = environment.urlofwebsite;

  }
  isLoginedF() {
    return !!localStorage.getItem("loginid");
  }
  logout() {
    localStorage.removeItem("loginid");
    this.router.navigateByUrl('/login');
  }
  changedateformat(date) {
    return date.slice(0, 10);
  }
  deletecourse(obj) {
    return this.http.delete<any>(this.uri + 'api/course/' + obj._id, httpOptions);
  }
  getOrderListOfSelectedClient(c_id_intArr) {
    return this.http.post<any>(this.uri + 'api/getOrderListOfSelectedClient',{'c_id_intArr':c_id_intArr}, httpOptions);
  }
  getPendingOrderist() {
    return this.http.get<any>(this.uri + 'api/pending_oredrList', httpOptions);
  }
  getNonPendingOrderist() {
    return this.http.get<any>(this.uri + 'api/Nonpending_oredrList', httpOptions);
  }
  checkStatusAgainOfOrder(order) {
    return this.http.get<any>(this.uri + 'api/check_order_status_directly_by_order_id_from_paytm_package/' + order, httpOptions);
  }
  run_check_payment_status_in_backened(order) {
    return this.http.get<any>(this.uri + 'api/run_check_payment_status_in_backened/' + order, httpOptions);
  }
  
  deleteSubcourse(obj) {
    return this.http.delete<any>(this.uri + 'api/subcourse/' + obj._id, httpOptions);
  }

  get_courses_subcourse_both() {
    return this.http.get<any>(this.uri + 'api/courses_subcourse_both', httpOptions);

  }
  getCourseListReurn() {
    return this.http.get<any>(this.uri + 'api/courses', httpOptions);


  }

  geDahboarddata(objOFdateType) {
    return this.http.post(this.uri + 'api/dashboarddata', objOFdateType, httpOptions);


  }
  deletefilefromserver(server,filepath){

    if(confirm("Delete file from server only when you are updating files. Otherwise it will show blank file to user. Click ok to confirm ")){

    
    return this.http.post<any>(this.uri + 'api/deletefilefromserver', {"server":server,"filepath":filepath}, httpOptions).subscribe(res => {

      alert(res.message);
    });
  }
  }
  deletefilefromserverNoMessage(server,filepath){

 
    
    return this.http.post<any>(this.uri + 'api/deletefilefromserver', {"server":server,"filepath":filepath}, httpOptions).subscribe(res => {

      
    });
  
  }
  getCoursenameAccordingToLevel_bysub_course_id_teacher(sub_course, categoryArr) {


    for (var t = 0; t < categoryArr.length; t++) {
      if (categoryArr[t]._id == sub_course) {

        var parent_course = categoryArr[t].parent_course;

      }
    }



    for (var t = 0; t < this.courseList.length; t++) {
      if (this.courseList[t]._id == parent_course) {

        return this.getCoursenameAccordingToLevel(this.courseList[t], this.courseList);

      }
    }
  }
  getCoursenameAccordingToLevel_byParent_id(parent_course, categoryArr) {




    for (var t = 0; t < categoryArr.length; t++) {
      if (categoryArr[t]._id == parent_course) {

        return this.getCoursenameAccordingToLevel(categoryArr[t], categoryArr);

      }
    }
  }
  getCoursenameAccordingToLevel(perCourseOBJ, categoryArr) {
    if (perCourseOBJ.upper_level_id == '') {
      return perCourseOBJ.course_name;
    } else {
      var levelofthiscourse = perCourseOBJ.level_number;

      var _id = perCourseOBJ.upper_level_id;
      var coursenaneArr = [];
      coursenaneArr.push(perCourseOBJ.course_name);
      for (var t = levelofthiscourse - 1; t >= 1; t--) {
        for (var x = 0; x < categoryArr.length; x++) {
          if (_id == categoryArr[x]._id) {
            coursenaneArr.push(categoryArr[x].course_name);
            var _id = categoryArr[x].upper_level_id;
          }
        }
      }


      var coursenaneArr = coursenaneArr.reverse();
      return coursenaneArr.join(" -> ");
    }

  }

  async getCourseList() {
    this.http.get(this.uri + 'api/courses', httpOptions).subscribe(res => {


      this.courseList = res;
      this.makeCourseListForForm(0);

      console.log(this.courseList);
    });


  }
  courseListForForm: any;
  makeCourseListForForm(editingid) {
    this.courseListForForm = [];
    for (var d = 0; d < this.courseList.length; d++) {

      if (this.courseList[d]._id != editingid) {
        this.courseListForForm.push(this.courseList[d]);
      }



    }

    console.log(this.courseListForForm);
  }
  async getSubCourseList() {
    this.http.get(this.uri + 'api/subcourses', httpOptions).subscribe(res => {


      this.subcourseList = res;
    });


  }
  getSubcourseByIdOfCourse(parent_course) {
    return this.http.get(this.uri + 'api/subcoursesbyid/' + parent_course, httpOptions);


  }


  updateImagePath(videoobj) {



    return this.http.post<any>(this.uri + 'api/updateImagePath', videoobj, httpOptions);


  }
  updateVideoorder(videoobj) {



    return this.http.post<any>(this.uri + 'api/updateVideoorder', videoobj, httpOptions);


  }
  saveSubCourse(wheretoshowinwebsite,pre_amount,studentnumber,sub_title,skilllevel,language,teacher_email,teacher_occupation,teacher_about,rating,thumbnailpath,teacherimagepath , demovideopath, showbackground, cardArr, backgroundimagepath, instructor, yourcourse_imagepath, imagepath, describeArr, amount, subjectstatus, certificate_type, subjectcode,bonus_subject_id, duration, duration_type, is_self_paced, subcoursename, coursename, editingid) {

   
   

    if (editingid == 0) {
      return this.http.post<any>(this.uri + 'api/subcourse', { 'wheretoshowinwebsite': wheretoshowinwebsite,  'pre_amount': pre_amount,'sub_title': sub_title, 'studentnumber': studentnumber, 'skilllevel': skilllevel, 'language': language, 'teacher_email': teacher_email, 'teacher_occupation': teacher_occupation, 'teacher_about': teacher_about, 'rating': rating,'teacherimagepath': teacherimagepath,'thumbnailpath': thumbnailpath, 'demovideopath': demovideopath, 'certificate_type': certificate_type, 'instructor': instructor, 'duration_type': duration_type, 'is_self_paced': is_self_paced, 'showbackground': showbackground, 'cardArr': cardArr, 'yourcourse_imagepath': yourcourse_imagepath, 'backgroundimagepath': backgroundimagepath, 'imagepath': imagepath, 'describeArr': describeArr, 'main_course_id': coursename, "subjectstatus": subjectstatus, 'subjectcode': subjectcode,'bonus_subject_id':bonus_subject_id, 'amount': amount, 'duration': duration, 'course_name': subcoursename }, httpOptions);
    } else {
      return this.http.put<any>(this.uri + 'api/subcourse', { 'wheretoshowinwebsite': wheretoshowinwebsite,  'pre_amount': pre_amount,'sub_title': sub_title, 'studentnumber': studentnumber, 'skilllevel': skilllevel, 'language': language,'teacher_email': teacher_email, 'teacher_occupation': teacher_occupation, 'teacher_about': teacher_about, 'rating': rating, 'teacherimagepath': teacherimagepath,'thumbnailpath': thumbnailpath, 'demovideopath': demovideopath, 'certificate_type': certificate_type, 'instructor': instructor, 'duration_type': duration_type, 'is_self_paced': is_self_paced, 'showbackground': showbackground, 'cardArr': cardArr, 'yourcourse_imagepath': yourcourse_imagepath, 'backgroundimagepath': backgroundimagepath, 'imagepath': imagepath, 'describeArr': describeArr, 'main_course_id': coursename, "subjectstatus": subjectstatus, 'subjectcode': subjectcode, 'bonus_subject_id':bonus_subject_id, 'amount': amount, 'duration': duration, 'course_name': subcoursename, '_id': editingid }, httpOptions);
    }

  }


  saveCourse(iconforfirstcategory,courseList, upper_level_id, coursename, editingid, upper_level_obj, before_upper_level_id, before_level_number, before_is_it_last_level, before_upper_level_id_obj) {

    if (editingid == 0) {
      return this.http.post<any>(this.uri + 'api/course', { 'iconforfirstcategory': iconforfirstcategory,'courseList': courseList, 'before_upper_level_id': before_upper_level_id, 'upper_level_obj': upper_level_obj, 'upper_level_id': upper_level_id, 'course_name': coursename }, httpOptions);
    } else {
      return this.http.put<any>(this.uri + 'api/course', { 'iconforfirstcategory': iconforfirstcategory,'courseList': courseList, 'before_upper_level_id_obj': before_upper_level_id_obj, 'before_level_number': before_level_number, 'before_is_it_last_level': before_is_it_last_level, 'before_upper_level_id': before_upper_level_id, 'upper_level_obj': upper_level_obj, 'upper_level_id': upper_level_id, 'course_name': coursename, '_id': editingid }, httpOptions);
    }

  }
  //  Questions  start


  getTutList(limitInOneTime, skipDocument, totalRecord) {


    return this.http.get<any>(this.uri + 'api/tutorial/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord, httpOptions);


  }
  getVideoList(limitInOneTime, skipDocument, totalRecord) {


    return this.http.get<any>(this.uri + 'api/video/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord, httpOptions);


  }
  getTopicList(limitInOneTime, skipDocument, totalRecord) {


    return this.http.get<any>(this.uri + 'api/topic/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord, httpOptions);


  }
  getQuestionsList(limitInOneTime, skipDocument, totalRecord) {


    return this.http.get<any>(this.uri + 'api/question/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord, httpOptions);


  }
  secondToMinConvert(seconds) {
    var timerstring = "";
    if (seconds <= 60) {
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      timerstring = "00:" + seconds + ' min';
    } else {
      var minutes = Math.floor(seconds / 60);
      var extraseconds = seconds - minutes * 60;
      if (extraseconds < 10) {
        var extrasecondsstr = "0" + extraseconds;
      } else {
        var extrasecondsstr = "" + extraseconds;
      }
      if (minutes < 10) {
        var minutesstr = "0" + minutes;
      } else {
        var minutesstr = "" + minutes;
      }
      timerstring = minutesstr + ":" + extrasecondsstr + ' min';
    }
    return timerstring;
  }
  searchTut(searchdata, limitInOneTime, skipDocument, totalRecord) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'api/searchTut', searchdata, httpOptions);
  }

  searchVideos(searchdata, limitInOneTime, skipDocument, totalRecord) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'api/searchVideosAdmin', searchdata, httpOptions);
  }

  searchTopics(searchdata, limitInOneTime, skipDocument, totalRecord) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'api/searchTopics', searchdata, httpOptions);
  }
  searchQuestions(searchdata, limitInOneTime, skipDocument, totalRecord) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'api/searchQuestions', searchdata, httpOptions);
  }
  getTutorial_byid(tid) {
    return this.http.get(this.uri + 'api/tutorialbyid/' + tid, httpOptions);

  }
  getQuestions_byid(qid) {

    return this.http.get(this.uri + 'api/questionbyid/' + qid, httpOptions);

  }
  askedQuestionById(aid) {

    return this.http.get(this.uri + 'api/askedQuestionById/' + aid, httpOptions);

  }
  askedQuestion_chatByRId(aid) {

    return this.http.get(this.uri + 'api/askedQuestion_chatByRId/' + aid, httpOptions);

  }
  giveanswer(qaskeduestionData) {



    return this.http.put<any>(this.uri + 'api/giveanswer', qaskeduestionData, httpOptions);


  }
  saveAskedQuestion_chat(referenceid, message, questionasked, c_id_int) {


    return this.http.post<any>(this.uri + 'api/saveAskedQuestion_chat', { "asked_question": questionasked, "c_id_int": c_id_int, "created_by": -1, "referenceid": referenceid, "message": message, "by": "Admin" }, httpOptions);

  }
  getVideo_byid(vid) {

    return this.http.get(this.uri + 'api/videobyid/' + vid, httpOptions);

  }
  getTopic_byid(tid) {

    return this.http.get(this.uri + 'api/topicbyid/' + tid, httpOptions);

  }
  saveTutorial(tuturialData, editingid) {


    if (editingid == 0) {
      return this.http.post<any>(this.uri + 'api/tutorial', tuturialData, httpOptions);
    } if (editingid == -2) {
      return this.http.post<any>(this.uri + 'api/tutorialintoduction', tuturialData, httpOptions);
    } else {
      return this.http.put<any>(this.uri + 'api/tutorial', tuturialData, httpOptions);
    }

  }
  saveQuestions(questionData, editingid) {


    if (editingid == 0) {
      return this.http.post<any>(this.uri + 'api/question', questionData, httpOptions);
    } else {
      return this.http.put<any>(this.uri + 'api/question', questionData, httpOptions);
    }

  }

  saveVideo(VideonData, editingid) {


    if (editingid == 0) {
      return this.http.post<any>(this.uri + 'api/video', VideonData, httpOptions);
    } else {
      return this.http.put<any>(this.uri + 'api/video', VideonData, httpOptions);
    }

  }
  saveTopic(TopicData, editingid) {


    if (editingid == 0) {
      return this.http.post<any>(this.uri + 'api/topic', TopicData, httpOptions);
    } else {
      return this.http.put<any>(this.uri + 'api/topic', TopicData, httpOptions);
    }

  }



  deleteTut(obj) {

    return this.http.delete<any>(this.uri + 'api/tutorial/' + obj._id, httpOptions);
  }
  deleteQuestion(obj) {

    return this.http.delete<any>(this.uri + 'api/question/' + obj._id, httpOptions);
  }
  deleteVideo(obj) {

    return this.http.delete<any>(this.uri + 'api/video/' + obj._id, httpOptions);
  }
  deleteTopic(obj) {
    return this.http.delete<any>(this.uri + 'api/topic/' + obj._id, httpOptions);

  }
  //  Questions    end


  //  notification  start



  getNotificationsList(limitInOneTime, skipDocument, totalRecord) {


    return this.http.get<any>(this.uri + 'api/notificationlistAdmin/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord, httpOptions);


  }



  searchNotifications(searchdata, limitInOneTime, skipDocument, totalRecord) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'api/searchNotifications', searchdata, httpOptions);
  }

  getNotifications_byid(nid) {

    return this.http.get(this.uri + 'api/getNotifications_byid/' + nid, httpOptions);

  }



  saveNotifications(notificationdata, editingid) {


    if (editingid == 0) {
      return this.http.post<any>(this.uri + 'api/saveNotifications', notificationdata, httpOptions);
    } else {
      return this.http.put<any>(this.uri + 'api/saveNotifications', notificationdata, httpOptions);
    }

  }


  deleteNotification(obj) {

    return this.http.delete<any>(this.uri + 'api/deleteNotification/' + obj._id, httpOptions);
  }
  //  notification    end



  // client start
  issue_unissue(clientid, course_index, action) {


    return this.http.post<any>(this.uri + 'api/issue_unissue', { "action": action, "course_index": course_index, "clientid": clientid }, httpOptions);
  }




  getAskedQuestionList(limitInOneTime, skipDocument, totalRecord, askedquestiontype) {


    return this.http.get<any>(this.uri + 'api/askedQuestionForAdmin/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord + "/" + askedquestiontype, httpOptions);


  }
  searchaskedQ(searchdata, limitInOneTime, skipDocument, totalRecord, askedquestiontype) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'api/searchaskedQuestionForAdmin' + "/" + askedquestiontype, searchdata, httpOptions);
  }



  getClientList(limitInOneTime, skipDocument, totalRecord) {


    return this.http.get<any>(this.uri + 'api/clients/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord, httpOptions);


  }


  searchClients(searchdata, limitInOneTime, skipDocument, totalRecord) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'api/searchClients', searchdata, httpOptions);
  }

  getClient_byid(qid) {

    return this.http.get(this.uri + 'api/clientbyid/' + qid, httpOptions);

  }

  saveClient(questionData, editingid) {


    if (editingid == 0) {
      return this.http.post<any>(this.uri + 'api/client_from_admin', questionData, httpOptions);
    } else {
      return this.http.put<any>(this.uri + 'api/client_from_admin', questionData, httpOptions);
    }

  }


  deleteClient(obj) {

    return this.http.delete<any>(this.uri + 'api/client/' + obj._id, httpOptions);
  }
  deletemessageofchat(obj) {
    return this.http.delete<any>(this.uri + 'api/deletemessageofchat/' + obj._id + '/' + obj.referenceid, httpOptions);
  }
  // client end



  deleteSubmittedAnswer(_id) {
    return this.http.get<any>(this.uri + 'api/deleteSubmittedAnswer/' + _id, httpOptions);

  }
  //  assign questions

  deleteQuestionAssigned(_id) {
    return this.http.get<any>(this.uri + 'api/deleteQuestionAssigned/' + _id, httpOptions);

  }
  deleteduplicateQuestionAssigned(_id) {
    if (_id == undefined) {
      _id = 0;
    }
    return this.http.get<any>(this.uri + 'api/deleteduplictaeQuestionAssigned/' + _id, httpOptions);

  }
  assignQuestionAutomaticApi(_id, date) {
    return this.http.get<any>(this.uri + 'api/assignQuestion/' + _id + '/' + date, httpOptions);

  }
  assignQuestionAutomaticApiOnlyId(_id) {
    return this.http.get<any>(this.uri + 'api/assignQuestion/' + _id, httpOptions);

  }
  getAssignedQuestionsList(limitInOneTime, skipDocument, totalRecord, submitted) {


    return this.http.get<any>(this.uri + 'api/questionAssigned/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord + "/" + submitted, httpOptions);


  }
  searchAssignedQuestions(searchdata, limitInOneTime, skipDocument, totalRecord, submitted) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'api/searchQuestionsAssigned/' + submitted, searchdata, httpOptions);
  }


  //  assign questions end

  // submitted answer start

  submittedAnswerList(limitInOneTime, skipDocument, totalRecord) {


    return this.http.get<any>(this.uri + 'api/answerSubmitted_by_client/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord, httpOptions);


  }
  submittedAnswerList_search(searchdata, limitInOneTime, skipDocument, totalRecord) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'api/answerSubmitted_by_client_search', searchdata, httpOptions);
  }

  //  submited answer end


  submitSet(finalSetdataToSubmit) {
    return this.http.post<any>(this.uri + 'api/submit_set', finalSetdataToSubmit, httpOptions);
  }
  updateFinalStatus(setObj) {
    return this.http.put<any>(this.uri + 'api/updateFinalStatus', setObj, httpOptions);
  }

  updatemarksofpassage(setObj) {
    return this.http.put<any>(this.uri + 'api/updatemarksofpassage', setObj, httpOptions);
  }
  getContactList(limitInOneTime, skipDocument, totalRecord) {


    return this.http.get<any>(this.uri + 'api/contact/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord, httpOptions);


  }
  searchContact(searchdata, limitInOneTime, skipDocument, totalRecord) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'api/searchContact', searchdata, httpOptions);
  }

  emptytable(tablename) {
    this.http.get<any>(this.uri + 'api/emptytable/' + tablename, httpOptions).subscribe(res => {

      alert(res.message);

    });
  }


  getOrderDetails(c_id_int, course_id, sub_course_id) {
    return this.http.get<any>(this.uri + 'api/getOrderDetails/' + c_id_int + "/" + course_id + "/" + sub_course_id, httpOptions);

  }

  getinvoice_url() {
    return this.http.get<any>(this.uri + 'api/invoice_url', httpOptions);

  }
  SendEmailWorking(serviceURL) {
    return this.http.get<any>(serviceURL, httpOptions);
  }


  /// teacher

  getTeacherList(limitInOneTime, skipDocument, totalRecord) {


    return this.http.get<any>(this.uri + 'teacherapi/teachers/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord, httpOptions);


  }
  searchTeachers(searchdata, limitInOneTime, skipDocument, totalRecord) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;

    return this.http.post<any>(this.uri + 'teacherapi/searchTeachers', searchdata, httpOptions);
  }

  deleteTeacher(obj) {

    return this.http.delete<any>(this.uri + 'teacherapi/teacher/' + obj._id, httpOptions);
  }

  getCourseListTeacher(limitInOneTime, skipDocument, totalRecord, coursestatus) {


    return this.http.get<any>(this.uri + 'teacherapi/getCourseListTeacher/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord + "/" + coursestatus, httpOptions);


  }
  searchCoursesTeacher(searchdata, limitInOneTime, skipDocument, totalRecord, coursestatus) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;
    searchdata.coursestatus = coursestatus;

    return this.http.post<any>(this.uri + 'teacherapi/searchCoursesTeacher', searchdata, httpOptions);
  }

  updateCousrseStatus(action, courseobj, reason) {
    return this.http.post<any>(this.uri + 'teacherapi/updateCousrseStatus', { "action": action, "courseobj": courseobj, "reason": reason }, httpOptions);

  }

  updateCousrsepublishStatus(action, courseobj, reason) {
    return this.http.post<any>(this.uri + 'teacherapi/updateCousrsepublishStatus', { "action": action, "courseobj": courseobj, "reason": reason }, httpOptions);

  }
  getLectureListTeacher(limitInOneTime, skipDocument, totalRecord, lecturestatus) {


    return this.http.get<any>(this.uri + 'teacherapi/getLectureListTeacher/' + limitInOneTime + "/" + skipDocument + "/" + totalRecord + "/" + lecturestatus, httpOptions);


  }
  searchLectureTeacher(searchdata, limitInOneTime, skipDocument, totalRecord, lecturestatus) {
    searchdata.limitInOneTime = limitInOneTime;
    searchdata.skipDocument = skipDocument;
    searchdata.totalRecord = totalRecord;
    searchdata.lecturestatus = lecturestatus;

    return this.http.post<any>(this.uri + 'teacherapi/searchLectureTeacher', searchdata, httpOptions);
  }

  updateLectureStatus(action, courseobj, videoobj, reason) {
    return this.http.post<any>(this.uri + 'teacherapi/updateLectureStatus', { "action": action, "courseobj": courseobj, "videoobj": videoobj, "reason": reason }, httpOptions);

  }
  getTopicListByTeacher() {


    return this.http.get<any>(this.uri + 'teacherapi/getTopicListByTeacher', httpOptions);


  }
  // teacher end
}
