import { Injectable } from '@angular/core';
import { NotificationOptions, NotificationType } from '../interfaces/notification-options';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  protected message = new BehaviorSubject<string>(null);
  protected title = new BehaviorSubject<string>(null);
  protected areYouSure = new BehaviorSubject<boolean>(null);
  protected response = new Subject<boolean>();
  protected type = new BehaviorSubject<NotificationType>(null);

  constructor() {
  }

  get message$() {
    return this.message.pipe(
      distinctUntilChanged(),
    );
  }

  get title$() {
    return this.title.pipe(
      distinctUntilChanged(),
    );
  }

  get type$(): Observable<NotificationType> {
    return this.type.pipe(
      distinctUntilChanged(),
    );
  }

  get areYouSure$() {
    return this.areYouSure.asObservable();
  }

  open(message, {type = NotificationType.alert, areYouSure = true, title = ''}: NotificationOptions = {}): Observable<boolean> {
    if (type !== NotificationType.confirm) {
      areYouSure = false;
    }
    this.message.next(message);
    this.title.next(title);
    this.type.next(type);
    this.areYouSure.next(areYouSure);
    return this.response.pipe(first());
  }

  done(response: boolean): void {
    this.response.next(response);
    this.areYouSure.next(true);
    this.message.next(null);
    this.title.next(null);
  }
}
