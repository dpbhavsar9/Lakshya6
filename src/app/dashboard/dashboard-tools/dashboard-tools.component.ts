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
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Router } from '../../../../node_modules/@angular/router';


@Component({
  selector: 'app-dashboard-tools',
  templateUrl: './dashboard-tools.component.html',
  styleUrls: ['./dashboard-tools.component.scss']
})
export class DashboardToolsComponent implements OnInit, OnDestroy {

  url: string;
  selected = 'New';
  leadLogTypeSelector = 'In Process';
  data: any[] = [{ 'LeadStatus': 'New', 'Count': 0 },
  { 'LeadStatus': 'In Process', 'Count': 0 },
  { 'LeadStatus': 'Won', 'Count': 0 },
  { 'LeadStatus': 'Lost', 'Count': 0 },
  { 'LeadStatus': 'Hold', 'Count': 0 }
  ];
  manualUpdateFlag = false;
  source: any[] = [{
    'status': 'New',
    'data': []
  }, {
    'status': 'In Process',
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
  excelData: any[] = [];
  collpaseArray: any[] = [];
  isCollapsed = true;
  private timerSubscription: Subscription;
  closeModal: Subscription;
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
  attachment: Array<any> = [];
  loadingIndicator = false;
  event = {
    LeadID: '',
    LeadNo: '',
    OperationBy: '',
    OperationDate: '',
    Remarks: '',
    ProjectID: 0,
    CompanyID: 0,
    AlertDate: '',
    Subject: ''
  };
  teamName = '';
  leadStatusMessageCounter: any[] = [];
  // byMeLeadCounterSubscription: Subscription;
  // forMeLeadCounterSubscription: Subscription;

  public chartDatasets: Array<any> = [
    // tslint:disable-next-line:max-line-length
    { data: [0, 0, 0], label: 'Status comparison' }
  ];

  public chartLabels: Array<any> = ['New', 'In Process', 'Won'];

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
    private router: Router,
    // tslint:disable-next-line:max-line-length
    private _cookieService: CookieService, private alertService: AlertService, public dialog: MatDialog, private dashboardComponent: DashboardComponent) {
    const cookieData = crypto.AES.decrypt(this._cookieService.get('response'), this._cookieService.get('Oid') + 'India');
    this.Oid = JSON.parse(cookieData.toString(crypto.enc.Utf8)).Oid;
    this.userName = JSON.parse(cookieData.toString(crypto.enc.Utf8)).UserName;

    this.closeModal = this.engineService.getCloseModal().subscribe(res => {
      this.dialog.closeAll();
    });
  }

  toggleChart() {
    this.chartVisible = !this.chartVisible;
  }

  public exportExcel(): void {
    const data = [];
    this.excelData.forEach(e => {

      data.push({
        LeadNo: e.LeadNo,
        Subject: e.Subject,
        Description: e.LeadDescription,
        Team: e.TeamName,
        Priority: e.Priority,
        Project: e.ProjectName,
        LeadStatus: e.LeadStatusDescription,
        TeamLeader: e.TeamLeaderName,
        NewBy: e.NewByName,
        AssignBy: e.AssignByName,
        AssignTo: e.AssignToName,
        LostBy: e.LostByName,
        WonBy: e.WonByName,
        HoldBy: e.HoldByName,
        Company: e.CompanyName,
        Category: e.LeadCategory + ' Diamond',
        ClientName: e.ClientName,
        EmailID: e.EmailID,
        Alerts: e.AlertCount
      });
    });
    if (this.dashboardState === 'byme') {
      this.engineService.downloadExcel(data, 'Leads-CreatedByMe');
    } else if (this.dashboardState === 'myleads') {
      this.engineService.downloadExcel(data, 'Leads-ForMyTeam');
    }
  }

  public updateFilter() {
    this.loadingIndicator = true;
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
        } else if (d.LeadDescription.toLowerCase().indexOf(val) !== -1 || !val) {
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
        } else if (d.LostByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.HoldByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.NewByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.InProcessByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.WonByName.toLowerCase().indexOf(val) !== -1 || !val) {
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
      } else if (searchIn === 'Category') {
        if (d.LeadCategory.toString().toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'Description') {
        if (d.TicketDescription.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'Team') {
        if (d.TeamName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'Project') {
        if (d.ProjectName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'Company') {
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
      } else if (searchIn === 'Subject') {
        if (d.Subject.toLowerCase().indexOf(val) !== -1 || !val) {
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
        if (d.HoldByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'LostByName') {
        if (d.LostByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'NewByName') {
        if (d.NewByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'WonByName') {
        if (d.WonByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'InProcessByName') {
        if (d.InProcessByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'Client') {
        if (d.ClientName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'Email') {
        if (d.EmailID.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'ContactPerson') {
        if (d.ContactPerson1.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.ContactPerson2.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.ContactPerson3.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'ContactNumber') {
        if (d.ContactNumber1.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.ContactNumber2.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.ContactNumber3.toLowerCase().indexOf(val) !== -1 || !val) {
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
    for (let i = 0; i <= 4; i++) {
      this.source[i].data = this.source[i].data.sort((a, b) => {
        if (a.Count < b.Count) {
          return 1;
        } else if (a.Count > b.Count) {
          return -1;
        } else {
          return 0;
        }
      });
    }
    this.chartDatasets = [
      // tslint:disable-next-line:max-line-length
      { data: [this.data[0].Count, this.data[1].Count, this.data[2].Count], label: 'Status comparison' }
    ];
    this.loadingIndicator = false;
  }

  updateLeads(tickets: any) {
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
  }

  updateleadLogTypeSelector(id: number) {
    this.leadLogTypeSelector = this.data[id].LeadStatus;
  }

  ngOnInit() {

    this.dashboardComponent.cloneDashboardState = this.dashboardState;
    this.Oid = this._cookieService.get('Oid');
    const Decrypt = crypto.AES.decrypt(this._cookieService.get('response').toString(), this.Oid + 'India');
    const decryptData = Decrypt.toString(crypto.enc.Utf8);
    this.userRole = JSON.parse(decryptData).UserRole;
    this.userName = JSON.parse(decryptData).UserName;
    if (this.userRole !== 'Administrator') {
      if (this._cookieService.get('TeamID') === undefined) {
        // this.alertService.info('Please select team');
        this.router.navigate(['/dashboard']);
      }
      this.teamName = this._cookieService.get('TeamName');
      this.refreshData();
      this.subscription = this.engineService.getDashboardState().subscribe(dashboardState => {
        this.dashboardState = dashboardState.dashboardState.toString();
        this.refreshData();
      });
    }
  }

  private subscribeToData(): void {
    const timerVar = timer(5 * 60 * 1000);
    this.timerSubscription = timerVar.subscribe(() => {
      this.refreshData();
    });
  }

  public refreshData(): void {
    this.loadingIndicator = true;
    if (this.dashboardState === 'byme') {
      this.url = 'Lead/GetMyLeads/' + this._cookieService.get('Oid');
      this.allocationType = 'Team';
    } else if (this.dashboardState === 'myleads') {
      this.url = 'Lead/GetTeamLeads/' + this._cookieService.get('Oid');
    }
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        console.log(res);
        let count = 0;
        if (this.dashboardState === 'byme') {
          res = res.filter(x => x.TeamID.toString() === this._cookieService.get('TeamID').toString());
          res.forEach(element => {
            count = count + element.Count;
          });
          this.excelData = res;
          this.engineService.updateByMeLeadCounter(count);
        } else if (this.dashboardState === 'myleads') {
          res = res.filter(x => x.TeamID.toString() === this._cookieService.get('TeamID').toString());
          res.forEach(element => {
            count = count + element.Count;
          });
          this.excelData = res;
          this.engineService.updateForMeLeadCounter(count);
        }

        this.updateLeads(res);
        this.updateFilter();
        if (!this.manualUpdateFlag) {
          this.subscribeToData();
        }
        this.manualUpdateFlag = false;
      }).catch(err => {
        this.alertService.danger('Server response error @refreshData');
      });
    this.loadingIndicator = false;
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

  private openLeadMessage(index, pindex) {
    this.engineService.validateUser();
    const row = this.source[index].data[pindex];
    // let x = 0;
    // if (this.dashboardState === 'myleads') {

    //   this.forMeLeadCounterSubscription = this.engineService.getForMeLeadsCounter().subscribe(forMeLeadCounter => {
    //     x = Number(forMeLeadCounter.forMeLeadCounter);
    //     console.log('myleads: ', x);
    //   });
    //   const y = x - Number(row['Count']);
    //   this.engineService.updateForMeLeadCounter(y);
    // } else if (this.dashboardState === 'byme') {
    //   console.log('byme');
    //   this.byMeLeadCounterSubscription = this.engineService.getByMeLeadsCounter().subscribe(byMeLeadCounter => {
    //     x = Number(byMeLeadCounter.byMeLeadCounter);
    //     console.log('myleads: ', x);
    //   });
    //   const y = x - Number(row['Count']);
    //   this.engineService.updateByMeLeadCounter(y);
    // }

    row['Count'] = 0;
    const data = {
      'CompanyID': row['CompanyID'],
      'ProjectID': row['ProjectID'],
      'LeadID': row['Oid'],
      'LeadNo': row['LeadNo'],
      'LeadStatus': row['LeadStatus']
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
        this.manualUpdateFlag = true;
        this.refreshData();
      });
  }

  updateAlertModal(i, p) {
    this.engineService.validateUser();
    const row = this.source[i].data[p];
    const Oid = row['Oid'];
    const LeadNo = row['LeadNo'];
    const Subject = row['Subject'];
    const ProjectID = row['ProjectID'];
    const CompanyID = row['CompanyID'];
    const OperationBy = this._cookieService.get('Oid');
    this.event = {
      LeadID: Oid,
      LeadNo: LeadNo,
      OperationBy: OperationBy,
      ProjectID: ProjectID,
      CompanyID: CompanyID,
      Subject: Subject,
      OperationDate: '',
      Remarks: '',
      AlertDate: ''
    };
  }

  createAlert() {
    this.url = 'Lead/PostAlert';
    this.engineService.postData(this.url, this.event).then(result => {
    }).catch(err => {
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

  markasRead(i, p) {
    this.url = 'Lead/PutNotificationFlag';
    this.engineService.validateUser();
    const row = this.source[i].data[p];
    const Oid = row['Oid'];
    const by = this._cookieService.get('Oid');
    const data = { UserID: by, LeadID: Oid };
    this.engineService.updateData(this.url, data).then(result => {
      this.source[i].data[p].read = 1;
    });
  }

  changeCategory(i, p, LeadCategory) {
    this.engineService.validateUser();
    const row = this.source[i].data[p];
    const Oid = row['Oid'];
    const by = this._cookieService.get('Oid');
    const data = { Oid: Oid, LeadCategory: LeadCategory, By: by };
    this.url = 'Lead/ChangeCategory';
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

  processLead(id, status) {
    this.engineService.validateUser();
    let data;
    let message;
    const by = this._cookieService.get('Oid');
    switch (status) {

      case 1: {
        data = { Oid: id, LeadStatus: status, By: by };
        message = 'Re-open lead?';
        break;
      }
      case 2: {
        data = { Oid: id, LeadStatus: status, By: by };
        message = 'Put this lead in In Process?';
        break;
      }
      case 3: {
        data = { Oid: id, LeadStatus: status, By: by };
        message = 'Won this lead?';
        break;
      }
      case 4: {
        data = { Oid: id, LeadStatus: status, By: by };
        message = 'Lost this lead?';
        break;
      }
      case 5: {
        data = { Oid: id, LeadStatus: status, By: by };
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

    this.attachment.length = 0;
    this.url = 'Lead/GetAttachment/' + data.LeadNo;
    this.engineService.getData(this.url).subscribe(res => {
      this.attachment = res;
    });
    this.modalData = data;

  }

  ngOnDestroy() {
    if (this.userRole !== 'Administrator') {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.subscription.unsubscribe();
      this.closeModal.unsubscribe();
    }
    this.dashboardComponent.cloneDashboardState = 'none';
    // if (this.byMeLeadCounterSubscription) {
    //   this.byMeLeadCounterSubscription.unsubscribe();
    // }
    // if (this.forMeLeadCounterSubscription) {
    //   this.forMeLeadCounterSubscription.unsubscribe();
    // }
  }
}
