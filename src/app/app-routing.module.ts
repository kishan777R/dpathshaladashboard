import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { CoursesComponent } from './courses/courses.component';
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
import { NotificationComponent } from './notification.component';
import { AddnotificationComponent } from './addnotification.component';//////
import { VideoComponent } from './video/video.component';//////
import { AddvideoComponent } from './video/addvideo.component';//////
import { AddlecturetopicComponent } from './video/addlecturetopic.component';
import { LecturetopiclistComponent } from './video/lecturetopiclist.component';//////
import { GiveanswerComponent } from './asked/giveanswer.component';//////
import { GiveanswerFormComponent } from './asked/giveanswer-form.component';//////

import { TeacherregisteredComponent } from './teacher/teacherregistered.component';
import { TeachercourseComponent } from './teacher/teachercourse.component';
import { TeachervideoComponent } from './teacher/teachervideo.component';
import { LoginComponent } from './login.component';
import { PendingordersComponent } from './orders/pendingorders.component';



const routes: Routes = [{
  path: '',
  redirectTo: '/dashboard',
  pathMatch: 'full'
},


{ path: 'dashboard', component: DashboardComponent },
{ path: 'courses', component: CoursesComponent },
{ path: 'subcourses', component: SubcourseComponent },
{ path: 'contactus', component: ContactComponent },
{ path: 'pendingorders', component: PendingordersComponent },

{ path: 'questionlist', component: QuestionslistComponent },
{ path: 'addquestion/:qid', component: AddquestionsComponent },
{ path: 'assignedquestions/:submitted', component: AssignedquestionsComponent },
{ path: 'submitted_answers/:value', component: SubmittedAnswerByClientComponent },
{ path: 'clientlist/:module', component: ClientComponent },
{ path: 'addclient/:cid', component: AddclientComponent },
{ path: 'tutoriallist', component: TutoriallistComponent },
{ path: 'addtutorial/:tid', component: AddtutorialComponent },

{ path: 'notificationList', component: NotificationComponent },
{ path: 'addnotification/:nid', component: AddnotificationComponent },

{ path: 'topicList', component:LecturetopiclistComponent },
{ path: 'addtopic/:tid', component: AddlecturetopicComponent },


{ path: 'videoList', component: VideoComponent },
{ path: 'addvideo/:vid', component: AddvideoComponent },




{ path: 'askedquestionlist/:askedquestiontype', component: GiveanswerComponent },
{ path: 'askedquestionlist_form/:aid', component: GiveanswerFormComponent },

{ path: 'teacherlist', component: TeacherregisteredComponent },
 
{ path: 'teachercourses/:coursestatus', component: TeachercourseComponent },
 
{ path: 'teacherlecture/:lecturestatus', component: TeachervideoComponent },
 
{ path: 'login', component: LoginComponent },
 

{ path: '**', component: DashboardComponent }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
