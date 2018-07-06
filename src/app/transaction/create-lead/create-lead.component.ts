import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { EngineService } from '../../services/engine.service';
import { CookieService } from 'ngx-cookie';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss']
})
export class CreateLeadComponent implements OnInit {

  url: any;
  createLeadForm: FormGroup;
  companyList: any[] = [];
  projectList: any[] = [];
  allLeadTypeList: any[] = [];
  leadTypeList: any[] = [];
  teamList: any[] = [];
  assignToUserList: any[];
  fileToUpload: File = null;
  // tslint:disable-next-line:max-line-length
  priorityList: any[] = [{ value: 'High', viewValue: 'High' }, { value: 'Medium', viewValue: 'Medium' }, { value: 'Low', viewValue: 'Low' }];
  data = {
    LeadID: '',
    LeadNo: '',
    LeadBacklogID: ''
  };
  leadSaved = false;
  files: UploadFile[] = [];

  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService,
    private router: Router,
    private engineService: EngineService,
    private dashboard: DashboardComponent,
    private _cookieService: CookieService) { }

  ngOnInit() {

    this.prepareForm();

    this.loadCompany();
    // this.loadAssignTo();
    this.loadLeadType();
    // this.loadTeams();
  }

  prepareForm() {
    this.createLeadForm = new FormGroup({

      CompanyID: new FormControl(null, Validators.required),
      ProjectID: new FormControl(null, Validators.required),
      LeadType: new FormControl(null, Validators.required),
      Priority: new FormControl(null, Validators.required),
      Subject: new FormControl(null, Validators.required),
      LeadDescription: new FormControl(null, Validators.required),
      TeamID: new FormControl(null, Validators.required),
      AssignTo: new FormControl(null),
      NewBy: new FormControl(this._cookieService.get('Oid'))
    });
  }

  loadCompany() {
    // Company Dropdown - start
    this.url = 'Company/GetAllCompany';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.companyList = res;
      })
      .catch(err => {
        // // console.log(err);
        this.alertService.danger('Server response error! @loadCompany');
      });
    // Company Dropdown - end
  }

  loadProjects() {
    const CompanyID = this.createLeadForm.get('CompanyID').value;
    // // console.log(CompanyID);
    // Company Dropdown - start
    this.url = 'Project/GetProject';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.projectList = res.filter(data => data.ProjectCompany === CompanyID);
      })
      .catch(err => {
        // // console.log(err);
        this.alertService.danger('Server response error! @loadCompany');
      });
    // Company Dropdown - end
  }

  loadTeams() {
    const ProjectID = this.createLeadForm.get('ProjectID').value;
    this.url = 'Team/GetTeamProject/' + ProjectID;
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        this.teamList = res.filter(data => data.ProjectID === ProjectID);
      })
      .catch(err => {
        this.alertService.danger('Server response error! @loadTeam');
      });
  }



  loadTeamMembers() {
    const TeamID = this.createLeadForm.get('TeamID').value;
    this.url = 'Users/GetTeamMembers/' + TeamID;
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.assignToUserList = res;
      })
      .catch(err => {
        // console.log(err);
        this.alertService.danger('Server response error!');
      });
  }

  loadLeadType() {
    // LeadType Dropdown - start
    this.url = 'Lead/GetLeadType';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.allLeadTypeList = res;
      })
      .catch(err => {
        this.alertService.danger('Server response error!');
      });
    // LeadType Dropdown - end
  }

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // console.log("----File----",droppedFile.relativePath, file);
          this.fileToUpload = file;
          const filename = file.name;
          this.uploadFileToActivity(filename);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  handleFileInput(files: FileList) {

    for (let i = 0; i < files.length; i++) {
      const fileItem = files.item(i);
      this.fileToUpload = fileItem;
      const filename = fileItem.name;

      this.uploadFileToActivity(filename);
    }

  }
  uploadFileToActivity(filename) {

    this.engineService.uploadFile(this.fileToUpload, this.data, filename).then(res => {
      console.log('----- File Upload -----' + JSON.stringify(res._body));
    }).catch(err => {
      console.log('----- Error UploadingFile -----' + JSON.stringify(err));
    });
  }

  updateLeadType() {
    this.leadTypeList = this.allLeadTypeList.filter(x =>
      x.CompanyID === this.createLeadForm.get('CompanyID').value && x.ProjectID === this.createLeadForm.get('ProjectID').value);
  }

  createLead() {
    this.engineService.validateUser();
    if (this.createLeadForm.status === 'VALID') {
      // console.log(this.createLeadForm.value);
      this.url = 'Lead/PostLead';
      this.engineService.postData(this.url, this.createLeadForm.value).then(response => {
        console.log('--------Response---------', JSON.stringify(response));
        const res = response.json();
        const res2 = JSON.parse(res);
        console.log('--------Response---------', JSON.stringify(res2));
        this.data.LeadID = res2.LeadID;
        this.data.LeadNo = res2.LeadNo;
        this.data.LeadBacklogID = res2.LeadBacklogID;

        if (response.status === 201 || response.status === 200) {
          // this.alertService.success('Lead successfully created!');
          this.leadSaved = true;
        }
      }).catch(error => {
        // console.log(error);
        this.alertService.danger('Lead creation failed!');
      });
    }
  }
}