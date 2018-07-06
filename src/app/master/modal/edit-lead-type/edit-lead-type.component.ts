import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { EngineService } from '../../../services/engine.service';
import { AlertService } from 'ngx-alerts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-edit-lead-type',
  templateUrl: './edit-lead-type.component.html',
  styleUrls: ['./edit-lead-type.component.scss']
})
export class EditTicketTypeComponent implements OnInit {

  url: any;
  updateLeadTypeForm: FormGroup;
  companyList: any[] = [];
  projectList: any[] = [];
  status = [
    { value: 'A', viewValue: 'Active' },
    { value: 'C', viewValue: 'Inactive' }
  ];

  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService, private engineService: EngineService, private _cookieService: CookieService, public dialogRef: MatDialogRef<EditTicketTypeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.prepareForm();

    this.loadCompanies();
    this.loadProjects();

  }

  prepareForm() {
    this.updateLeadTypeForm = new FormGroup({
      Oid: new FormControl(this.data.Oid),
      TypeName: new FormControl(this.data.TypeName, Validators.required),
      CompanyID: new FormControl(this.data.CompanyID, Validators.required),
      ProjectID: new FormControl(this.data.ProjectID, Validators.required),
      Status: new FormControl(this.data.Status, Validators.required),
      UpdatedBy: new FormControl(this._cookieService.get('Oid'))
    });

  }

  loadCompanies() {
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
    const company = this.updateLeadTypeForm.get('CompanyID').value;
    // console.log(company);
    // Company Dropdown - start
    this.url = 'Project/GetProject';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.projectList = res.filter(data => data.ProjectCompany === company);
      })
      .catch(err => {
        // // console.log(err);
        this.alertService.danger('Server response error! @loadProjects');
      });
    // Company Dropdown - end
  }


  updateLeadType() {
    this.engineService.validateUser();
    if (this.updateLeadTypeForm.status === 'VALID') {

      this.url = 'Lead/PutLeadType';
      this.engineService.updateData(this.url, this.updateLeadTypeForm.value).then(response => {
        if (response.status === 200 || response.status === 201) {
          this.alertService.success('Lead-type successfully updated!');
          this.dialogRef.close();
        }
      }).catch(error => {
        this.alertService.danger('Lead-type creation failed!');
      });
    }
  }

  onNoClick(): void {
    this
      .dialogRef
      .close();
  }
}
