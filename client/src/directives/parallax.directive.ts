import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Subject, asyncScheduler } from 'rxjs';
import { throttleTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appParallax]'
})
export class ParallaxDirective implements OnDestroy {
  startScrollY: number;
  scrollListener$: () => void = () => { };
  scroll$ = new Subject<void>();
  requestId: any;
  onDestroy$ = new Subject<void>();
  _parallax: boolean;
  @Input()
  maxParallax;
  originalScale:number;
  onStopParallax$ = new Subject<void>();

  readonly limitRangeParallax = 100;

  @Input()
  public set appParallax(value: boolean) {

    if (value) {
      this.startParallax();
    }
    if (!value && this._parallax) {
      this.stopParallax();

    }
    this._parallax = value
  }

  constructor(private imageRef: ElementRef<HTMLImageElement>, private renderer2: Renderer2) { }

  startParallax() {
    setTimeout(() => {
      this.setParallaxing(true);
      this.startScrollY = this.getOffsetTop();
      this.originalScale = this.imageRef.nativeElement.getBoundingClientRect().width / this.imageRef.nativeElement.offsetWidth;
      this.imageRef.nativeElement.style['willChange'] = 'transform';
      this.scrollListener$();
      this.scrollListener$ = this.renderer2.listen('window', 'scroll', () => this.scroll$.next());
      this.startListenScroll();
    }, 1000);
  }

  stopParallax() {
    this.setStoppongParallax(true);
    this.scrollListener$();
    this.onStopParallax$.next();
    this.imageRef.nativeElement.style.transform = `scale(${this.originalScale})`;
    window.cancelAnimationFrame(this.requestId)
    setTimeout(() => {
      this.setStoppongParallax(false);
      this.setParallaxing(false);
    }, 1000);
  }

  startListenScroll(){
    this.scroll$.pipe(
      throttleTime(200, asyncScheduler, { leading: true, trailing: true }), 
      takeUntil(this.onDestroy$),
      takeUntil(this.onStopParallax$)).subscribe(() => {
      this.requestAnimation();
    })
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

  getOffsetTop() {
    return this.imageRef.nativeElement.getBoundingClientRect().top;

  }

  private requestAnimation() {
    if(this.isScrollTooFar()){
      return;
    }
    return this.updateAnimation();

  }
  private updateAnimation(startTimestamp?) {
    this.requestId =  window.requestAnimationFrame(timestamp => {
      if (startTimestamp === undefined) {
        startTimestamp = timestamp;
      }
      const elapsed = timestamp - startTimestamp;
      const deltaY = (this.startScrollY - this.getOffsetTop()) * 0.2
      let adjustDeltaY = Math.max(0, Math.min(this.maxParallax, deltaY));
      this.imageRef.nativeElement.style.transform = `scale(${this.originalScale}) translateY(${adjustDeltaY}px)`;

       if (elapsed < 200) { 
        this.requestId = this.updateAnimation(startTimestamp);
      }
    })
    return this.requestId;
  }

  ngOnDestroy(): void {
    this.scrollListener$();
    this.onDestroy$.next();
  }

  isScrollTooFar(){
    const deltaY = (this.startScrollY - this.getOffsetTop()) * 0.2
    if(deltaY<0){
      return deltaY < this.limitRangeParallax
    }
    else if(deltaY>this.maxParallax ){
      return (deltaY - this.maxParallax) > this.limitRangeParallax
    }

  }


}
