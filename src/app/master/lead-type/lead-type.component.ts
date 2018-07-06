import { Component, OnInit, OnDestroy } from '@angular/core';
import { EngineService } from '../../services/engine.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog } from '@angular/material';
import { timer } from 'rxjs/internal/observable/timer';

@Component({
  selector: 'app-lead-type',
  templateUrl: './lead-type.component.html',
  styleUrls: ['./lead-type.component.scss']
})
export class LeadTypeComponent implements OnInit, OnDestroy {

  private timerSubscription: Subscription;
  hoveredRow: any[] = [];
  val = '';
  url: any;
  temp: any[];
  initialLength = 0;
  updatedLength = 0;
  rows: any[];
  loadingIndicator = true;
  columns = [
    {
      prop: 'CompanyID',
      name: 'ID'
    }, {
      prop: 'CompanyName',
      name: 'Company'
    }, {
      prop: 'IsClient',
      name: 'Client'
    }, {
      prop: 'Add1',
      name: 'Address Line 1'
    }, {
      prop: 'Add2',
      name: 'Line 2'
    }, {
      prop: 'Add3',
      name: 'Line 3'
    }, {
      prop: 'City',
      name: 'City'
    }, {
      prop: 'State',
      name: 'State'
    }, {
      prop: 'Pincode',
      name: 'Pincode'
    }, {
      prop: 'Country',
      name: 'Country'
    }, {
      prop: 'LandLineNo',
      name: 'LandLineNo'
    }, {
      prop: 'Status',
      name: 'Status'
    }
  ];
  public radioModel = 'Desktop';
  userRole: string;

  // tslint:disable-next-line:max-line-length
  constructor(private engineService: EngineService, private alertService: AlertService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.refreshData();
    this.userRole = this.engineService.userRole;
    // console.log(this.userRole);
  }

  public exportExcel(): void {
    this.engineService.downloadExcel(this.rows, 'LeadType');
  }

  private subscribeToData(): void {

    this.timerSubscription = timer(5 * 60 * 1000)
      .subscribe(() => {
        this.refreshData();
      });
  }

  public updateFilter() {
    const val = this.val.toLocaleLowerCase().trim();

    // filter our rows
    const temp = this.temp.filter(function (d) {
      if (d.TypeName.toLowerCase().indexOf(val) !== -1 || !val) {
        return true;
      } else {
        return false;
      }
    });

    // update the rows
    this.rows = temp;
    this.updatedLength = temp.length;
  }

  private updateLeadType(leadtypes: any) {
    this.rows = leadtypes;
    this.temp = [...this.rows];
    this.initialLength = this.temp.length;
    this.updatedLength = this.temp.length;
    this.loadingIndicator = false;
  }

  private onClear(): void {
    this.val = '';
    this.updateFilter();
  }

  private refreshData(): void {
    this.url = 'Lead/GetLeadType';
    this.engineService.getData(this.url)
      .toPromise()
      .then(res => {
        // console.log(JSON.stringify(res));
        this.updateLeadType(res);
        this.subscribeToData();
        this.updateFilter();
      }).catch(err => {
        // console.log(err);
        this.alertService.danger('Server response error @refreshData');
      });
  }

  private onActivate(event) {

  }

  private onSelect({ selected }) {
    // console.log(selected);
  }

  private editRow(row) {
    // console.log(row);
    const dialogRef = this
      .dialog
      .open(EditLeadTypeComponent, {
        minWidth: '60%',
        maxWidth: '95%',
        panelClass: 'editDialog',
        data: row,
        hasBackdrop: true,
        closeOnNavigation: true
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
        // // console.log('The dialog was closed');
        this.refreshData();
      });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
