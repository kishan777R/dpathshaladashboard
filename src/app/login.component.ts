import { Component, OnInit } from '@angular/core';
import { HeaderdataService } from './headerdata.service';
import { CommonServiceService } from './commonservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  x:any={}; 
  constructor(public router: Router, public CommonServiceService: CommonServiceService, private HeaderdataService: HeaderdataService) {
    this.x.email = '';
    this.x.password = '';
    if(this.CommonServiceService.isLoginedF()){
      this.router.navigateByUrl('/dashboard');
    }else{
      
    }

   }

  ngOnInit() {
  }
  loginme() {
     
    if (this.x.email == '1' || this.x.email == '1' || this.x.email == '1') {
    if (this.x.password == '1') {
        localStorage.setItem("loginid", "1");
        this.HeaderdataService.settoaster("Logined Successfully !", 'success');
        this.router.navigateByUrl('/dashboard');
      } else {
        this.HeaderdataService.settoaster("Password is wrong !", 'warning');
      }
    } else {
      this.HeaderdataService.settoaster("Email  is wrong !", 'warning');
    }
  }
}
