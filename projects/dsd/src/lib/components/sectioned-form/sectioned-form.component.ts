import { Component, Input, OnInit } from '@angular/core';
import { Section } from '../../interfaces/table-column';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dsd-sectioned-form',
  templateUrl: './sectioned-form.component.html',
  styleUrls: ['./sectioned-form.component.scss']
})
export class SectionedFormComponent<T> implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() sections: Section<T>[];
  @Input() readonly = false;
  @Input() groupClass = 'form-group col-lg-4 col-md-6';
  @Input() sectionLevel: 3 | 4 = 3;
  isCollapsed = [];

  constructor() { }

  ngOnInit(): void {
  }

}
