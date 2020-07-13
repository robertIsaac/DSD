import { NgModule } from '@angular/core';
import { TableComponent } from './components/table/table.component';
import { FormBaseComponent } from './components/form-base/form-base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { SelectComponent } from './components/select/select.component';
import { NgbCollapseModule, NgbPaginationModule, NgbTabsetModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SectionedFormComponent } from './components/sectioned-form/sectioned-form.component';
import { ShownLengthPipe } from './pipes/shown-length.pipe';
import { FormComponent } from './components/form/form.component';
import { FilterTableComponent } from './components/filter-table/filter-table.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TableComponent,
    FormBaseComponent,
    SelectComponent,
    SectionedFormComponent,
    ShownLengthPipe,
    FormComponent,
    FilterTableComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    OwlDateTimeModule,
    NgbTypeaheadModule,
    FormsModule,
    NgbCollapseModule,
    NgbTabsetModule,
    NgbPaginationModule,
    RouterModule,
  ],
  exports: [
    TableComponent,
    FormBaseComponent,
    SelectComponent,
    SectionedFormComponent,
    ShownLengthPipe,
    FormComponent,
    FilterTableComponent,
  ],
})
export class DsdModule {
}
