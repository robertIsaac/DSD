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

  update(editId: string, updateUrl: string, value: {}): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(`${this.environment.APIBaseUrl}${updateUrl}`, {id: editId, ...value});
  }

  insert(insertUrl: string, value: {}): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(`${this.environment.APIBaseUrl}${insertUrl}`, {id: '', ...value});
  }

  delete<T>(id: string, deleteUrl: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(`${this.environment.APIBaseUrl}${deleteUrl}/${id}`);
  }

  HandleError(error) {
    if (error.status === 401) {
      this.router.navigate(['']);
    } else {
      this.notificationService.open(error && error.error && error.error.message, {type: NotificationType.danger});
    }
  }

}
