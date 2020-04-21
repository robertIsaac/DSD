import { NgModule } from '@angular/core';
import { TableComponent } from './components/table/table.component';
import { FormBaseComponent } from './components/form-base/form-base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { SelectComponent } from './components/select/select.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SectionedFormComponent } from './components/sectioned-form/sectioned-form.component';
import { ShownLengthPipe } from './pipes/shown-length.pipe';

@NgModule({
  declarations: [
    TableComponent,
    FormBaseComponent,
    SelectComponent,
    SectionedFormComponent,
    ShownLengthPipe,
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
