import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { EngineService } from '../../services/engine.service';
import { CookieService } from 'ngx-cookie';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { city } from '../../shared/city';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss']
})
export class CreateLeadComponent implements OnInit {

  // tslint:disable-next-line:max-line-length

  options = city;
  filteredOptions: Observable<string[]>;

  url: any;
  createLeadForm: FormGroup;
  companyList: any[] = [];
  projectList: any[] = [];
  allLeadTypeList: any[] = [];
  allLeadCategoryList: any[] = [];
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
  selectedIndex: number;
  files: UploadFile[] = [];
  selectedDiamond = 1;
  defaultValue = {
    Company: { Oid: this._cookieService.get('CompanyID'), CompanyName: this._cookieService.get('CompanyName') },
    Project: { Oid: this._cookieService.get('ProjectID'), ProjectName: this._cookieService.get('ProjectName') },
    Team: { Oid: this._cookieService.get('TeamID'), TeamName: this._cookieService.get('TeamName') },
  };

  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService,
    private router: Router,
    private engineService: EngineService,
    private dashboard: DashboardComponent,
    private _cookieService: CookieService) { }

  ngOnInit() {

    this.prepareForm();

    this.loadCompany();
    this.loadProjects();
    this.loadLeadType();
    this.loadLeadCategory();
    this.loadTeams();
    this.loadTeamMembers();

    this.filteredOptions = this.createLeadForm.get('Location').valueChanges
      .pipe(map(value => this._filter(value)));
  }
  _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  prepareForm() {
    this.createLeadForm = new FormGroup({

      CompanyID: new FormControl(this.defaultValue.Company.Oid, Validators.required),
      ProjectID: new FormControl(this.defaultValue.Project.Oid, Validators.required),
      LeadType: new FormControl(1, Validators.required),
      Priority: new FormControl('Medium', Validators.required),
      Subject: new FormControl(null, Validators.required),
      LeadDescription: new FormControl(null, Validators.required),
      TeamID: new FormControl(this.defaultValue.Team.Oid, Validators.required),
      AssignTo: new FormControl(null),
      Oid: new FormControl(Number(this._cookieService.get('Oid'))),
      CompanyName: new FormControl(null, Validators.required),
      ContactPerson1: new FormControl(null),
      ContactNumber1: new FormControl(null),
      Designation1: new FormControl(null),
      ContactPerson2: new FormControl(null),
      ContactNumber2: new FormControl(null),
      Designation2: new FormControl(null),
      ContactPerson3: new FormControl(null),
      ContactNumber3: new FormControl(null),
      Designation3: new FormControl(null),
      EmailID: new FormControl(null),
      Address: new FormControl(null),
      Location: new FormControl(null),
      LeadCategory: new FormControl(this.selectedDiamond, Validators.required),
    });
  }

  diamondHover(i) {
    // console.log(i);
    this.selectedDiamond = i;
    this.createLeadForm.patchValue({ LeadCategory: i });
  }

  selectedIndexChange(val: number) {
    this.selectedIndex = val;
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
    // console.log(CompanyID);
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
        // console.log(res);
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
        // console.log(TeamID, '------', res);
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
        // this.allLeadTypeList = res;
        this.leadTypeList = res;
      })
      .catch(err => {
        this.alertService.danger('Server response error!');
      });
    // LeadType Dropdown - end
  }

  loadLeadCategory() {
    // LeadType Dropdown - start
    this.url = 'Lead/GetLeadCategory';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.allLeadCategoryList = res;
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
          // console.log('----File----',droppedFile.relativePath, file);
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
      // console.log('----- File Upload -----' + JSON.stringify(res._body));
    }).catch(err => {
      // console.log('----- Error UploadingFile -----' + JSON.stringify(err));
    });
  }

  updateLeadType() {

    this.leadTypeList = this.allLeadTypeList.filter(x =>
      x.CompanyID === this.createLeadForm.get('CompanyID').value && x.ProjectID === this.createLeadForm.get('ProjectID').value);
    // console.log('updateLeadType', this.leadTypeList);
  }

  createLead() {
    this.engineService.validateUser();
    if (this.createLeadForm.status === 'VALID') {
      // console.log(this.createLeadForm.value);
      // console.log(JSON.stringify(this.createLeadForm.value));
      this.url = 'Lead/PostLead';
      this.engineService.postData(this.url, this.createLeadForm.value).then(response => {
        // console.log('--------Response---------', JSON.stringify(response));
        const res = response.json();
        const res2 = JSON.parse(res);
        // console.log('--------Response---------', JSON.stringify(res2));
        this.data.LeadID = res2.LeadID;
        this.data.LeadNo = res2.LeadNo;
        this.data.LeadBacklogID = res2.LeadBacklogID;

        if (response.status === 201 || response.status === 200) {
          // this.alertService.success('Lead successfully created!');
          this.leadSaved = true;
          this.router.navigate(['/dashboard']);
        }
      }).catch(error => {
        // console.log(error);
        this.alertService.danger('Lead creation failed!');
      });
    }
  }
}
