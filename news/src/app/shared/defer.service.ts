import { Inject, Injectable } from '@angular/core';
import { IS_NODE } from './const';

@Injectable({
  providedIn: 'root',
})
export class DeferService {
  constructor(@Inject(IS_NODE) private isNode: boolean) {}
  public defer(fn: () => void, timeout: number = 0): void {
    if (!this.isNode) {
      setTimeout(() => fn(), timeout);
      return;
    }
    fn();
  }
}
