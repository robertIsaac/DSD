import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  role = new BehaviorSubject<string>(null);

  constructor() { }

  get role$() {
    return this.role.pipe(
      filter(role => !!role)
    );
  }

  get roleSync() {
    return this.role.getValue();
  }
}
