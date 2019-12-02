import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AngularHalModule } from 'angular4-hal';

import { ExternalConfigurationService } from './core/services/external-configuration.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudyCourseListComponent } from './components/study-course-list/study-course-list.component';
import { StudyCourseDetailsComponent } from './components/study-course-details/study-course-details.component';
import { HeaderComponent } from './core/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './core/footer/footer.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProjectDialogComponent } from './components/project-dialog/project-dialog.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { keycloakInitializer } from './keycloak/keycloak-init';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserComponent } from './components/user/user.component';
import { BearerInterceptor } from './keycloak/BearerInterceptor';
import { KeyCloakUser } from './keycloak/KeyCloakUser';
import { MatConfirmDialogComponent } from './shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ContactComponent } from './components/legal-issues/contact/contact.component';
import { ImpressumComponent } from './components/legal-issues/impressum/impressum.component';
import { DataProtectionComponent } from './components/legal-issues/data-protection/data-protection.component';
import { LiabilityNoticeComponent } from './components/legal-issues/liability-notice/liability-notice.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    StudyCourseListComponent,
    StudyCourseDetailsComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ProjectListComponent,
    ProjectDetailsComponent,
    ProjectDialogComponent,
    UserComponent,
    MatConfirmDialogComponent,
    ContactComponent,
    ImpressumComponent,
    DataProtectionComponent,
    LiabilityNoticeComponent,
    UserProfileComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularHalModule.forRoot(),
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    KeycloakAngularModule
  ],
  entryComponents: [ProjectDialogComponent, MatConfirmDialogComponent],
  providers: [
    {
      provide: 'ExternalConfigurationService',
      useClass: ExternalConfigurationService
    },
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitializer,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BearerInterceptor,
      multi: true
    },
    KeyCloakUser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
