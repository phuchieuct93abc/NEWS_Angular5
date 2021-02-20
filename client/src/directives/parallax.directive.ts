import { Directive, ElementRef, Input, Renderer2, OnDestroy, Inject } from '@angular/core';
import { Subject, asyncScheduler, fromEvent, interval } from 'rxjs';
import { throttleTime, takeUntil, throttle } from 'rxjs/operators';
import { IS_NODE } from 'src/app/shared/const';

@Directive({
  selector: '[appParallax]',
})
export class ParallaxDirective implements OnDestroy {
  @Input()
  public maxParallax = 0;
  public readonly limitRangeParallax = 200;
  public onStopParallax$ = new Subject<void>();
  public scroll$ = new Subject<void>();
  public requestId: any;
  public onDestroy$ = new Subject<void>();
  public startScrollY = 0;


  public constructor(private imageRef: ElementRef<HTMLImageElement>,
    private renderer2: Renderer2,
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

    setTimeout(() => {
      this.setParallaxing(true);
      this.startScrollY = this.getOffsetTop();
      const boundingClientWidth = this.imageRef.nativeElement.getBoundingClientRect().width;
      const offSetWidth = this.imageRef.nativeElement.offsetWidth;
      this.imageRef.nativeElement.style.willChange = 'transform';

      fromEvent(window,'scroll').pipe(
        throttleTime(900, asyncScheduler, { leading: true, trailing: true }),
        takeUntil(this.onDestroy$),
        takeUntil(this.onStopParallax$)).subscribe(() => {
          console.log('start');
          this.requestAnimation();
        });
    }, 1000);
  }

  public stopParallax() {
    if (this.isNode) {
      return;
    }
    this.setStoppongParallax(true);
    this.onStopParallax$.next();
    window.cancelAnimationFrame(this.requestId);
    setTimeout(() => {
      this.setStoppongParallax(false);
      this.setParallaxing(false);
    }, 1000);
  }


  public ngOnDestroy(): void {
    this.onDestroy$.next();
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

  private requestAnimation() {
    if (this.isScrollTooFar()) {
      return;
    }
    return this.updateAnimation();

  }

  private updateAnimation(startTimestamp?) {
    this.requestId = window.requestAnimationFrame((timestamp) => {
      if (startTimestamp === undefined) {
        startTimestamp = timestamp;
      }
      const elapsed = timestamp - startTimestamp;
      const deltaY = (this.startScrollY - this.getOffsetTop()) * 0.2;
      const adjustDeltaY = Math.max(0, Math.min(this.maxParallax, deltaY));
      this.imageRef.nativeElement.style.transform = `translateY(${adjustDeltaY}px)`;

      if (elapsed < 1000) {
        this.requestId = this.updateAnimation(startTimestamp);
      }
    });
    return this.requestId;
  }

  private isScrollTooFar() {
    const deltaY = (this.startScrollY - this.getOffsetTop()) * 0.2;
    if (deltaY < 0) {
      return deltaY < 0 - this.limitRangeParallax;
    } else if (deltaY > this.maxParallax) {
      return (deltaY - this.maxParallax) > this.limitRangeParallax;
    }
    return false;

  }

}
