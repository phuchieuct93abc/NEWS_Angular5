import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private storage: StorageMap) {}
  getItem<T>(id: string, fallbackValue: T): Observable<T> {
    return this.storage.get(id).pipe(map((item) => (item ? (item as T) : fallbackValue)));
  }

  setItem(id: string, item: unknown): Observable<unknown> {
    return this.storage.set(id, item);
  }

  hasKey(id: string): Observable<boolean> {
    return this.storage.has('news');
  }

  setItemSync(id: string, item: unknown): void {
    if (typeof localStorage == 'undefined') {
      return;
    }

    localStorage?.setItem(id, JSON.stringify(item));
  }
  getItemSync<T>(id: string, defaultValue: T): T {
    if (typeof localStorage == 'undefined') {
      return defaultValue;
    }
    return JSON.parse(localStorage?.getItem(id)) || defaultValue;
  }
}
