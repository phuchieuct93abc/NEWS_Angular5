import { Directive, ElementRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import vars from '../app/variable';

@Directive({
  selector: '[appSwipeToClose]'
})
export class SwipeToCloseDirective implements OnDestroy {


  readonly panThreshold = 80;
  readonly closeThreshold = 120;
  private nativeElement: HTMLElement;
  private mc: HammerManager;
  @Output('appSwipeToClose')
  private onPanEnd = new EventEmitter<'left' | 'right'>();

  constructor(element: ElementRef) {
    this.nativeElement = element.nativeElement
    this.mc = new Hammer(this.nativeElement);
    this.mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: this.panThreshold }));

    this.mc.on('panmove', ev => this.panMove(ev));
    // this.mc.on('panleft', ev => this.panMove(ev));
    this.mc.on('pancancel', ev => this.panCancel());
    this.mc.on('panend', ev => this.panEnd(ev));
  }

  panMove(event) {
    // if ([Hammer.DIRECTION_LEFT, Hammer.DIRECTION_RIGHT].indexOf(event.offsetDirection) === -1) {
    //   return
    // }
    if (event.distance < 100 && this.nativeElement.style.transform === '') {
      return
    }
    console.log(event, event.additionalEvent)
    if (event.center.x - event.deltaX < vars.sideNavThreshold) {
      return
    }
    this.nativeElement.style.transform = `translateX(${event.deltaX}px)`
    if (Math.abs(event.deltaX) > this.closeThreshold) {
      this.nativeElement.style.opacity = "0.5"

    } else {
      this.nativeElement.style.opacity = "1"

    }


  }

  panCancel() {
    this.revertPosition(false)
  }

  private revertPosition(animation = true) {
    if (animation) {
      this.nativeElement.style.transition = "transform 0.2s ease-in-out";
    }
    setTimeout(() => {
      this.nativeElement.style.transform = ``;
      setTimeout(() => {
        this.nativeElement.style.transition = "";
      }, 200);
    }, 0);
  }

  panEnd(event) {
    if (event.center.x - event.deltaX > vars.sideNavThreshold) {

      if (Math.abs(event.deltaX) > this.closeThreshold) {
        if (event.deltaX > 0) {
          this.onPanEnd.emit("right")
        } else {
          this.onPanEnd.emit("left")
        }
      } else {
        this.revertPosition();

      }
    } else {

      this.revertPosition();
    }

  }


  ngOnDestroy(): void {
    this.mc.destroy();
  }

}
