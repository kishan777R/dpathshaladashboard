
import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-addclient',
  templateUrl: './addclient.component.html',
  styleUrls: ['./addclient.component.css']
})
export class AddclientComponent implements OnInit {
  clientdata: any;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  editingid: number = 0;
  saveaction: boolean;

  private sub: any;
  constructor(private router: Router, private CommonServiceService: CommonServiceService, private route: ActivatedRoute) {
    this.CommonServiceService.getCourseList();
    this.getCourseList();
    this.CommonServiceService.getSubCourseList();

    this.sub = this.route.params.subscribe(params => {
      this.editingid = params['cid']; // (+) converts string 'id' to a number

      if (this.editingid == 0) {
        this.resetclientdata();
      } else {

        this.CommonServiceService.getClient_byid(this.editingid).subscribe(res => {

          this.clientdata = res;
          for (var t = 0; t < this.clientdata.course.length; t++) {
            this.clientdata.course[t].course_id_old = this.clientdata.course[t].course_id;
            this.clientdata.course[t].sub_course_id_old = this.clientdata.course[t].sub_course_id;
            this.clientdata.course[t].starting_date = this.CommonServiceService.changedateformat(this.clientdata.course[t].starting_date);

            this.clientdata.course[t].starting_date_old = this.clientdata.course[t].starting_date;
            this.getSubcourseByIdOfCourse(t);
            this.getOrderDetails(t);
          }

        });

      }
    });


  }

