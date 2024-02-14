import { Component, OnInit } from '@angular/core';
import { HeaderdataService } from './headerdata.service';
import { CommonServiceService } from './commonservice.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public CommonServiceService: CommonServiceService,private HeaderdataService: HeaderdataService) { }

  ngOnInit() {
  }

}
