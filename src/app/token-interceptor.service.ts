import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { CommonServiceService } from './commonservice.service';

import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  un: string; disk_no:string;
  constructor(private CommonServiceService: CommonServiceService) {

    
  
  
  }




  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add a custom header
    if (this.CommonServiceService.isLogined) {
      this.un = localStorage.getItem('unique_id');
      this.disk_no = localStorage.getItem('disk_no');
    } else {
      this.un = "Session Out";
      this.disk_no="-1";
    }
    
    const customReq = request.clone({
      setHeaders:
        {
          
          }
    }
    );
    // pass on the modified request object
    return next.handle(customReq);
  }
}