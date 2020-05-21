import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTableComponent } from './filter-table.component';

describe('FilterTableComponent', () => {
  let component: FilterTableComponent<unknown>;
  let fixture: ComponentFixture<FilterTableComponent<unknown>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
