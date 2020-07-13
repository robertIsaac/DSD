import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NotificationType } from '../../interfaces/notification-options';
import { FormService } from '../../services/form.service';
import * as moment from 'moment';
import { EditableColumn, isFilterableColumn, Section } from '../../interfaces/table-column';
import { HttpService } from '../../services/http.service';
import { NotificationService } from '../../services/notification.service';
import { tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FilterTableComponent } from '../filter-table/filter-table.component';

@Component({
  selector: 'dsd-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T extends { [key in keyof T]: string | number }> implements OnInit, OnChanges {

  /**
   * the filter table component
   */
  @ViewChild('table', {static: true}) table: FilterTableComponent<T>;
  /**
   * the columns of the data
   */
  @Input() columns: EditableColumn<T>[];
  /**
   * the primary key for the table (to be used in update and delete)
   */
  @Input() primaryKey: keyof T & string;
  /**
   * whether the user can create/update/delete or not
   */
  @Input() readonly: boolean;
  /**
   * class to be used in the input div
   */
  @Input() groupClass: string;
  /**
   * the API URL to be called when the user click on delete
   * if not provided then the delete button will be hidden
   */
  @Input() deleteUrl: string;
  /**
   * the API URL to be called when the user submit create form
   * if not provided then the create button will be hidden
   */
  @Input() insertUrl: string;
  /**
   * the API URL to be called when the user submit edit form
   * if not provided then the edit button will be hidden
   */
  @Input() updateUrl: string;
  /**
   * the API URL to be called when the user open this table or edit/create/delete a row
   */
  @Input() getUrl: string;
  /**
   * the edit/create modal title
   */
  @Input() modalTitle: string;
  /**
   * if the table has multiple level of headers
   * note: columns will be overwritten by columns inside this section
   */
  @Input() sections: Section<T>[];
  /**
   * if provided a select button to be shown within every row
   * upon click will navigate to ${value of selectRouterLink}/${value of primaryKey}
   * eg. if value of selectRouterLink is foo and value of primaryKey is siteId
   * on an item with {siteId: '123', ...} it will navigate to /foo/123
   */
  @Input() selectRouterLink: string;
  /**
   * emit value whenever the user submit edit form
   */
  @Output() updated = new EventEmitter();
  /**
   * emit value whenever the user submit create form
   */
  @Output() inserted = new EventEmitter();
  /**
   * emit value whenever the user delete a row
   */
  @Output() deleted = new EventEmitter();
  /**
   * this attribute emits values with same condition of filter event
   * it send the filtered data
   */
  @Output() filteredData: Observable<T[]>;
  /**
   * the edit/create formGroup
   */
  formGroup: FormGroup;
  /**
   * the id of the edited row
   * to be set when the user open edit modal
   * to be used when the user submit edit form
   */
  editId: string;
  /**
   * the data retrieved by calling the getURL
   */
  data$: Observable<T[]>;
  /**
   * edit/submit modal
   */
  protected modal: NgbModalRef;

  constructor(
    protected ngbModal: NgbModal,
    protected notificationService: NotificationService,
    protected httpService: HttpService,
  ) {
  }

  ngOnInit() {
    this.filteredData = this.table.filteredData;
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if edit/delete url is provided, or selectRouterLink, then add an empty column to reserve it for the buttons
    // noFilter: true means the column added is not an input
    const action = ((!!this.deleteUrl || !!this.updateUrl) && !this.readonly) || this.selectRouterLink ? [{show: '', noFilter: true}] : [];
    if (changes.columns) {
      // if it has no sections, just add the action column and generate the form group
      this.columns = [
        ...changes.columns.currentValue,
        ...action,
      ];
      this.formGroup = FormService.generateFormGroup(this.columns);
    }
    if (changes.sections) {
      // if it has sections, add the action column, generate the columns from the sections and generate the form group
      this.sections = [
        ...changes.sections.currentValue,
        {
          title: '',
          columns: action,
        },
      ];
      this.columns = FormService.FlatSections(this.sections);
      this.formGroup = FormService.generateFormGroup(this.columns);
    }
  }

  /**
   * open form modal
   * triggered when the user click edit/create
   */
  open(modal: TemplateRef<unknown>, row?: T) {
    // get the value of the edit id, set to null if it's insert
    const primaryKey = row ? row[this.primaryKey] : null;
    this.editId = typeof primaryKey === 'number' ? primaryKey.toString() : typeof primaryKey === 'string' ? primaryKey : null;
    // open the form modal
    this.modal = this.ngbModal.open(modal);
    for (const column of this.columns) {
      if (!isFilterableColumn(column)) {
        // do nothing if not an input
        continue;
      }
      if (column.isInsertOnly) {
        // make the input readonly if it's insert only, and we are editing
        if (this.editId) {
          column.readonly = true;
        } else {
          column.readonly = undefined;
        }
      }
      let value;
      if (column.type === 'date') {
        // parse the value if the old value if date
        value = row ? moment(row[column.name]).toDate() : '';
      } else {
        // set the input value to default, if not set yet
        value = row ? row[column.name] :
          column.defaultValue ? column.defaultValue : ''
        ;
      }
      this.formGroup.get(column.name).setValue(value);
    }
  }

  /**
   * submit the form
   * triggered when the user click submit on edit/create form
   */
  async action() {
    if (this.editId) {
      // if it's edit
      // ask the user if sure
      const confirm = await this.notificationService.open(`edit this ${this.modalTitle}`, {type: NotificationType.confirm}).toPromise();
      if (!confirm) {
        return;
      }
      // get the string value of the form group, and set the edit id
      const values = FormService.stringifyForm(this.formGroup.value, this.columns);
      values[this.primaryKey] = this.editId;
      // call the api
      this.httpService.update(this.updateUrl, values).subscribe(response => {
        // when it's finished close the form modal, open success modal, emit the date updated and refresh the table values
        this.modal.close();
        this.notificationService.open(response.message, {
          type: NotificationType.success,
          title: `edit ${this.modalTitle}`,
        });
        this.updated.emit(this.editId);
        this.getData();
      }, error => {
        this.notificationService.open(error && error.error && error.error.message, {
          type: NotificationType.danger,
          title: `edit ${this.modalTitle}`,
        });
      });
    } else {
      // if it's create
      // ask the user if sure
      const confirm = await this.notificationService.open(`add new ${this.modalTitle}`, {type: NotificationType.confirm}).toPromise();
      if (!confirm) {
        return;
      }
      // get the string value of the form group
      const values = FormService.stringifyForm(this.formGroup.value, this.columns);
      // call the api
      this.httpService.insert(this.insertUrl, values).subscribe(response => {
        // when it's finished close the form modal, open success modal, emit new data inserted and refresh the table values
        this.modal.close();
        this.notificationService.open(response.message, {
          type: NotificationType.success,
          title: `add ${this.modalTitle}`,
        }).toPromise();
        this.inserted.emit();
        this.getData();
      }, error => {
        this.notificationService.open(error && error.error && error.error.message, {
          type: NotificationType.danger,
          title: `add ${this.modalTitle}`,
        });
      });
    }
  }

  /**
   * set the data observable to be used by yhe filter table
   */
  getData() {
    this.data$ = this.httpService.get<T[]>(this.getUrl).pipe(
      tap(() => {
      }, error => this.httpService.HandleError(error)),
    );
  }

  /**
   * delete a row
   * triggered when the user click the delete button
   */
  async delete(row: T) {
    // ask if the user is sure
    const confirm = await this.notificationService.open(`delete this ${this.modalTitle}`, {type: NotificationType.confirm}).toPromise();
    if (!confirm) {
      return;
    }
    // call the api
    this.httpService.delete(this.deleteUrl, row[this.primaryKey].toString()).subscribe(response => {
      // when it's finished open success modal, emit data has been deleted with the id of the deleted row and refresh the table values
      this.notificationService.open(
        response && response.message || `this ${this.modalTitle} has been deleted successfully`,
        {
          type: NotificationType.success,
          title: `delete ${this.modalTitle}`,
        },
      );
      this.deleted.emit(row[this.primaryKey]);
      this.getData();
    }, error => {
      this.notificationService.open(error && error.error && error.error.message, {
        type: NotificationType.danger,
        title: `delete ${this.modalTitle}`,
      });
    });
  }
}
