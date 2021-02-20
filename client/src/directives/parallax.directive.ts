import { Directive, ElementRef, Input, OnDestroy, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IS_NODE } from 'src/app/shared/const';
@Directive({
  selector: '[appParallax]',
})
export class ParallaxDirective implements OnDestroy {
  static thresholdSets: number[];
  @Input()
  public maxParallax = 0;
  public readonly limitRangeParallax = 200;
  public onStopParallax$ = new Subject<void>();
  public onDestroy$ = new Subject<void>();
  public startScrollY = 0;
  private observer: IntersectionObserver;


  public constructor(private imageRef: ElementRef<HTMLImageElement>,
    @Inject(IS_NODE) private isNode: boolean) {

  }

  @Input()
  public set appParallax(value: boolean) {
    if (value) {
      this.startParallax();
    } else {
      this.stopParallax();
    }
  }


  public startParallax() {
    if (this.isNode) {
      return;
    }
    this.initThresholdSet();
    this.setParallaxing(true);
    this.imageRef.nativeElement.style.willChange = 'transform';
    this.observer?.disconnect?.();

    this.observer = new IntersectionObserver(this.updateAnimation.bind(this), {
      rootMargin: '-60px 0px 0px 0px',
      threshold: ParallaxDirective.thresholdSets,
    });

    this.untilStable().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.startScrollY = this.getOffsetTop();
      this.observer.observe(this.imageRef.nativeElement);
    });

  }

  public stopParallax() {
    if (this.isNode) {
      return;
    }
    this.setStoppongParallax(true);
    this.onStopParallax$.next();
    this.untilStable().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.setStoppongParallax(false);
      this.setParallaxing(false);
      this.observer?.disconnect?.();

    });
  }


  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  initThresholdSet() {
    if (!ParallaxDirective.thresholdSets) {
      ParallaxDirective.thresholdSets = [];
      for (let i = 0; i <= 1.0; i += 0.01) {
        ParallaxDirective.thresholdSets.push(i);
      }
    }
  }

  private setParallaxing(isParallaxing: boolean) {
    if (isParallaxing) {
      this.imageRef.nativeElement.classList.add('parallaxing');
    } else {
      this.imageRef.nativeElement.classList.remove('parallaxing');

    }
  }


  private setStoppongParallax(isParallaxing: boolean) {
    if (isParallaxing) {
      this.imageRef.nativeElement.classList.add('stopping-parallax');
    } else {
      this.imageRef.nativeElement.classList.remove('stopping-parallax');

    }
  }

  private getOffsetTop() {
    return this.imageRef.nativeElement.getBoundingClientRect().top;

  }

  private updateAnimation() {
    const deltaY = (this.startScrollY - this.getOffsetTop()) * 0.2;
    const adjustDeltaY = Math.max(0, Math.min(this.maxParallax, deltaY));
    this.imageRef.nativeElement.style.transform = `translateY(${adjustDeltaY}px)`;
  }

  private untilStable(): Observable<void> {
    return new Observable((observer) => {
      const timeToCheck = 50;
      const maxCheck = 2000 / 50;
      let check = 0;
      let equalTime = 0;
      let previousOffset = this.getOffsetTop();
      const interval = setInterval(() => {
        check++;
        equalTime = this.getOffsetTop() === previousOffset? equalTime + 1: equalTime;
        if (check > maxCheck || equalTime === 2) {
          clearInterval(interval);
          observer.next();
          observer.complete();

        } else {
          previousOffset = this.getOffsetTop();
        }
      }, timeToCheck);
    });
  }

}
