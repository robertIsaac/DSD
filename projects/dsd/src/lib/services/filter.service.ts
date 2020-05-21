import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Filter } from '../interfaces/filter';

@Injectable({
  providedIn: 'root',
})
export class FilterService {

  constructor() {
  }

  static filter<T extends { [key in keyof T]: string }>(
    data$: Observable<T[]>,
    filter$: Observable<Filter<T, Moment[]>>,
  ): Observable<{ body: T[], pages: number, items: number }> {
    const mapFilter = map(([data, filter]: [T[], Filter<T, Moment[]>]): { body: T[], pages: number, items: number } => {
      let body = FilterService.filterData(data, filter);
      const pages = Math.ceil(body.length / filter.limit);
      const items = body.length;
      body = body.slice((filter.page - 1) * filter.limit, filter.page * filter.limit);
      return {body, pages, items};
    });
    return combineLatest([data$, filter$]).pipe(mapFilter);
  }

  static filterData<T extends { [key in keyof T]: string }>(data: T[], filter: Filter<T, Moment[]>): T[] {
    if (!data) {
      return [];
    }
    let body;
    const value = filter.value;
    if (filter.filter && typeof value === 'string') {
      body = data.filter(log => {
        return log[filter.filter] && String(log[filter.filter]).toLowerCase().indexOf(String(value).toLowerCase()) !== -1;
      });
    } else if (filter.filter && Array.isArray(value)) {
      body = data.filter(log => {
        if (!log[filter.filter]) {
          return;
        }
        const date = moment(log[filter.filter]).toDate();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.valueOf() >= value[0].valueOf() && date.valueOf() <= value[1].valueOf();
      });
    } else {
      body = data;
    }
    return this.sortData(body, filter);
  }

  static sortData<T extends { [key in keyof T]: string }>(data: T[], filter: Filter<T, Moment[]>): T[] {
    if (!filter.sortBy) {
      return data;
    }
    const sortAsc = filter.sortOrder === 'asc';
    return data.sort((a, b) => {
      return this.compare(a[filter.sortBy], b[filter.sortBy], sortAsc);
    });
  }

  static compare<T>(a: T, b: T, sortAsc: boolean) {
    if (a === b) {
      return 0;
    }
    if (a > b || b === null) {
      return sortAsc ? 1 : -1;
    } else if (a < b || a === null) {
      return sortAsc ? -1 : 1;
    }
    return 0;
  }
}
