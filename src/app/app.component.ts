import { Component } from '@angular/core';
import { HeaderdataService } from './headerdata.service';
import { CommonServiceService } from './commonservice.service';

import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'edutech';
  constructor(  public router: Router,public CommonServiceService: CommonServiceService,private HeaderdataService: HeaderdataService) { 

    if(this.CommonServiceService.isLoginedF()){
     
    }else{
      this.router.navigateByUrl('/login');
    }

  }
}
