import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EngineService } from '../../services/engine.service';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CookieService } from 'ngx-cookie';
import * as moment from 'moment';
import { timer } from 'rxjs/internal/observable/timer';
import { AlertComponent } from '../../master/modal/alert/alert.component';


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
    LeadID: any,
    LeadNo: any,
    LeadStatus: any,
    UserName: any,
    check: any
  }> = [];
  mesLeadData = {
    LeadID: '',
    LeadNo: '',
    LeadBacklogID: ''
  };
  message_chat: any;
  leadId: any;
  leadNo: any;
  subscribe: any;
  leadStatus: string;
  leadData: any = [];
  showAttachment = false;
  fileToUpload: File = null;
  files: FileList;
  loadingIndicator = false;

  // tslint:disable-next-line:max-line-length
  constructor(private engineService: EngineService,
    public dialogRef: MatDialogRef<MeslogComponent>,
    public dialog: MatDialog,
    private _cookieService: CookieService, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.leadData = {
      'CompanyID': data.CompanyID,
      'ProjectID': data.ProjectID,
      'LeadID': data.LeadID,
      'LeadNo': data.LeadNo,
      'LeadStatus': data.LeadStatus,
    };
    this.leadStatus = data.LeadStatus.toString();
    // console.log(this.ticketStatus);
    // console.log('---------', JSON.stringify(this.ticketData));
  }

  ngOnInit() {

    this.leadId = this.leadData.LeadID;
    this.leadNo = this.leadData.LeadNo;
    // console.log('---Lead Id----', this.leadId);
    this.checkMessage(this.leadId);

    const timerVar = timer(30 * 1000);

    this.subscribe = timerVar.subscribe(t => {
      this.checkMessage(this.leadId);
    });

    this.chatForm = new FormGroup({
      chatmessage: new FormControl(null, Validators.required)
    });
  }

  toggleShowAttachment() {
    this.showAttachment = !this.showAttachment;
  }

  checkMessage(id) {
    this.loadingIndicator = true;
    this.url = 'Lead/GetLeadMessage/' + this.leadId;
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
          const LeadID = data[i].LeadID;
          const LeadNo = data[i].LeadNo;
          const LeadStatus = data[i].LeadStatus;
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
            LeadID: LeadID,
            LeadNo: LeadNo,
            LeadStatus: LeadStatus,
            UserName: UserName,
            check: check
          });

          this.mesLeadData.LeadID = this.leadData.LeadID;
          this.mesLeadData.LeadNo = this.leadData.LeadNo;
          this.mesLeadData.LeadBacklogID = Oid;

        } else {
          // console.log('exsdsdfjdslf');
        }
      }
      this.loadingIndicator = false;
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
      CompanyID: this.leadData.CompanyID,
      ProjectID: this.leadData.ProjectID,
      LeadID: this.leadData.LeadID,
      LeadNo: this.leadData.LeadNo,
      LeadStatus: this.leadData.LeadStatus
    };

    // console.log('----Ticket data---' + JSON.stringify(data));

    this.url = 'Lead/PostLeadLog';
    this.engineService.postData(this.url, data).then(res => {
      // console.log('--Success--');
      this.checkMessage(this.leadId);
    }).catch();

    this.chatForm.reset();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  checkFileAttached(index) {
    return this.message[index].AttachmentFlag;
  }

  confirmDownload(message: string) {

    const fileName = message.slice(14);
    const dialogRef = this.dialog.open(AlertComponent, {
      height: 'auto',
      minWidth: '30%',
      data: 'Download this Attachment ?',
      panelClass: 'leadDialog',
      hasBackdrop: true,
      closeOnNavigation: true
    });

    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result.toString() === 'Yes') {

          window.location.href = 'http://lakshyawebapi.rlmc.in/api//Upload/UploadFiles/' + fileName;
          // window.location.href = 'http://192.168.0.13:8004/api/Upload/UploadFiles/' + fileName;
        } else {

        }
      });
  }

  handleFileInput(files: FileList) {

    this.files = files;
  }


  async uploadFileToActivity(filename): Promise<any> {

    await this.engineService.uploadFile(this.fileToUpload, this.mesLeadData, filename).then(res => {

      if (JSON.stringify(res) === '"Success"') {
      } else if (JSON.stringify(res) === '"Fail"') {
      }

    }).catch(err => {
    });

  }

  async handlefile() {

    for (let i = 0; i < this.files.length; i++) {
      const fileItem = this.files.item(i);
      this.fileToUpload = fileItem;
      const filename = fileItem.name;

      const res = await this.uploadFileToActivity(filename);
    }
    this.toggleShowAttachment();
    this.chatForm.reset();
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
