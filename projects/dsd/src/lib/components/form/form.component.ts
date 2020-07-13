import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EditableColumn, isFilterableColumn, Section } from '../../interfaces/table-column';
import { Subscription } from 'rxjs';
import { FormService } from '../../services/form.service';
import { HttpService } from '../../services/http.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationType } from '../../interfaces/notification-options';

@Component({
  selector: 'dsd-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
/**
 * this component to be used to generate forms, fetch it's current value and save them
 */
export class FormComponent<T> implements OnInit, OnChanges, OnDestroy {

  /**
   * the form group of the form
   */
  formGroup: FormGroup;
  /**
   * will be used as the modal title when confirming or displaying the API response
   */
  @Input() modalTitle = 'update';
  /**
   * the columns to be rendered as form
   * note: won't be used of section has been provided
   */
  @Input() columns: EditableColumn<T>[];
  /**
   * the sections to be rendered as a form
   * note: columns attribute will be overwritten by columns here
   */
  @Input() sections: Section<T>[];
  /**
   * the url of the API that return the current values
   */
  @Input() getUrl: string;
  /**
   * the URL to sent the PUT request to when the user save
   */
  @Input() updateUrl: string;
  /**
   * the primary key to be used when send the PUT request
   * note: won't be used if data is provided
   */
  @Input() primaryKey: string & keyof T;
  /**
   * whether the user can modify the form or just view it's current value
   * setting it to true will hide the save button
   */
  @Input() readonly: true;
  /**
   * if provided then won't call the get API to fetch the current data into the form
   * note: getUrl will not be used if provided
   */
  @Input() data: T;
  /**
   * whether the sections header should be h3 or h4
   * note: won't have any affect if sections is not provided
   */
  @Input() sectionLevel: 3 | 4 = 3;
  /**
   * whether the native form should offer autocomplete or not on typing
   */
  @Input() autocomplete: 'on' | 'off' = 'off';
  /**
   * the subscription of get
   */
  protected getSubscription: Subscription;
  /**
   * the value of the unique id returned by the data
   * eg. if primary key is siteId and the api returned object like {siteId: 'foo', city: 'bar' ...}
   * editId will have the value foo
   */
  protected editId: string;

  constructor(
    protected httpService: HttpService,
    protected notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    if (this.getUrl) {
      this.getData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.columns = [
        ...changes.columns.currentValue,
      ];
      this.formGroup = FormService.generateFormGroup(this.columns);
    }
    if (changes.sections) {
      this.columns = FormService.FlatSections(changes.sections.currentValue);
      this.formGroup = FormService.generateFormGroup(this.columns);
    }
    if (changes.data) {
      this.handleData(this.data);
    }
  }

  /**
   * this method is called when the component render or when the form or when he saves it
   * it calls the given API and set the values of the form by the returned value
   */
  getData() {
    this.getSubscription = this.httpService.get<T>(this.getUrl).subscribe(data => {
      this.handleData(data);
      window.scrollTo(0, 0);
    }, error => this.httpService.HandleError(error));
  }

  /**
   * this method is called by get data
   * it make sure the form inputs has been set correctly
   */
  handleData(data: T) {
    const pk = data ? data[this.primaryKey] : null;
    this.editId = typeof pk === 'string' ? pk : null;
    for (const column of this.columns) {
      if (!isFilterableColumn(column)) {
        continue;
      }
      let value;
      if (column.type === 'date') {
        value = data && data[column.name] ? data[column.name] : null;
      } else {
        value = data ? data[column.name] :
          column.defaultValue ? column.defaultValue : ''
        ;
      }
      this.formGroup.get(column.name).setValue(value);
    }
  }

  /**
   * this method is called when the user want to submit the form
   */
  async update() {
    const confirm = await this.notificationService.open(this.modalTitle, {type: NotificationType.confirm}).toPromise();
    if (!confirm) {
      return;
    }
    const values = FormService.stringifyForm(this.formGroup.value, this.columns);
    this.httpService.update(this.updateUrl, {id: this.editId, ...values}).subscribe(async response => {
      this.getData();
      await this.notificationService.open(response.message, {type: NotificationType.success, title: this.modalTitle}).toPromise();
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }, error => {
      this.notificationService.open(error && error.error && error.error.message, {type: NotificationType.danger, title: this.modalTitle});
    });
  }

  ngOnDestroy(): void {
    if (this.getSubscription) {
      this.getSubscription.unsubscribe();
    }
  }
}
