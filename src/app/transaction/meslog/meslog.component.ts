import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EngineService } from '../../services/engine.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CookieService } from 'ngx-cookie';
import * as moment from 'moment';
import { timer } from 'rxjs/internal/observable/timer';


@Component({
  selector: 'app-meslog',
  templateUrl: './meslog.component.html',
  styleUrls: ['./meslog.component.scss']
})
export class MeslogComponent implements OnInit, OnDestroy {

  chatForm: FormGroup;
  url: any;
  message: Array<{
    Oid: any,
    AttachmentFlag: any,
    UserLetter: any,
    CompanyID: any,
    MessageLog: any,
    OperationBy: any,
    OperationDate: any,
    ProjectID: any,
    TicketID: any,
    LeadNo: any,
    TicketStatus: any,
    UserName: any,
    check: any
  }> = [];
  message_chat: any;
  ticketId: any;
  ticketNo: any;
  subscribe: any;
  ticketStatus: string;
  ticketData: any = [];
  showAttachment = false;

  // tslint:disable-next-line:max-line-length
  constructor(private engineService: EngineService,
    public dialogRef: MatDialogRef<MeslogComponent>,
    private _cookieService: CookieService, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.ticketData = {
      'CompanyID': data.CompanyID,
      'ProjectID': data.ProjectID,
      'TicketID': data.TicketID,
      'LeadNo': data.LeadNo,
      'TicketStatus': data.TicketStatus,
    };
    this.ticketStatus = data.TicketStatus.toString();
    // console.log(this.ticketStatus);
    // console.log('---------', JSON.stringify(this.ticketData));
  }

  ngOnInit() {

    this.ticketId = this.ticketData.TicketID;
    this.ticketNo = this.ticketData.LeadNo;
    // console.log('---Ticket Id----', this.ticketId);
    this.checkMessage(this.ticketId);

    const timerVar = timer(10000, 10000);

    this.subscribe = timerVar.subscribe(t => {
      this.checkMessage(this.ticketId);
    });

    this.chatForm = new FormGroup({
      chatmessage: new FormControl(null, Validators.required)
    });
  }

  toggleShowAttachment() {
    this.showAttachment = !this.showAttachment;
  }

  checkMessage(id) {
    this.url = 'Ticket/GetTicketMessage/' + this.ticketId;
    this.engineService.getData(this.url).toPromise().then(data => {
      console.log('data in checkMessage', data);
      this.message.length = 0;
      for (const i in data) {
        if (data[i].hasOwnProperty('Oid')) {

          const Oid = data[i].Oid;
          const AttachmentFlag = data[i].AttachmentFlag;
          const UserLetter = String(data[i].UserName).slice(0, 1);
          const MessageLog = data[i].MessageLog;
          const CompanyID = data[i].CompanyID;
          const ProjectID = data[i].ProjectID;
          const OperationBy = data[i].OperationBy;
          const OperationDate = moment(data[i].OperationDate);
          const TicketID = data[i].TicketID;
          const LeadNo = data[i].LeadNo;
          const TicketStatus = data[i].TicketStatus;
          const UserName = data[i].UserName;
          let check;
          if (this._cookieService.get('Oid') === OperationBy.toString()) {
            // console.log('------Self------------------------------------');
            check = 'self';
          } else {
            // console.log('------other------------------------------------');
            check = 'other';
          }

          const startTime = moment(new Date());
          const endTime = moment(OperationDate);
          const duration = moment.duration(endTime.diff(startTime));
          const hours = duration.asHours();
          const minutes = (duration.asMinutes()) % 60;
          // console.log('====Duration=====-----' + hours + '-----' + minutes + '----------');

          this.message.push({
            Oid: id,
            AttachmentFlag: AttachmentFlag,
            UserLetter: UserLetter,
            CompanyID: CompanyID,
            MessageLog: MessageLog,
            OperationBy: OperationBy,
            OperationDate: OperationDate,
            ProjectID: ProjectID,
            TicketID: TicketID,
            LeadNo: LeadNo,
            TicketStatus: TicketStatus,
            UserName: UserName,
            check: check
          });

        } else {
          // console.log('exsdsdfjdslf');
        }
      }
    }).catch(err => {
      // console.log('-------' + err);
    });
  }

  sendMessage() {
    this.engineService.validateUser();
    const data = {
      AttachmentFlag: false,
      MessageLog: this.chatForm.get('chatmessage').value,
      OperationBy: this._cookieService.get('Oid'),
      CompanyID: this.ticketData.CompanyID,
      ProjectID: this.ticketData.ProjectID,
      TicketID: this.ticketData.TicketID,
      LeadNo: this.ticketData.LeadNo,
      TicketStatus: this.ticketData.TicketStatus
    };

    // console.log('----Ticket data---' + JSON.stringify(data));

    this.url = 'Ticket/PostTicketLog';
    this.engineService.postData(this.url, data).then(res => {
      // console.log('--Success--');
      this.checkMessage(this.ticketId);
    }).catch();

    this.chatForm.reset();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
