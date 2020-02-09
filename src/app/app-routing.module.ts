import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StudyCourseListComponent } from './components/study-course-list/study-course-list.component';
import { StudyCourseDetailsComponent } from './components/study-course-details/study-course-details.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { AppAuthGuard } from './keycloak/AppAuthGuard';
import { ContactComponent } from './components/legal-issues/contact/contact.component';
import { ImpressumComponent } from './components/legal-issues/impressum/impressum.component';
import { DataProtectionComponent } from './components/legal-issues/data-protection/data-protection.component';
import { LiabilityNoticeComponent } from './components/legal-issues/liability-notice/liability-notice.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfessorListComponent } from './components/professor-list/professor-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'projects',
    component: ProjectListComponent
  },
  {
    path: 'projects/:id',
    component: ProjectDetailsComponent
  },
  {
    path: 'study-courses',
    component: StudyCourseListComponent
  },
  {
    path: 'study-courses/:id',
    component: StudyCourseDetailsComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'impressum',
    component: ImpressumComponent
  },
  {
    path: 'data-protection',
    component: DataProtectionComponent
  },
  {
    path: 'liability-notice',
    component: LiabilityNoticeComponent
  },
  {
    path: 'user-profile',
    component: UserProfileComponent
  },
  {
    path: 'professors',
    component: ProfessorListComponent
  },
  {
    path: 'professors/:id',
    component: UserProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AppAuthGuard]
})
export class AppRoutingModule {}
