import { Component, OnInit, OnDestroy } from '@angular/core';
import { EngineService } from '../../services/engine.service';
import { CookieService } from 'ngx-cookie';
import { AlertService } from 'ngx-alerts';
import { MatDialog } from '@angular/material';
import { AlertComponent } from '../../master/modal/alert/alert.component';
import * as crypto from 'crypto-js';
import { DashboardComponent } from '../dashboard.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { timer } from 'rxjs/internal/observable/timer';
import { Observable } from 'rxjs/internal/Observable';
import { MeslogComponent } from '../../transaction/meslog/meslog.component';


@Component({
  selector: 'app-dashboard-tools',
  templateUrl: './dashboard-tools.component.html',
  styleUrls: ['./dashboard-tools.component.scss']
})
export class DashboardToolsComponent implements OnInit, OnDestroy {

  url: string;
  selected = 'New';
  leadLogTypeSelector = 'Pipeline';
  data: any[] = [{ 'TicketStatus': 'New', 'Count': 0 },
  { 'TicketStatus': 'Pipeline', 'Count': 0 },
  { 'TicketStatus': 'Won', 'Count': 0 },
  { 'TicketStatus': 'Lost', 'Count': 0 },
  { 'TicketStatus': 'Hold', 'Count': 0 }
  ];
  manualUpdateFlag = false;
  source: any[] = [{
    'status': 'New',
    'data': []
  }, {
    'status': 'Pipeline',
    'data': []
  }, {
    'status': 'Won',
    'data': []
  }, {
    'status': 'Lost',
    'data': []
  }, {
    'status': 'Hold',
    'data': []
  }];

  collpaseArray: any[] = [];
  isCollapsed = true;
  private timerSubscription: Subscription;
  subscription: Subscription;
  private toggle = 'none';
  dashboardState: string = this.dashboardComponent.dashboardState;
  userRole: string;
  userName: string;
  val = '';
  valSort = '';
  ascSort = 'true';
  rows: any[] = [];
  temp: any[] = [];
  Oid: string;
  allocationType = 'Team';
  searchIn = 'Multiple';
  condensedView = false;
  modalData: any = {};
  chartVisible = false;
  public chartType = 'bar';

  public chartDatasets: Array<any> = [
    // tslint:disable-next-line:max-line-length
    { data: [0, 0, 0], label: 'Status comparison' }
  ];

