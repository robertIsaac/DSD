import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { EditableColumn, EditableColumnInput, isFilterableColumn } from '../../interfaces/table-column';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'dsd-form-base',
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.scss'],
})
/**
 * this component render basic form inputs according to their types
 */
export class FormBaseComponent<T> implements OnInit, OnChanges {

  /**
   * the columns to be used for generating the form
   */
  @Input() columns: EditableColumn<T>[];
  /**
   * the formGroup to bind the form to
   */
  @Input() formGroup: FormGroup;
  /**
   * whether the user can only see form or update its values as well
   */
  @Input() readonly = false;
  /**
   * the class to used with the div that group the input and the label
   */
  @Input() groupClass = 'form-group col-lg-4 col-md-6';
  /**
   * random number to be attached to the ids to make them unique
   */
  random = Math.random();
  Validators = Validators;

  constructor(
    protected roleService: RoleService,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      // if the changed component input is the columns
      // deep copy the columns object
      this.columns = JSON.parse(JSON.stringify(this.columns));
      for (const column of this.columns) {
        if (isFilterableColumn(column)) {
          if (!column.show && column.name) {
            // if the column show is not provided, use the column name to generate the show
            // by replacing underscores with spaces
            // eg. first_name => first name
            column.show = column.name.replace(/_/g, ' ');
          }
          const columnReadonly = column.readonly;
          if (Array.isArray(columnReadonly)) {
            if (columnReadonly.indexOf(this.roleService.roleSync) === -1) {
              column.readonly = true;
            } else {
              column.readonly = undefined;
            }
          }
        }
      }
    }
  }

  /**
   * this method is called when the user change the value of the input
   * it's for the type number to make sure that it allows only type numbers in all browsers
   */
  inputChanged(column: EditableColumnInput<T>, value) {
    if (
      column.type === 'number' &&
      (
        !value &&
        value !== 0 &&
        value !== '0' ||
        this.formGroup.controls[column.name].invalid
      )
    ) {
      this.formGroup.controls[column.name].setValue('');
    }
  }

}
