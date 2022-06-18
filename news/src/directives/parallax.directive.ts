import { Directive, ElementRef, Input, OnDestroy, Inject, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { IS_MOBILE, IS_NODE } from 'src/app/shared/const';
@Directive({
  selector: '[appParallax]',
})
export class ParallaxDirective implements OnDestroy {
  static thresholdSets: number[];
  @Input()
  public maxParallax = 0;
  @Input()
  public startOffsetParallax = 0;

  public readonly limitRangeParallax = 200;
  public onDestroy$ = new Subject<void>();
  private observer: IntersectionObserver;
  private previousTransition: string;
  private isParallax = false;

  public constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(IS_NODE) private isNode: boolean,
    @Inject(IS_MOBILE) private isMobile: boolean,
    private zone: NgZone
  ) {}

  @Input()
  public set appParallax(value: boolean) {
    this.zone.runOutsideAngular(() => {
      if (value) {
        this.startParallax();
        this.isParallax = true;
      } else if (this.isParallax) {
        this.stopParallax();
      }
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.observer?.disconnect();
  }

  private startParallax(): void {
    if (this.isNode) {
      return;
    }
    this.previousTransition = this.elementRef.nativeElement.style.transition;
    this.elementRef.nativeElement.style.transition = 'transform 0.05s linear';
    this.initThresholdSet();
    this.observer?.disconnect?.();

    this.observer = new IntersectionObserver((entries) => this.updateAnimation(entries), {
      rootMargin: `-${this.startOffsetParallax}px 0px 0px 0px`,
      threshold: ParallaxDirective.thresholdSets,
    });

    this.observer.observe(this.elementRef.nativeElement);
  }

  private stopParallax(): void {
    if (this.isNode) {
      return;
    }
    requestAnimationFrame(() => (this.elementRef.nativeElement.style.transition = this.previousTransition));
    this.observer?.disconnect?.();
    this.updateTransform(0);
  }

  private initThresholdSet(): void {
    if (!ParallaxDirective.thresholdSets) {
      ParallaxDirective.thresholdSets = [];
      for (let i = 0; i <= 1.0; i += 0.001) {
        ParallaxDirective.thresholdSets.push(i);
      }
    }
  }

  private updateAnimation([entry]: IntersectionObserverEntry[]) {
    if (this.isMobile && entry.intersectionRect.x > 10) {
      //Prevent parallax when open menu
      return;
    }
    if (
      (entry.boundingClientRect.top < window.innerHeight && entry.boundingClientRect.bottom > window.innerHeight) ||
      entry.intersectionRatio === 0
    ) {
      console.log('reset');
      // prevent parallax when under view fold
      this.updateTransform(0);
      return;
    }
    // console.table(entry.intersectionRatio);
    const deltaY = (1 - entry.intersectionRatio) * 30;
    this.updateTransform(deltaY);
  }

  private updateTransform(translateY: number) {
    this.elementRef.nativeElement.style.transform = `translateY(${translateY}%)`;
  }
}