  public chartLabels: Array<any> = ['New', 'Pipeline', 'Won'];

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(248, 126, 126, 0.8)',
      borderColor: 'rgba(248, 126, 126, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(220,220,220,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(220,220,220,1)'
    },
    {
      backgroundColor: 'rgba(38,192,218,0.8)',
      borderColor: 'rgba(38,192,218,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(151,187,205,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(151,187,205,1)'
    },
    {
      backgroundColor: 'rgba(151,187,205,0.8)',
      borderColor: 'rgba(151,187,205,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(151,187,205,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(151,187,205,1)'
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  constructor(private engineService: EngineService,
    // tslint:disable-next-line:max-line-length
    private _cookieService: CookieService, private alertService: AlertService, public dialog: MatDialog, private dashboardComponent: DashboardComponent) {
    const cookieData = crypto.AES.decrypt(this._cookieService.get('response'), this._cookieService.get('Oid') + 'India');
    this.Oid = JSON.parse(cookieData.toString(crypto.enc.Utf8)).Oid;
    this.userName = JSON.parse(cookieData.toString(crypto.enc.Utf8)).UserName;
  }

  toggleChart() {
    this.chartVisible = !this.chartVisible;
  }

  public updateFilter() {
    const userName = this.userName;
    const allocationType = this.allocationType;
    const val = this.val.toLocaleLowerCase();
    const searchIn = this.searchIn;
    let res = this.temp;

    res = res.filter(function (d) {
      if (allocationType === 'OnlyMe' && d.AssignToName.toLocaleLowerCase() === userName.toLocaleLowerCase()) {
        return true;
      } else if (allocationType === 'ExceptMe' && d.AssignToName.toLocaleLowerCase() !== userName.toLocaleLowerCase()) {
        return true;
      } else if (allocationType === 'Team') {
        return true;
      } else {
        return false;
      }
    });

    res = res.filter(function (d) {
      if (searchIn === 'Multiple') {
        if (d.Subject.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.LeadNo.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.TicketDescription.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.TeamName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.ProjectName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.CompanyName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.Priority.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.AssignByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.AssignToName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.CancelByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.CloseByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.CreatedByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.HoldByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.WIPByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'LeadNo') {
        if (d.LeadNo.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'TicketDescription') {
        if (d.TicketDescription.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'TeamName') {
        if (d.TeamName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'ProjectName') {
        if (d.ProjectName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'CompanyName') {
        if (d.CompanyName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'Priority') {
        if (d.Priority.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'AssignByName') {
        if (d.AssignByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'AssignToName') {
        if (d.AssignToName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'HoldByName') {
        if (d.CancelByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'LostByName') {
        if (d.CloseByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'NewByName') {
        if (d.CreatedByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'WonByName') {
        if (d.HoldByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'PipelineByName') {
        if (d.WIPByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      }
    });

    res = res.sort((a, b) => {
      switch (this.valSort) {
        case 'LeadNo':
          if (this.ascSort === 'true') {
            if (a.LeadNo < b.LeadNo) {
              return -1;
            } else if (a.LeadNo > b.LeadNo) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (a.LeadNo < b.LeadNo) {
              return 1;
            } else if (a.LeadNo > b.LeadNo) {
              return -1;
            } else {
              return 0;
            }

          }
        case 'Priority':
          if (this.ascSort === 'true') {
            if (a.Priority < b.Priority) {
              return -1;
            } else if (a.Priority > b.Priority) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (a.Priority < b.Priority) {
              return 1;
            } else if (a.Priority > b.Priority) {
              return -1;
            } else {
              return 0;
            }
          }
        case 'Subject':
          if (this.ascSort === 'true') {
            if (a.Subject < b.Subject) {
              return -1;
            } else if (a.Subject > b.Subject) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (a.Subject < b.Subject) {
              return 1;
            } else if (a.Subject > b.Subject) {
              return -1;
            } else {
              return 0;
            }
          }

        case 'LeadDescription':
          if (this.ascSort === 'true') {
            if (a.LeadDescription < b.LeadDescription) {
              return -1;
            } else if (a.LeadDescription > b.LeadDescription) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (a.LeadDescription < b.LeadDescription) {
              return 1;
            } else if (a.LeadDescription > b.LeadDescription) {
              return -1;
            } else {
              return 0;
            }
          }

        case 'NewDate':
          if (this.ascSort === 'true') {
            if (a.NewDate < b.NewDate) {
              return -1;
            } else if (a.NewDate > b.NewDate) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (a.NewDate < b.NewDate) {
              return 1;
            } else if (a.NewDate > b.NewDate) {
              return -1;
            } else {
              return 0;
            }
          }


        default:
          // console.log('6');
          if (a.NewDate < b.NewDate) {
            return -1;
          } else if (a.NewDate > b.NewDate) {
            return 1;
          } else {
            return 0;
          }
      }
    });

    // update the rows
    this.source[0].data = res.filter(x => x.LeadStatus === 1);
    this.source[1].data = res.filter(x => x.LeadStatus === 2);
    this.source[2].data = res.filter(x => x.LeadStatus === 3);
    this.source[3].data = res.filter(x => x.LeadStatus === 4);
    this.source[4].data = res.filter(x => x.LeadStatus === 5);
    this.data[0].Count = this.source[0].data.length;
    this.data[1].Count = this.source[1].data.length;
    this.data[2].Count = this.source[2].data.length;
    this.data[3].Count = this.source[3].data.length;
    this.data[4].Count = this.source[4].data.length;
    this.chartDatasets = [
      // tslint:disable-next-line:max-line-length
      { data: [this.data[0].Count, this.data[1].Count, this.data[2].Count], label: 'Status comparison' }
    ];
  }

  updateTickets(tickets: any) {
    // console.log(tickets);
    this.rows = tickets;
    this.temp = tickets;
    // update the rows
    this.source[0].data = this.temp.filter(x => x.LeadStatus === 1);
    this.source[1].data = this.temp.filter(x => x.LeadStatus === 2);
    this.source[2].data = this.temp.filter(x => x.LeadStatus === 3);
    this.source[3].data = this.temp.filter(x => x.LeadStatus === 4);
    this.source[4].data = this.temp.filter(x => x.LeadStatus === 5);
    this.data[0].Count = this.source[0].data.length;
    this.data[1].Count = this.source[1].data.length;
    this.data[2].Count = this.source[2].data.length;
    this.data[3].Count = this.source[3].data.length;
    this.data[4].Count = this.source[4].data.length;
  }

  updateleadLogTypeSelector(id: number) {
    this.leadLogTypeSelector = this.data[id].TicketStatus;
  }

  ngOnInit() {
    this.dashboardComponent.cloneDashboardState = this.dashboardState;
    this.Oid = this._cookieService.get('Oid');
    const Decrypt = crypto.AES.decrypt(this._cookieService.get('response').toString(), this.Oid + 'India');
    const decryptData = Decrypt.toString(crypto.enc.Utf8);
    this.userRole = JSON.parse(decryptData).UserRole;
    this.userName = JSON.parse(decryptData).UserName;
    if (this.userRole !== 'Administrator') {
      this.refreshData();
      this.subscription = this.engineService.getDashboardState().subscribe(dashboardState => {
        this.dashboardState = dashboardState.dashboardState.toString();
        this.refreshData();
      });
    }
  }

  private subscribeToData(): void {
    const timerVar = timer(2 * 60 * 1000);
    this.timerSubscription = timerVar.subscribe(() => {
      this.refreshData();
    });
  }

  private refreshData(): void {

    if (this.dashboardState === 'byme') {
      this.url = 'Lead/GetMyLeads/' + this._cookieService.get('Oid');
    } else if (this.dashboardState === 'myleads') {
      this.url = 'Lead/GetTeamLeads/' + this._cookieService.get('Oid');
    }
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        console.log(res);
        this.updateTickets(res);
        this.updateFilter();
        if (!this.manualUpdateFlag) {
          this.subscribeToData();
        }
        this.manualUpdateFlag = false;
      }).catch(err => {
        this.alertService.danger('Server response error @refreshData');
      });
  }

  private selectRow(row) {
    this.val = row.LeadNo;
    this.searchIn = 'LeadNo';
    this.condensedView = false;
    this.updateFilter();
  }

  public clearSerchCriteria() {
    this.condensedView = false;
    this.val = '';
    this.searchIn = 'Multiple';
    this.updateFilter();
  }

  private openTicketMessage(index, pindex) {
    this.engineService.validateUser();
    const row = this.source[index].data[pindex];

    const data = {
      'CompanyID': row['CompanyID'],
      'ProjectID': row['ProjectID'],
      'TicketID': row['Oid'],
      'LeadNo': row['LeadNo'],
      'TicketStatus': row['LeadStatus'],
    };

    const dialogRef = this
      .dialog
      .open(MeslogComponent, {
        minWidth: '60%',
        maxWidth: '95%',
        panelClass: 'leadDialog',
        data: data,
        hasBackdrop: true,
        closeOnNavigation: true
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
      });
  }

  changePriority(i, p, priority) {
    this.engineService.validateUser();
    const row = this.source[i].data[p];
    const Oid = row['Oid'];
    const by = this._cookieService.get('Oid');
    const data = { Oid: Oid, Priority: priority, By: by };
    this.url = 'Lead/ChangePriority';
    this.engineService.updateData(this.url, data).then(result => {
      this.manualUpdateFlag = true;
      this.refreshData();
    });
  }

  assignLead(i, p, assignTo) {
    this.engineService.validateUser();
    const row = this.source[i].data[p];
    const Oid = row['Oid'];
    const by = this._cookieService.get('Oid');
    const data = { Oid: Oid, AssignTo: assignTo, By: by };
    this.url = 'Lead/AssignLead';
    this.engineService.updateData(this.url, data).then(result => {
      this.manualUpdateFlag = true;
      this.refreshData();
    });
  }

  processTicket(id, status) {
    this.engineService.validateUser();
    let data;
    let message;
    const by = this._cookieService.get('Oid');
    switch (status) {

      case 1: {
        data = { Oid: id, TicketStatus: status, By: by };
        message = 'Re-open lead?';
        break;
      }
      case 2: {
        data = { Oid: id, TicketStatus: status, By: by };
        message = 'Put this lead in Pipeline?';
        break;
      }
      case 3: {
        data = { Oid: id, TicketStatus: status, By: by };
        message = 'Won this lead?';
        break;
      }
      case 4: {
        data = { Oid: id, TicketStatus: status, By: by };
        message = 'Lost this lead?';
        break;
      }
      case 5: {
        data = { Oid: id, TicketStatus: status, By: by };
        message = 'Hold this lead?';
        break;
      }
      default:
    }

    this.commonDialog(message).subscribe(res => {
      if (res === 'Yes') {
        this.url = 'Lead/ChangeStatus';
        this.engineService.updateData(this.url, data).then(result => {
          this.manualUpdateFlag = true;
          this.refreshData();
        });
      }
    });

  }

  commonDialog(message): Observable<any> {

    const dialogRef = this.dialog.open(AlertComponent, {
      height: 'auto',
      width: 'auto',
      minWidth: '300px',
      data: message,
      panelClass: 'leadDialog',
      hasBackdrop: true,
      closeOnNavigation: true
    });

    return dialogRef.afterClosed();
  }

  public updateModal(data) {
    // console.log(data);
    this.modalData = data;
  }

  ngOnDestroy() {
    if (this.userRole !== 'Administrator') {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.subscription.unsubscribe();
    }
    this.dashboardComponent.cloneDashboardState = 'none';
  }
}
