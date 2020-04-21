import { ValidatorFn } from '@angular/forms';

export type TableColumn<T> = TableColumnNoFilter | TableColumnFilter<T> | EditableColumn<T>;

export interface TableColumnNoFilter {
  show: string;
  noFilter: true;
}

export interface TableColumnFilter<T> {
  name: keyof T & string;
  show?: string;
  type?: TableColumnFilterTypes;
  backgroundColor?: string;
}

export type TableColumnFilterTypes =
  'date'
  | 'datetime'
  | 'role'
  | 'yesNo'
  | 'number'
  | 'textarea'
  | 'select'
  | 'selectComponent'
  | 'monthYear';

export type EditableColumn<T> = EditableColumnInput<T> | EditableColumnSelect<T> | EditableColumnSelectComponent<T> | TableColumnNoFilter;

export interface EditableColumnInput<T> extends TableColumnFilter<T> {
  hidden?: true;
  readonly?: true | string[];
  isInsertOnly?: true;
  defaultValue?;
  validators?: ValidatorFn[];
  is_Range?: true;
}

export interface EditableColumnSelect<T> extends EditableColumnInput<T> {
  type: 'select';
  values: ColumnSelectValue[];
}

export interface EditableColumnSelectComponent<T> extends EditableColumnInput<T> {
  type: 'selectComponent';
  values: ColumnSelectValue[] | string[];
}

export interface ColumnSelectValue {
  value: string;
  show?: string;
}

export interface Section<T> {
  sections?: Section<T>[];
  title: string;
  columns?: TableColumn<T>[];
  isHidden?: true;
  backgroundColor?: string;
}

export function isFilterableColumn<T>(column: EditableColumn<T>): column is EditableColumnInput<T> | EditableColumnSelect<T> {
  return column && !(column as TableColumnNoFilter).noFilter;
}

export function isColumnSelect<T>(column: TableColumnFilter<T>): column is EditableColumnSelect<T> {
  return column.type === 'select';
}
