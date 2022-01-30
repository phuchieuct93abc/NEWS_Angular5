import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { asyncScheduler, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[appSmoothScroll]',
})
export class SmoothScrollDirective implements OnDestroy {
  private currentScrollRequest: number;
  private onChange$ = new Subject<'up' | 'down'>();
  private scrollBy = {
    up: -5,
    down: 5,
  };
  private onDestroy$ = new Subject<void>();

  constructor(private view: ElementRef<HTMLElement>) {
    this.onChange$.pipe(throttleTime(190, asyncScheduler, { leading: true, trailing: true }), takeUntil(this.onDestroy$)).subscribe((direction) => {
      cancelAnimationFrame(this.currentScrollRequest);
      this.smoothScroll(new Date().getTime(), this.scrollBy[direction], 200);
    });
  }

  private smoothScroll(start: number, scrollBy: number, duration: number = 200) {
    const elapsed = new Date().getTime() - start;
    if (elapsed >= duration) {
      return;
    }

    this.currentScrollRequest = window.requestAnimationFrame(() => {
      this.view.nativeElement.scrollBy({ top: scrollBy });
      this.smoothScroll(start, scrollBy, duration);
    });
  }

  public up() {
    this.onChange$.next('up');
  }

  public down() {
    this.onChange$.next('down');
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
