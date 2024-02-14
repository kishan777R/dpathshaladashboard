import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';
import { CoursesComponent } from './courses/courses.component';
import { CommonServiceService } from './commonservice.service';
import { TokenInterceptorService } from './token-interceptor.service';
import { AddquestionsComponent } from './question/addquestions.component';
import { QuestionslistComponent } from './question/questionslist.component';
import { ClientComponent } from './client/client.component';
import { AddclientComponent } from './client/addclient.component';
import { SubcourseComponent } from './courses/subcourse.component';
import { AssignedquestionsComponent } from './question/assignedquestions.component';
import { SubmittedAnswerByClientComponent } from './question/submitted-answer-by-client.component';
import { ContactComponent } from './contact/contact.component';
import { TutoriallistComponent } from './courses/tutoriallist.component';
import { AddtutorialComponent } from './courses/addtutorial.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from './notification.component';
import { AddnotificationComponent } from './addnotification.component';
import { VideoComponent } from './video/video.component';
import { AddvideoComponent } from './video/addvideo.component';
import { AddlecturetopicComponent } from './video/addlecturetopic.component';
import { LecturetopiclistComponent } from './video/lecturetopiclist.component';
import { GiveanswerComponent } from './asked/giveanswer.component';
import { GiveanswerFormComponent } from './asked/giveanswer-form.component';//////
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TeacherregisteredComponent } from './teacher/teacherregistered.component';
import { TeachercourseComponent } from './teacher/teachercourse.component';
import { TeachervideoComponent } from './teacher/teachervideo.component';
import { LoginComponent } from './login.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { PendingordersComponent } from './orders/pendingorders.component';
 
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    CoursesComponent,
    AddquestionsComponent,
    QuestionslistComponent,
    ClientComponent,
    AddclientComponent,
    SubcourseComponent,
    AssignedquestionsComponent,
    SubmittedAnswerByClientComponent,
    ContactComponent,

    TutoriallistComponent,

    AddtutorialComponent,

    NotificationComponent,

    AddnotificationComponent,

    VideoComponent,

    AddvideoComponent,

    AddlecturetopicComponent,

    LecturetopiclistComponent,

    GiveanswerComponent,

    GiveanswerFormComponent,

    TeacherregisteredComponent,

    TeachercourseComponent,

    TeachervideoComponent,

    LoginComponent,

    PendingordersComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, HttpClientModule,AngularEditorModule , FormsModule, InfiniteScrollModule,FileUploadModule,ReactiveFormsModule,MyDateRangePickerModule
  ],
  providers: [CommonServiceService,  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
