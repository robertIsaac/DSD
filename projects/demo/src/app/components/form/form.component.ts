import { Component, OnInit } from '@angular/core';
import { EditableColumn } from 'dsd';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  // tslint:disable-next-line:no-any
  columns: EditableColumn<any>[] = [
    {
      name: 'test',
      show: 'test'
    },
    {
      name: 'test 2',
      show: 'test2'
    },
    {
      name: 'test 3',
      show: 'test3'
    },
    {
      name: 'test 4',
      show: 'test4'
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
