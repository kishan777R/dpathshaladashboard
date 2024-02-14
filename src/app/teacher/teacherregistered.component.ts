 





import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservice.service';
import { HeaderdataService } from '../headerdata.service';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-teacherregistered',
  templateUrl: './teacherregistered.component.html',
  styleUrls: ['./teacherregistered.component.css']
})
export class TeacherregisteredComponent implements OnInit {
  teacherdata: any;
  searchform: boolean = false;
  message: string;
  messageClass: string;
  messageClassIcon: string;
  searchaction: boolean;
  teacherdataList: any;
  
  private sub: any;
 
  throttle = 300;  // infinescroll
  scrollDistance = 1;  // infinescroll
  scrollUpDistance = 2;  // infinescroll
  limitInOneTime: number = 10;// infinescroll
  skipDocument: number = 0;// infinescroll
  totalRecord: number = 0;// infinescroll
  searchedFunctionClick: boolean = false;// infinescroll
  infinescrollerstatus: boolean = false;//infinescroll


  constructor(private route: ActivatedRoute, private HeaderdataService: HeaderdataService, private router: Router, private CommonServiceService: CommonServiceService) {


    this.sub = this.route.params.subscribe(params => {


      this.resetInfineScroll();
      this.teacherdataList = undefined;
     
       
      this.resetteacherdata();
    

    });

  }


  ngOnInit() {

  }
 
  getTeacherList() {
    this.CommonServiceService.getTeacherList(this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.infinescrollerstatus = false; //infinescroll
      if (this.teacherdataList && this.teacherdataList.length > 0) {
        this.teacherdataList = this.teacherdataList.concat(res.teacherList);
      } else {
        this.teacherdataList = res.teacherList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;
      this.scrollToDataDiv();
    });
  }
 
 
  
  resetteacherdata() {
    this.resetteacherdatajust();
    this.searchteacher('startagain');
  }
  resetteacherdatajust() {
    this.teacherdata = {    first_name: '', last_name: '',   from_reg_date: "", to_reg_date: "",   email: '', mobile: '' };


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
      this.searchteacher('extend');
    } else {
      this.getTeacherList();
    }

  }

  scrollToDataDiv() {

    let el = (<HTMLInputElement>document.getElementById('datadiv'));

    el.scrollIntoView();
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


  searchteacher(startagainAction) {
    this.reset();
    this.searchedFunctionClick = true;
    var filledFound_search = false;
    if (this.teacherdata.first_name !== '' && this.teacherdata.first_name !== undefined) {


      filledFound_search = true;
    }
    if (this.teacherdata.last_name !== '' && this.teacherdata.last_name !== undefined) {
      filledFound_search = true;
    }
    
    if (this.teacherdata.email !== '' && this.teacherdata.email !== undefined) {
      filledFound_search = true;
    }
    if (this.teacherdata.mobile !== '' && this.teacherdata.mobile !== undefined) {
      filledFound_search = true;
    }
    

    


    


    if (this.teacherdata.from_reg_date !== '' && this.teacherdata.from_reg_date !== undefined) {
      filledFound_search = true;
    }


    if (this.teacherdata.to_reg_date !== '' && this.teacherdata.to_reg_date !== undefined) {
      filledFound_search = true;
    }

  
 
    if (filledFound_search == false) {
      //  this.createAlert('Fill at least one search parameter', 'warning');
      // return false;
    }
    this.searchaction = true;
    if (startagainAction == 'startagain') { // infinescroll
      this.teacherdataList = undefined;
      this.resetInfineScroll();
    }



    this.CommonServiceService.searchTeachers(this.teacherdata, this.limitInOneTime, this.skipDocument, this.totalRecord).subscribe(res => {
      this.searchaction = false;
      this.infinescrollerstatus = false; //infinescroll
      if (startagainAction == 'startagain') { // infinescroll
        this.scrollToDataDiv();
      }
      if (this.teacherdataList && this.teacherdataList.length > 0) {
        this.teacherdataList = this.teacherdataList.concat(res.teacherList);
      } else {
        this.teacherdataList = res.teacherList;
      }
      this.totalRecord = res.totalRecord;
      this.skipDocument = this.skipDocument + this.limitInOneTime;




    });

  }
  deleteteacher(obj, index) {
    if (confirm('Are you sure you want to delete this Teacher !')) {

      this.CommonServiceService.deleteTeacher(obj).subscribe(res => {


        if (res.status == 'SUCCESS') {
          this.HeaderdataService.settoaster("Teacher " + obj.first_name + " deleted successfully !", 'success');
          this.teacherdataList.splice(index, 1);
          this.totalRecord = this.totalRecord - 1; // infinescroll
        } else {

          this.HeaderdataService.settoaster(res.message, 'danger');
        }
      });

    }
  }


  //modal
  modalObjData:any = {};
  openModal(qObj, myModal) {

    this.modalObjData = qObj;
    console.log(this.modalObjData.question);
    myModal.style.display = "block";
  }
  closemodal(myModal) {

    myModal.style.display = "none";

  }
  //modal end

}
