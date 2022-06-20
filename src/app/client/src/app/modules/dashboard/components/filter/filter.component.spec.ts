
import { FilterComponent } from './filter.component';
import { mockChartData } from './filter.component.spec.data';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';
import { ResourceService } from '../../../shared';
import { fakeAsync, tick } from '@angular/core/testing';
import * as moment from 'moment';

describe('FilterComponent', () => {
  let component: FilterComponent;

  const mockResourceService: Partial<ResourceService> = {
    messages: {
      imsg: {
        reportSummaryAdded: 'Summary Added Successfully',
        reportPublished: 'Report Published Successfully',
        reportRetired: 'Report Retired Successfully',
        confirmReportPublish: 'Are you sure you want to publish the report ?',
        confirmRetirePublish: 'Are you sure you want to retire the report ?'
      },
      emsg: {
        m0076: 'No data available to download ',
        m0005: 'Something went wrong, try later'
      },
      stmsg: {
        m0131: 'Could not find any reports',
        m0144: 'You do not have appropriate rights to access this page.'
      }
    },
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        reportSummary: 'Report Summary'
      }
    },
    languageSelected$: of({})
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };
  const mockFormBuilder: Partial<FormBuilder> = {
    group: jest.fn()
  };
  const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {
  };
  beforeAll(() => {
    component = new FilterComponent(
      mockResourceService as ResourceService,
      mockFormBuilder as FormBuilder,
      mockActivatedRoute as ActivatedRoute,
      mockChangeDetectionRef as ChangeDetectorRef
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    component.filtersFormGroup = new FormBuilder().group({});
    expect(component).toBeTruthy();
  });

  it('should build filters form from the configuration', () => {
    jest.spyOn(component, 'buildFiltersForm').mockImplementation(() => { });
    component.filters = mockChartData.filters;
    component.ngOnInit();
    expect(component.buildFiltersForm).toHaveBeenCalled();
    expect(component.buildFiltersForm).toHaveBeenCalledTimes(1);
    expect(component.filtersFormGroup.contains('state')).toBe(false);
    expect(component.filtersFormGroup.controls).toBeTruthy();
  });

  it('should reset filter', fakeAsync(() => {
    mockChangeDetectionRef.detectChanges = jest.fn();
    component.ngOnInit();
    tick(1000);
    component.resetFilter();
    tick(1000);
    expect(component.showFilters).toEqual(true);
  }));

  it('should check checkFilterReferance', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.dateFilters = ['date'];
    const response = component.checkFilterReferance('date');
    expect(response).toEqual(true);
  }));

  it('should set resetFilters', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.resetFilters = { data: [{ data: mockChartData.chartData, id: 'chartId' }], reset: true, filters: mockChartData.filters };
    tick(1000);
    component.resetFilter();
    tick(1000);
    component.buildFiltersForm();
    tick(1000);
    expect(component.chartData).toEqual([{ id: 'chartId', data: mockChartData.chartData }]);
  }));

  it('should run buildFiltersForm', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    tick(1000);
    component.buildFiltersForm();
    tick(1000);
    tick(1000);
    expect(component.selectedFilters).toEqual({});
  }));

  it('should get filter dat with selected filter', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    tick(1000);
    component.buildFiltersForm();
    tick(1000);
    tick(1000);
    component.filterData();
    expect(component.selectedFilters).toEqual({});

  }));


  it('should set the dateRange', () => {
    component.filtersFormGroup = new FormBuilder().group({
      Grade: ['1']
    });
    component.ngOnInit();
    component.getDateRange({
      startDate: new Date('Tue Jan 08 2019 00:00:00 GMT+0530 (India Standard Time'),
      endDate: new Date('Tue Jan 10 2019 00:00:00 GMT+0530 (India Standard Time')
    }, 'Grade');
    expect(component.filtersFormGroup.get('Grade').value).toEqual(['08-01-2019', '09-01-2019', '10-01-2019']);
  });

  it('should update form', fakeAsync(() => {
    component.filtersFormGroup = new FormBuilder().group({
      state: ['1']
    });
    jest.spyOn(component, 'formUpdate').mockImplementation(() => {
      return of({});
    });
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.ngOnInit();
    tick(1000);
    component.filtersFormGroup.get('state').setValue(['01285019302823526477']);
    tick(1000);
    expect(component.filtersFormGroup.controls).toBeTruthy();
    mockChartData.filters[1]['options'] = ['10'];
    expect(component.filters).toEqual(mockChartData.filters);
  }));
  it('should call autoCompleteChange', fakeAsync(() => {
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.ngOnInit();
    tick(1000);
    component.autoCompleteChange(['01285019302823526477'], 'state');
    tick(1000);
    expect(component.filtersFormGroup.controls).toBeTruthy();
  }));

  it('should call getSelectedData', fakeAsync(() => {
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.ngOnInit();
    tick(1000);
    component.filtersFormGroup.get('state').setValue(['01285019302823526477']);
    tick(1000);
    const res = component.getSelectedData('state');
    tick(1000);
    expect(component.filtersFormGroup.controls).toBeTruthy();
    expect(res).toEqual([]);
    const res2 = component.getSelectedData('state2');
    tick(1000);
    expect(component.filtersFormGroup.controls).toBeTruthy();
    expect(res2).toEqual([]);
  }));

  it('should call getSelectedData', fakeAsync(() => {
    component.filterQuery = 'ab';
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.ngOnInit();
    tick(1000);
    const res = component.getFilters(['cd', 'ef']);
    tick(1000);
    expect(res).toEqual([]);
    const res2 = component.getFilters(['ab', 'ef']);
    tick(1000);
    expect(res2).toEqual(['ab']);
  }));

});
