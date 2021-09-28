import { takeUntil } from 'rxjs/operators';
import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { Directive, OnDestroy } from '@angular/core';

// TODO: Add Angular decorator.
@Directive()
export class DestroySubscriber implements OnDestroy {
  protected onDestroy$ = new Subject<void>();

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }
  protected getTakeUntilDestroy<T>(): MonoTypeOperatorFunction<T> {
    return takeUntil(this.onDestroy$);
  }
}
