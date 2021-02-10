import { takeUntil } from 'rxjs/operators';
import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

// TODO: Add Angular decorator.
export class DestroySubscriber implements OnDestroy {
    protected onDestroy$ = new Subject<void>();

    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }
    protected getTakeUntilDestroy<T>(): MonoTypeOperatorFunction<T>{
        return takeUntil(this.onDestroy$);
    }
}
