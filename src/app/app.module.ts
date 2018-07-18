import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AlertModule } from 'ngx-alerts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// tslint:disable-next-line:max-line-length
import {
  MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule,
  MatSelectModule, MatProgressSpinnerModule,
  MatInputModule,
  MatCheckboxModule,
  MAT_CHECKBOX_CLICK_ACTION,
  MatSlideToggleModule,
  MatTooltipModule,
  MatCardModule,
  MatAutocompleteModule
} from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { ErrorPageComponent } from './error-page/error-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './services/auth-guard.service';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { SignupComponent } from './signup/signup.component';
import { CompanyComponent } from './master/company/company.component';
import { UserComponent } from './master/user/user.component';
import { ProjectComponent } from './master/project/project.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EngineService } from './services/engine.service';
import { CreateUserComponent } from './master/user/create-user/create-user.component';
import { DashboardToolsComponent } from './dashboard/dashboard-tools/dashboard-tools.component';
import { CookieModule } from 'ngx-cookie';
import { CreateProjectComponent } from './master/project/create-project/create-project.component';
import { CreateCompanyComponent } from './master/company/create-company/create-company.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { CreateTeamComponent } from './master/team/create-team/create-team.component';
import { TeamComponent } from './master/team/team.component';
import { EditUserDialogComponent } from './master/modal/edit-user-dialog/edit-user-dialog.component';
import { EditProjectComponent } from './master/modal/edit-project/edit-project.component';
import { EditCompanyComponent } from './master/modal/edit-company/edit-company.component';
import { EditTeamComponent } from './master/modal/edit-team/edit-team.component';
import { CalendarComponent } from './transaction/calendar/calendar.component';

import { MeslogComponent } from './transaction/meslog/meslog.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { AlertComponent } from './master/modal/alert/alert.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EditAuthGuard } from './services/edit-auth-guard.service';
import { MasterAuthGuard } from './services/master-auth-guard.service';
import { FileDropModule } from 'ngx-file-drop';
import { LeadTypeComponent } from './master/lead-type/lead-type.component';
import { CreateLeadTypeComponent } from './master/lead-type/create-lead-type/create-lead-type.component';
import { EditLeadTypeComponent } from './master/modal/edit-lead-type/edit-lead-type.component';
import { CreateLeadComponent } from './transaction/create-lead/create-lead.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CalendarModule } from 'angular-calendar';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import 'flatpickr/dist/flatpickr.css';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    DropdownDirective,
    ErrorPageComponent,
    PageNotFoundComponent,
    SignupComponent,
    CompanyComponent,
    UserComponent,
    ProjectComponent,
    LeadTypeComponent,
    CreateTeamComponent,
    DashboardComponent,
    EditUserDialogComponent,
    CreateUserComponent,
    DashboardToolsComponent,
    CreateProjectComponent,
    EditProjectComponent,
    CreateCompanyComponent,
    EditCompanyComponent,
    CreateLeadComponent,
    CreateTeamComponent,
    TeamComponent,
    CreateLeadTypeComponent,
    EditTeamComponent,
    EditLeadTypeComponent,
    MeslogComponent,
    TimeAgoPipe,
    AlertComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    AppRoutingModule,
    NgxDatatableModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatInputModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    NgxSpinnerModule,
    FileDropModule,
    CalendarModule.forRoot(),
    NgbModule.forRoot(),
    NgbModalModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot(),
    AlertModule.forRoot({ maxMessages: 5, timeout: 3000 })
  ],

  entryComponents: [
    EditUserDialogComponent,
    EditProjectComponent,
    EditCompanyComponent,
    EditTeamComponent,
    EditLeadTypeComponent,
    AlertComponent,
    MeslogComponent],

  schemas: [NO_ERRORS_SCHEMA],

  providers: [
    AuthGuard,
    EditAuthGuard,
    MasterAuthGuard,
    CanDeactivateGuard,
    EngineService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check' }
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
  title = 'Lakshya';
}
