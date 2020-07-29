import {Component, Input, OnInit} from '@angular/core';
import {FormService, UserService} from './../../services';
import * as _ from 'lodash-es';
import {ResourceService} from '@sunbird/shared';
import {Router} from '@angular/router';

@Component({
  selector: 'app-content-type',
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss']
})
export class ContentTypeComponent implements OnInit {
  @Input() layoutConfiguration;
  contentTypes;

  constructor(public formService: FormService, public resourceService: ResourceService,
              public router: Router, public userService: UserService) {
  }

  ngOnInit() {
    this.getContentTypes();
  }

  getContentTypes() {
    const formServiceInputParams = {
      formType: 'contentcategory',
      formAction: 'menubar',
      contentType: 'global'
    };
    this.formService.getFormConfig(formServiceInputParams).subscribe((data: any) => {
      this.processFormData(data);
    });
  }

  processFormData(formData) {
    this.contentTypes = _.sortBy(formData, 'index');
  }

  getTitle(contentType) {
    return _.get(this.resourceService, _.get(contentType, 'title'));
  }


  showContentType(data) {
    if (this.userService.loggedIn) {
      this.router.navigate([data.loggedInUserRoute.route],
        {queryParams: {selectedTab: data.loggedInUserRoute.queryParam}});
    } else {
      this.router.navigate([data.anonumousUserRoute.route],
        {queryParams: {selectedTab: data.anonumousUserRoute.queryParam}});
    }
  }

}