import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderdataService {
  bodynavopenclass: string;
  sidemenu: boolean = true;
  tostermessage: string;
  tosterBGCOLOR: string;
  constructor() {
    var isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
      },
      any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };

    if (isMobile.any()) {
      this.bodynavopenclass = 'layout-fullwidth offcanvas-active';
    }
    else {
      this.bodynavopenclass = 'layout-fullwidth';
    }
  }
//:;
  settoaster(message, type) {
    this.tostermessage = message;
     
      this.tosterBGCOLOR="background-color-"+type;
       
      
    var x = document.getElementById("snackbar1");
    x.className = "snackbar show "+ this.tosterBGCOLOR;


    setTimeout(function () {
    x.className = x.className.replace("show", "");
    }, 3000);
  }
}
