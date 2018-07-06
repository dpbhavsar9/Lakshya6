import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EngineService } from '../../../services/engine.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-create-lead-type',
  templateUrl: './create-lead-type.component.html',
  styleUrls: ['./create-lead-type.component.scss']
})
export class CreateLeadTypeComponent implements OnInit {

  url: any;
  createLeadTypeForm: FormGroup;
  companyList: any[] = [];
  projectList: any[] = [];
  status = [
    { value: 'A', viewValue: 'Active' },
    { value: 'C', viewValue: 'Inactive' }
  ];
  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService, private router: Router, private engineService: EngineService, private _cookieService: CookieService) { }

  ngOnInit() {

    this.prepareForm();

    this.loadCompanies();

  }

  prepareForm() {
    this.createLeadTypeForm = new FormGroup({
      TypeName: new FormControl(null, Validators.required),
      CompanyID: new FormControl(null, Validators.required),
      ProjectID: new FormControl(null, Validators.required),
      Status: new FormControl(null, Validators.required),
      CreatedBy: new FormControl(this._cookieService.get('Oid'))
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
    const company = this.createLeadTypeForm.get('CompanyID').value;
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


  createLeadType() {
    this.engineService.validateUser();
    if (this.createLeadTypeForm.status === 'VALID') {

      this.url = 'Lead/PostLeadType';
      this.engineService.postData(this.url, this.createLeadTypeForm.value).then(response => {
        if (response.status === 201) {
          this.alertService.success('Lead-type successfully created!');
          this.router.navigate(['dashboard']);
        }
      }).catch(error => {
        this.alertService.danger('Lead-type creation failed!');
      });
    }
  }
}
