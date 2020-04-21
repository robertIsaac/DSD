import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { EditableColumn, isFilterableColumn, Section, TableColumn } from '../interfaces/table-column';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {

  constructor() {
  }

  static generateFormGroup<T>(columns: EditableColumn<T>[]) {
    const formGroup = new FormGroup({});
    for (const column of columns) {
      let control: FormControl;
      if (!isFilterableColumn(column)) {
        continue;
      }
      if (column.readonly === true) {
        control = new FormControl(column.defaultValue);
      } else {
        const validators = column.validators ? column.validators : [];
        if (column.type === 'number') {
          control = new FormControl('', [...validators, Validators.pattern(/^-?[0-9]*(\.[0-9]*)?$/)]);
        } else {
          control = new FormControl('', validators);
        }
      }
      formGroup.addControl(column.name, control);
    }
    return formGroup;
  }

  static FlatSections<T>(sections: Section<T>[]): TableColumn<T>[] {
    const columns = [];
    for (const section of sections) {
      if (section.sections) {
        columns.push(...FormService.FlatSections(section.sections));
      } else {
        columns.push(...section.columns);
      }
    }
    return columns;
  }

  static stringifyForm(values, columns) {
    for (const column of columns) {
      if (isFilterableColumn(column) && column.type === 'date') {
        values[column.name] = values[column.name] ? formatDate(values[column.name], 'yyyy-MM-dd', 'en') : null;
      }
    }
    return values;
  }
}
