import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { NotificationType } from '../interfaces/notification-options';

export const ENVIRONMENT = new InjectionToken<{APIBaseUrl: string}>('environment');

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    protected httpClient: HttpClient,
    protected notificationService: NotificationService,
    protected router: Router,
    // tslint:disable-next-line:no-any
    @Inject(ENVIRONMENT) protected environment: any
  ) {
  }

  get<T = ApiResponse>(getUrl: string): Observable<T> {
    return this.httpClient.get<T>(`${this.environment.APIBaseUrl}${getUrl}`);
  }

  update<T = ApiResponse>(updateUrl: string, value: {}): Observable<T> {
    return this.httpClient.put<T>(`${this.environment.APIBaseUrl}${updateUrl}`, value);
  }

  insert<T = ApiResponse>(insertUrl: string, value: {}): Observable<T> {
    return this.httpClient.post<T>(`${this.environment.APIBaseUrl}${insertUrl}`, {id: '', ...value});
  }

  delete<T = ApiResponse>(deleteUrl: string, id: string): Observable<T> {
    return this.httpClient.delete<T>(`${this.environment.APIBaseUrl}${deleteUrl}/${id}`);
  }

  HandleError(error) {
    if (error.status === 401) {
      this.router.navigate(['']);
    } else {
      this.notificationService.open(error && error.error && error.error.message, {type: NotificationType.danger});
    }
  }

}
