import { NgModule } from '@angular/core';
import { TableComponent } from './components/table/table.component';
import { FormBaseComponent } from './components/form-base/form-base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { SelectComponent } from './components/select/select.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    TableComponent,
    FormBaseComponent,
    SelectComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    OwlDateTimeModule,
    NgbTypeaheadModule,
    FormsModule,
  ],
  exports: [
    TableComponent,
  ],
})
export class DsdModule {
}
