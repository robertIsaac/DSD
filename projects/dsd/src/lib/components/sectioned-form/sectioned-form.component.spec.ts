import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SectionedFormComponent } from './sectioned-form.component';

describe('SectionedFormComponent', () => {
  let component: SectionedFormComponent<unknown>;
  let fixture: ComponentFixture<SectionedFormComponent<unknown>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionedFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
