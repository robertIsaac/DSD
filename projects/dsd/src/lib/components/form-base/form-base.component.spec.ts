import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormBaseComponent } from './form-base.component';

describe('FormBaseComponent', () => {
  let component: FormBaseComponent<unknown>;
  let fixture: ComponentFixture<FormBaseComponent<unknown>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
