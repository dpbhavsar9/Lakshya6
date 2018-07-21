import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { EngineService } from '../services/engine.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../master/modal/alert/alert.component';
import * as crypto from 'crypto-js';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  checkPassword = false;
  title = 'Welcome';
  logoutflag = false;
  rows: any[] = [];
  openLeadCounter = 0;
  userName: string;
  userRole: string;
  password: string;
  UserCustomer: string;
  dashboardState = 'myleads';
  cloneDashboardState = this.dashboardState;
  dashboardStateSubscription: Subscription;
  teamSelectionState = true;
  teamSelectionSubscription: Subscription;
  byMeLeadCounterSubscription: Subscription;
  byMeLeadCounter = 0;
  forMeLeadCounterSubscription: Subscription;
  forMeLeadCounter = 0;
  url: string;
  Oid: string;
  typeVar = 'password';
  currPass: any;
  newPass: any;
  passForm: FormGroup;
  changePasswordVisible = false;

  constructor(
    private alertService: AlertService,
    private _cookieService: CookieService,
    private engineService: EngineService,
    public dialog: MatDialog,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.passForm = new FormGroup({
      currPass: new FormControl(null, [
        Validators.required,
      ]),
      newPass: new FormControl(null, [
        Validators.required,
      ])
    });

    this.engineService.updateTeamSelectionState(true);
    this.spinner.show();
    const cookieData = crypto.AES.decrypt(this._cookieService.get('response'), this._cookieService.get('Oid') + 'India');
    this.Oid = JSON.parse(cookieData.toString(crypto.enc.Utf8)).Oid;
    this.userName = JSON.parse(cookieData.toString(crypto.enc.Utf8)).UserName;
    this.userRole = JSON.parse(cookieData.toString(crypto.enc.Utf8)).UserRole;
    this.password = JSON.parse(cookieData.toString(crypto.enc.Utf8)).Password;

    // console.log("------- ngONIT -------------"+this.password)

    this.url = 'Lead/GetMyLeads/' + this._cookieService.get('Oid');
    this.engineService.getData(this.url).toPromise().then(res => {
      this.rows = res;
      this.openLeadCounter = res.filter(data => {
        if (data.LeadStatus.toString() === '1' ||
          data.LeadStatus.toString() === '2' ||
          data.LeadStatus.toString() === '3') {
          return true;
        }
      }).length;
      this.spinner.hide();

      this.dashboardStateSubscription = this.engineService.getDashboardState().subscribe(dashboardState => {
        this.dashboardState = dashboardState.dashboardState;
        this.cloneDashboardState = dashboardState.dashboardState;
      });
      this.teamSelectionSubscription = this.engineService.getTeamSelectionState().subscribe(teamSelectionState => {
        this.teamSelectionState = teamSelectionState.teamSelectionState;
      });
      this.byMeLeadCounterSubscription = this.engineService.getByMeLeadsCounter().subscribe(byMeLeadCounter => {
        this.byMeLeadCounter = Number(byMeLeadCounter.byMeLeadCounter);
      });
      this.forMeLeadCounterSubscription = this.engineService.getForMeLeadsCounter().subscribe(forMeLeadCounter => {
        this.forMeLeadCounter = Number(forMeLeadCounter.forMeLeadCounter);
      });

      this.engineService.getCookieData();
    }).catch();
  }

  toggleChangePasswordVisible() {
    this.changePasswordVisible = !this.changePasswordVisible;
  }

  resetForm() {
    this.changePasswordVisible = false;
    this.passForm.reset();
    this.passForm.markAsPristine();
    this.passForm.markAsUntouched();
    this.checkPassword = false;
  }

  updateDashboardState(state: string) {
    this.engineService.validateUser();
    this.engineService.updateDashboardState(state);
    this.dashboardState = state;
  }

  logout() {

    const dialogRef = this.dialog.open(AlertComponent, {
      height: 'auto',
      minWidth: '30%',
      data: 'Do you want to Logout ?',
      panelClass: 'leadDialog',
      hasBackdrop: true,
      closeOnNavigation: true
    });

    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result.toString() === 'Yes') {
          this._cookieService.removeAll();
          this.logoutflag = true;
          this.router.navigate(['/']);
        } else {
          this.logoutflag = false;
        }
        this.canDeactivate();
      });
  }

  changeOfRoutes() {
    this.engineService.currentRoute = this.router.url;
  }

  canDeactivate() {
    if (this._cookieService.get('Oid') !== this.Oid) {
      return true;
    }
    return this.logoutflag;
  }

  updateTypeVar() {
    if (this.typeVar === 'password') {
      this.typeVar = 'text';
    } else {
      this.typeVar = 'password';
    }
  }

  submitPass() {
    this.engineService.validateUser();
    const curPass = this.passForm.get('currPass').value;
    const newPass = this.passForm.get('newPass').value;

    const data = {
      Oid: this.Oid,
      Pass: newPass
    };
    const url = 'Users/ChangePassword';
    if (curPass === this.password) {
      this.engineService.updateData(url, data).then(res => {
        this.alertService.success('Password Changed SuccessFully');
        this._cookieService.removeAll();
        this.logoutflag = true;
        this.router.navigate(['/']);
      }).catch(err => {
        // console.log('---- Error ----' + err);
      });
    } else {
      this.checkPassword = true;
    }
  }

  focusChanged() {
    this.checkPassword = false;
  }

  onClick() {
    this.engineService.closeModal();
  }

  ngOnDestroy(): void {
    if (this.dashboardStateSubscription) { this.dashboardStateSubscription.unsubscribe(); }
    if (this.teamSelectionSubscription) { this.teamSelectionSubscription.unsubscribe(); }
    if (this.byMeLeadCounterSubscription) { this.byMeLeadCounterSubscription.unsubscribe(); }
    if (this.forMeLeadCounterSubscription) { this.forMeLeadCounterSubscription.unsubscribe(); }
  }

}
