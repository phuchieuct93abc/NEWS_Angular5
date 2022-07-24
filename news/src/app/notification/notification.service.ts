import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import environment from '../../environments/environment';

@Injectable({
  providedIn: `root`,
})
export class NotificationService {
  public constructor(private httpClient: HttpClient) {}

  public subscribeToken(token: string) {
    this.httpClient
      .post(environment.baseUrl + 'subscribe', {
        token,
        topic: 'BaoHieu',
      })
      .subscribe((value) => {});
  }
}
