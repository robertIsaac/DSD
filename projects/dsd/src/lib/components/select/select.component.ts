import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'dsd-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
/**
 * this component simulate enhanced version of the native select element with options filtration on typing
 * @note this component use ng-content
 *
 * @example
 * <app-select>foo</app-select>
 * will looks like
 * <label>foo</label>
 * <input>
 */
export class SelectComponent<T extends { [key in keyof T]: string }> implements OnInit, ControlValueAccessor {

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  /**
   * the list to be displayed for the user
   */
  @Input() data: T[];
  /**
   * if the data is array of object then which attribute of the object to be returned upon select
   * if not provided then will be supposed the data is array of string
   */
  @Input() primaryKey: keyof T & string;
  /**
   * which attribute of the object to be displayed in the listed options
   * if not provided then will use primaryKey attribute
   */
  @Input() display: keyof T & string;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  option: T;
  random = Math.random();
  isDisabled: boolean;

  constructor() {
  }

  // tslint:disable-next-line:no-any
  propagateChange = (_: any) => {
  }

  ngOnInit() {
    this.propagateChange(1);
  }

  formatter = (option: T) => this.getDisplay(option);

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(50), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      distinctUntilChanged(),
      map(term => this.data.filter(option => new RegExp(term, 'mi').test(this.getDisplay(option)))),
    );
  }

  getDisplay(option: T): string {
    if (typeof option === 'string') {
      return option;
    }
    if (this.display) {
      return option[this.display];
    }
    if (this.primaryKey) {
      return option[this.primaryKey];
    }
  }

  getPrimaryKey(option: T): string {
    if (typeof option === 'string') {
      return option;
    }
    if (this.primaryKey) {
      return option[this.primaryKey];
    }
  }

  writeValue(obj): void {
    if (obj && this.data) {
      this.option = this.data.find(option => this.getPrimaryKey(option) === obj);
    }
  }

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn): void {
  }

  changed($event: NgbTypeaheadSelectItemEvent) {
    this.propagateChange(this.getPrimaryKey($event.item));
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

}
