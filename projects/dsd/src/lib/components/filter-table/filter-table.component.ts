import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { isFilterableColumn, Section, TableColumn, TableColumnFilterTypes } from '../../interfaces/table-column';
import { Filter } from '../../interfaces/filter';
import { FilterService } from '../../services/filter.service';
import { Moment } from 'moment';

@Component({
  selector: 'dsd-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss']
})
/**
 * this component filters and paginates data of the table
 * @note this component accept ng-content
 *
 * @example
 * <app-filter-table>
 *   <tr>
 *     <td>foo</td>
 *   </tr>
 * </app-filter-table>
 * will be rendered like
 * <ngb-tabset>...</ngb-tabset>
 * <table>
 *   <thead>...</thead>
 *   <tbody>
 *     <tr>
 *       <td>foo</td>
 *     </tr>
 *   </tbody>
 * </table>
 * <ngb-pagination>...</ngb-pagination>
 */
export class FilterTableComponent<T> implements OnInit, OnChanges, OnDestroy {

  private data$ = new BehaviorSubject<{ [key in keyof T]: string }[]>(null);
  private filteredData$ = new BehaviorSubject<T[]>(null);
  /**
   * if true it means to create only the filter and pagination sections so it's content should be of type <table>
   * if false then the content will be added inside the tbody and should be of type <tr>
   * @example
   * with default false
   *  * <app-filter-table>
   *   <tr>
   *     <td>foo</td>
   *   </tr>
   * </app-filter-table>
   * will be rendered like
   * <ngb-tabset>...</ngb-tabset>
   * <table>
   *   <thead>...</thead>
   *   <tbody>
   *     <tr>
   *       <td>foo</td>
   *     </tr>
   *   </tbody>
   * </table>
   * <ngb-pagination>...</ngb-pagination>
   *
   * to render the same example with noFilter true
   * <app-filter-table [noFilter]="true">
   *   <table>
   *     <thead>...</thead>
   *     <tbody>
   *       <tr>
   *         <td>foo</td>
   *       </tr>
   *     </tbody>
   *   </table>
   * </app-filter-table>
   */
  @Input() noTable = false;
  /**
   * the columns of the data
   */
  @Input() columns: TableColumn<T>[];
  /**
   * the data to be paginated and filtered
   * note: this will not be used if sections is provided
   */
  @Input() data: { [key in keyof T]: string | number }[];
  /**
   * if the table has multiple level of headers
   * note: columns will be overwritten by columns inside this section
   */
  @Input() sections: Section<T>[];
  /**
   * this event trigger when the user filter, change the current page or page limit
   * it emit the new filter criteria
   */
  @Output() filter = new EventEmitter<Filter<{ [key in keyof T]: string }, Moment[]>>();
  /**
   * this attribute next values with same condition of filter event
   * it send the filtered data
   */
  @Output() filteredData: Observable<T[]> = this.filteredData$.pipe(filter(data => !!data));
  random = Math.random();
  hidden = true;
  pages: number;
  page = 1;
  filterForm: UntypedFormGroup;
  type: TableColumnFilterTypes;
  limit = 10;
  paginationOptions = [10, 25, 50, 100];
  private dataSubscription: Subscription;
  items: number;
  displayedItems: number;
  sortBy: keyof T & string;
  sortOrder: 'asc' | 'desc';

  constructor(
    protected formBuilder: UntypedFormBuilder,
  ) {
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      filter: ['', Validators.required],
      value: ['', Validators.required]
    });
    this.dataSubscription = FilterService.filter(this.data$, this.filter).subscribe(data => {
      if (this.isT(data.body)) {
        this.filteredData$.next(data.body);
        this.displayedItems = data.body.length;
        this.pages = data.pages;
        this.items = data.items;
      }
    });
    this.triggerResetFilter();
  }

  isT(array: unknown): array is T[] {
    return (array as unknown[]).length >= 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns && !changes.columns.isFirstChange()) {
      this.triggerResetFilter();
    }
    if (changes.data) {
      this.data$.next(changes.data.currentValue);
    }
  }

  triggerResetFilter() {
    this.fieldChanged();
    this.filter.emit({
      page: 1,
      limit: this.limit,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    });
  }

  triggerFilter(page: number = 1) {
    this.page = page;
    this.filter.emit({
        filter: this.filterForm.controls.filter.value,
        value: this.filterForm.controls.value.value,
        page: this.page,
        limit: this.limit,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      },
    );
  }

  fieldChanged() {
    const selectedFilter = this.columns.find(thisFilter => {
      return isFilterableColumn(thisFilter) && this.filterForm && thisFilter.name === this.filterForm.controls.filter.value;
    });
    if (!isFilterableColumn(selectedFilter)) {
      return;
    }
    const type = selectedFilter ? selectedFilter.type : undefined;
    if (this.type !== type) {
      this.filterForm.controls.value.reset('');
    }
    this.type = type;
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  sort(name: keyof T & string) {
    this.sortOrder = this.sortBy === name && this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortBy = name;
    this.filter.next({
      filter: this.filterForm.controls.filter.value,
      value: this.filterForm.controls.value.value,
      page: this.page,
      limit: this.limit,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    });
  }
}
