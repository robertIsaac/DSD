import { Pipe, PipeTransform } from '@angular/core';
import { EditableColumnInput, TableColumn } from '../interfaces/table-column';

@Pipe({
  name: 'shownLength'
})
export class ShownLengthPipe<T> implements PipeTransform {

  transform(columns: TableColumn<T>[]): number {
    return columns.filter(column => {
      return !(column as EditableColumnInput<T>).hidden;
    }).length;
  }

}