  getSubcourseByIdOfCourse(index) {


    if (this.clientdata.course[index].course_id !== '' && this.clientdata.course[index].course_id !== undefined) {


      this.CommonServiceService.getSubcourseByIdOfCourse(this.clientdata.course[index].course_id).subscribe(res => {

        this.clientdata.course[index].subcourseList = res;

      });




    }
  }
  courseListforthisModule: any=[];
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
  getOrderDetails(index) {
    if (this.clientdata.course[index].course_id !== '' && this.clientdata.course[index].course_id !== undefined) {



      this.CommonServiceService.getOrderDetails(this.clientdata.c_id_int, this.clientdata.course[index].course_id, this.clientdata.course[index].sub_course_id).subscribe(res => {
        if (res) {


          this.clientdata.course[index].course_cost = res.amount;
          this.clientdata.course[index].paid_cost = res.paid_amount;
          this.clientdata.course[index].discount_cost = res.discount;
          this.clientdata.course[index].payment_recieved_on = this.CommonServiceService.changedateformat(res.payment_recieved_on);
          this.clientdata.course[index].transaction_id = res.bank_array[0].TXNID;
          this.clientdata.course[index].action_status = 'OLD';
          this.clientdata.course[index].order_no = res.order_no;

        } else {
          this.clientdata.course[index].course_cost = '';
          this.clientdata.course[index].paid_cost = '';
          this.clientdata.course[index].discount = '';
          this.clientdata.course[index].payment_recieved_on = '';
          this.clientdata.course[index].transaction_id = '';
          this.clientdata.course[index].order_no = "";
          this.clientdata.course[index].action_status = 'OLD';
        }
      });


    }
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  reset() {
    this.message = '';
    this.messageClass = '';
    this.messageClassIcon = '';
    this.saveaction = false;
  }



  checkIfAlreadySelectedIfNotThenGetDurationOfCourse(index) {

    for (var t = 0; t < this.clientdata.course[index].subcourseList.length; t++) {
      if (this.clientdata.course[index].sub_course_id == this.clientdata.course[index].subcourseList[t]._id) {
        this.clientdata.course[index].duration = this.clientdata.course[index].subcourseList[t].duration;
        this.clientdata.course[index].course_cost = this.clientdata.course[index].subcourseList[t].amount;
        this.clientdata.course[index].paid_cost = this.clientdata.course[index].course_cost;
      }
    }






    var alraedyFound = false;
    for (var t = 0; t < this.clientdata.course.length; t++) {

      if (this.clientdata.course[t].action_status !=='REMOVE' && this.clientdata.course[t].sub_course_id == this.clientdata.course[index].sub_course_id) {
        if (t != index) {
          alraedyFound = true;
          break;
        }
      }

    }
    if (alraedyFound) {
      alert('Sub course already selected');
      this.clientdata.course[index].sub_course_id = "";
      this.clientdata.course[index].duration = "";
      this.clientdata.course[index].course_cost = "";
      this.clientdata.course[index].paid_cost = "";
    }



  }
  addmoreCourse() {
    var courseObj = {
      course_name_at_time_of_purchase: 'No Need',
      sub_course_name_at_time_of_purchase: 'No Need',
      course_id: "",
      sub_course_id: "",

      course_id_old: "",
      sub_course_id_old: "",
      starting_date: "", order_no: "",
      starting_date_old: "",
      /// at the time of save

      ending_date: "",

      certificate_issued: 'NO',
      certificate_issued_date: ' ',
      course_status: 'Running',
      final_status: 'Pending',
      order_added_by: "Admin",




      coupon: '',//  for order section
      payment_recieved_on: "",//  for order section
      transaction_id: "",//  for order section
      //

      //delete these
      subcourseList: [],
      // by logic
      duration: "",


      course_cost: '',//  for order section
      paid_cost: '',//  for order section
      discount_cost: '',//  for order section
      action_status: 'New'
      //
    };
    this.clientdata.course.push(courseObj);
  }


  resetclientdata() {
    var courseObj = {
      course_name_at_time_of_purchase: 'No Need',
      sub_course_name_at_time_of_purchase: 'No Need',
      course_id: "",
      sub_course_id: "", order_no: "",

      course_id_old: "",
      sub_course_id_old: "",
      starting_date: "",
      starting_date_old: "",
      /// at the time of save

      ending_date: "",

      certificate_issued: 'NO',
      certificate_issued_date: ' ',
      course_status: 'Running',
      final_status: 'Pending',
      order_added_by: "Admin",




      coupon: '',//  for order section
      payment_recieved_on: "",//  for order section
      transaction_id: "",//  for order section
      //

      //delete these
      subcourseList: [],
      // by logic
      duration: "",


      course_cost: '',//  for order section
      paid_cost: '',//  for order section
      discount_cost: '',//  for order section
      action_status: 'New'
      //
    };
    var courseArr = [courseObj];
    this.clientdata = {
      id: this.editingid, first_name: '', last_name: '', email: '', password: '',mobile: '', alternate_mobile: '',
      state: '', city: '', pincode: '', address: '', address2: '', course: courseArr
    };

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
  deleteCourse(index) {
    this.clientdata.course[index].action_status = 'REMOVE';
  }

  saveclient() {

    this.reset();

    if (this.clientdata.first_name == '' || this.clientdata.first_name == undefined) {


      this.createAlert('Please fill first name field', 'warning');
      return false;
    }
    if (this.clientdata.last_name == '' || this.clientdata.last_name == undefined) {


      this.createAlert('Please fill last name field ', 'warning');
      return false;
    }
    if (this.clientdata.email == '' || this.clientdata.email == undefined) {
      this.createAlert('Please fill email field ', 'warning');
      return false;
    }
    if (this.clientdata.mobile == '' || this.clientdata.mobile == undefined) {
      this.createAlert('Please fill mobile  field ', 'warning');
      return false;
    }
    if (this.clientdata.alternate_mobile == '' || this.clientdata.alternate_mobile == undefined) {
      // this.createAlert('Please fill alternate mobile  field ', 'warning');
      //  return false;
    }
    if (this.clientdata.state == '' || this.clientdata.state == undefined) {
      this.createAlert('Please fill state  field ', 'warning');
      return false;
    }
    if (this.clientdata.city == '' || this.clientdata.city == undefined) {
      // this.createAlert('Please fill city  field ', 'warning');
      // return false;
    }
    if (this.clientdata.pincode == '' || this.clientdata.pincode == undefined) {
      //this.createAlert('Please fill pincode  field ', 'warning');
      // return false;
    }
    if (this.clientdata.address == '' || this.clientdata.address == undefined) {
      //this.createAlert('Please fill address 1 field ', 'warning');
      //return false;
    }
    if (this.clientdata.address2 == '' || this.clientdata.address2 == undefined) {
      //this.createAlert('Please fill address 2  field ', 'warning');
      // return false;
    }
    if (this.editingid == 0) {
      this.clientdata.client_added_by = "Admin";

    }
    for (var t = 0; t < this.clientdata.course.length; t++) {
      if (this.clientdata.course[t].action_status !== 'REMOVE') {
        if (this.clientdata.course[t].course_id == '') {
          this.createAlert('Please fill  course field for course ' + t + 1, 'warning');
          return false;

        }
        if (this.clientdata.course[t].sub_course_id == '') {
          this.createAlert('Please fill sub course field for course ' + t + 1, 'warning');
          return false;

        }
        if (this.clientdata.course[t].payment_recieved_on == '') {
          this.createAlert('Please fill Payment recieved on for course ' + t + 1, 'warning');
          return false;

        }
        
        if (this.clientdata.course[t].starting_date == '') {
          this.createAlert('Please fill Starting Date Of Course for course ' + t + 1, 'warning');
          return false;

        }
        if (this.clientdata.course[t].paid_cost == '') {
          this.createAlert('Please fill Paid Amount  for course ' + t + 1, 'warning');
          return false;

        }
        if (this.clientdata.course[t].transaction_id == '') {
          this.createAlert('Please fill Transaction Id for course ' + t + 1, 'warning');
          return false;

        }
      }

    }
    this.saveaction = true;
    this.CommonServiceService.saveClient(this.clientdata, this.editingid).subscribe(res => {
      this.saveaction = false;

      if (res.status == 'ERROR') {


        this.createAlert(res.message, 'warning');

      } else {
        
        if (this.editingid == 0) {
          this.createAlert("Client Added Successfully !", 'success');
          this.resetclientdata();
          this.assignQuestionAutomaticApiOnlyId(res.newclient._id);

        } else {
          this.createAlert("Client Updated Successfully !", 'success');

        }


      }


    });

  }

  
  assignQuestionAutomaticApiOnlyId(_id) {
    
    this.CommonServiceService.assignQuestionAutomaticApiOnlyId(_id).subscribe(res => {
      

     console.log( res.message);
    })
  }
}
