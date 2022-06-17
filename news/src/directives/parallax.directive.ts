import { Directive, ElementRef, Input, OnDestroy, Inject, HostBinding, NgZone } from '@angular/core';
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
  @HostBinding('style.transition')
  public transition: string;
  public readonly limitRangeParallax = 200;
  public onDestroy$ = new Subject<void>();
  private observer: IntersectionObserver;
  private previousTransition: string;
  private isParallax = false;

  public constructor(
    private imageRef: ElementRef<HTMLImageElement>,
    @Inject(IS_NODE) private isNode: boolean,
    @Inject(IS_MOBILE) private isMobile: boolean,
    private zone: NgZone
  ) {}

  @Input()
  public set appParallax(value: boolean) {
    if (value) {
      this.startParallax();
      this.isParallax = true;
    } else if (this.isParallax) {
      this.stopParallax();
    }
  }

  public startParallax(): void {
    if (this.isNode) {
      return;
    }
    this.previousTransition = this.transition;
    this.transition = 'none';

    this.initThresholdSet();
    this.observer?.disconnect?.();
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver((entries) => this.updateAnimation(entries), {
        rootMargin: `-${this.startOffsetParallax}px 0px 0px 0px`,
        threshold: ParallaxDirective.thresholdSets,
      });

      this.observer.observe(this.imageRef.nativeElement);
    });
  }

  public stopParallax(): void {
    if (this.isNode) {
      return;
    }
    this.observer?.disconnect?.();
    this.updateTransform(0);
    requestAnimationFrame(() => (this.transition = this.previousTransition));
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.observer?.disconnect();
  }

  initThresholdSet(): void {
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

    if (entry.boundingClientRect.top > this.startOffsetParallax) {
      //prevent parallax when under view fold
      this.updateTransform(0);
      return;
    }
    const deltaY = (1 - entry.intersectionRatio) * 30;
    this.updateTransform(deltaY);
  }

  private updateTransform(translateY: number) {
    this.imageRef.nativeElement.style.transform = `translateY(${translateY}%)`;
  }
}
