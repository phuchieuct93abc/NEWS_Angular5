import { Directive, Output, ElementRef, EventEmitter, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { asyncScheduler, debounceTime, filter, Subject } from 'rxjs';
import { IS_NODE } from './../app/shared/const';

@Directive({
  selector: '[appIsIntersect]',
})
export class IsIntersectDirective implements AfterViewInit, OnDestroy {
  @Output()
  public appIsIntersect = new EventEmitter<boolean>();
  private onDestroy$ = new Subject<void>();
  private intersect$ = new Subject<boolean>();

  private observer: IntersectionObserver;
  public constructor(private element: ElementRef<HTMLElement>, @Inject(IS_NODE) private isNode: boolean) {}

  public ngAfterViewInit(): void {
    if (this.isNode) {
      return;
    }
    this.observer = new IntersectionObserver(
      ([data]) => {
        this.intersect$.next(data.isIntersecting);
      },
      {
        rootMargin: '200px',
      }
    );
    this.observer.observe(this.element.nativeElement);
    this.intersect$.pipe(filter((intersecting) => intersecting)).subscribe((intersect) => this.appIsIntersect.emit(intersect));
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
