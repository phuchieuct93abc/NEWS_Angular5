import { Directive, ElementRef, Input, OnDestroy, Inject, HostBinding } from '@angular/core';
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
  @Input()
  public startOffsetParallax = undefined;
  @HostBinding('style.transition')
  public transition;
  public readonly limitRangeParallax = 200;
  public onDestroy$ = new Subject<void>();
  public startScrollY = 0;
  private observer: IntersectionObserver;
  private previousTransition: string;

  private isParallaxing = false;




  public constructor(private imageRef: ElementRef<HTMLImageElement>,
    @Inject(IS_NODE) private isNode: boolean) {

  }

  @Input()
  public set appParallax(value: boolean) {
    if (value) {
      this.startParallax();
      this.isParallaxing = true;
    } else if(this.isParallaxing) {
      this.stopParallax();
    }
  }


  public startParallax() {
    if (this.isNode) {
      return;
    }
    this.previousTransition = this.transition;
    this.transition = 'none';

    this.initThresholdSet();
    this.observer?.disconnect?.();

    this.observer = new IntersectionObserver(this.updateAnimation.bind(this), {
      rootMargin: '-60px 0px 0px 0px',
      threshold: ParallaxDirective.thresholdSets,
    });

    this.untilStable().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.startScrollY = this.startOffsetParallax ?? this.getOffsetTop();
      this.observer.observe(this.imageRef.nativeElement);
    });

  }

  public stopParallax() {
    if (this.isNode) {
      return;
    }
    this.observer?.disconnect?.();
    this.updateTranform(0);
    this.untilStable().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.transition = this.previousTransition;
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

  private getOffsetTop() {
    return this.imageRef.nativeElement.getBoundingClientRect().top;

  }

  private updateAnimation() {
    const deltaY = (this.startScrollY - this.getOffsetTop()) * 0.3;
    const adjustDeltaY = Math.max(0, Math.min(this.maxParallax, deltaY));
    this.updateTranform(adjustDeltaY);
  }

  private updateTranform(translateY: number){
    this.imageRef.nativeElement.style.transform = `translateY(${translateY}px)`;

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
        if (check > maxCheck || equalTime === 3) {
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
