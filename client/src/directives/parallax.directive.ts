import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Subject, asyncScheduler } from 'rxjs';
import { throttleTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appParallax]'
})
export class ParallaxDirective implements OnInit, OnDestroy {
  startScrollY: number;
  scrollListener$: () => void = () => { };
  scroll$ = new Subject<void>();
  requestId: any;
  onDestroy$ = new Subject<void>();

  @Input()
  public set appParallax(value: boolean) {

    if (value) {
      this.startParallax();
    }
    if (!value) {
      this.stopParallax();

    }
  }

  constructor(private imageRef: ElementRef<HTMLImageElement>, private renderer2: Renderer2) { }

  ngOnInit(): void {
    this.scroll$.pipe(throttleTime(1000, asyncScheduler, { leading: true, trailing: true }), takeUntil(this.onDestroy$)).subscribe(() => {

      this.requestAnimation();

    })
  }

  startParallax() {
    setTimeout(() => {

      this.setParallaxing(true);
      this.startScrollY = this.getOffsetTop();
    this.imageRef.nativeElement.style['willChange'] = 'transform';
      this.scrollListener$();
      this.scrollListener$ = this.renderer2.listen('window', 'scroll', () => this.scroll$.next());
    }, 1000);
  }

  stopParallax() {
    this.setStoppongParallax(true);
    this.scrollListener$();
    this.imageRef.nativeElement.style.transform = 'scale(1.1)';
    window.cancelAnimationFrame(this.requestId)
    setTimeout(() => {
      this.setStoppongParallax(false);
      this.setParallaxing(false);
    }, 1000);
  }

  setParallaxing(isParallaxing: boolean) {
    if (isParallaxing) {
      this.imageRef.nativeElement.classList.add('parallaxing');
    } else {
      this.imageRef.nativeElement.classList.remove('parallaxing');

    }
  }

  setStoppongParallax(isParallaxing: boolean) {
    if (isParallaxing) {
      this.imageRef.nativeElement.classList.add('stopping-parallax');
    } else {
      this.imageRef.nativeElement.classList.remove('stopping-parallax');

    }
  }

  getOffsetTop(){
    return this.imageRef.nativeElement.getBoundingClientRect().top;

  }
  
  private requestAnimation() {
    return this.updateAnimation();

  }
  private updateAnimation(startTimestamp?) {
    return window.requestAnimationFrame(timestamp => {
      if (startTimestamp === undefined) {
        startTimestamp = timestamp;
      }
      const elapsed = timestamp - startTimestamp;
      let deltaY = Math.max(0, Math.min(200, this.startScrollY-  this.getOffsetTop() ) * 0.2);
      this.imageRef.nativeElement.style.transform = `scale(1.1) translateY(${deltaY}px)`;

      if (elapsed < 1000) { // Stop the animation after 1 second
        this.requestId = this.updateAnimation(startTimestamp);
      }
    })
  }

  ngOnDestroy(): void {
    this.scrollListener$();
    this.onDestroy$.next();
  }


}
