import { Directive, ElementRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import vars from '../app/variable';

@Directive({
  selector: '[appSwipeToClose]'
})
export class SwipeToCloseDirective implements OnDestroy {


  readonly panThreshold = 50;
  private nativeElement: HTMLElement;
  @Output('appSwipeToClose')
  private onPanEnd = new EventEmitter<'left' | 'right'>();

  constructor(element: ElementRef) {
    this.nativeElement = element.nativeElement
    var mc = new Hammer(this.nativeElement);
    mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 50 }));

    mc.on('panmove', ev => this.panMove(ev));
    mc.on('pancancel', ev => this.panCancel(ev));
    mc.on('panend', ev => this.panEnd(ev));
  }

  panMove(event) {
    if (event.center.x - event.deltaX < vars.sideNavThreshold) {
      return
    }
    // if (event.distance < 30 && articleNativeElement.style.transform == '') {
    //   // console.log("3");
    //   return
    // }
    console.log(event.deltaX)
    this.nativeElement.style.transform = `translateX(${event.deltaX}px)`
    if (Math.abs(event.deltaX) > this.panThreshold) {
      this.nativeElement.style.opacity = "0.5"

    } else {
      this.nativeElement.style.opacity = "1"

    }


  }

  panCancel(e) {
    this.revertPosition(false)
  }

  private revertPosition(animation = true) {
    if (animation) {
      this.nativeElement.classList.add("animation");
    }
    setTimeout(() => {
      this.nativeElement.style.transform = ``;
      setTimeout(() => {
        this.nativeElement.classList.remove("animation");
      }, 200);
    }, 0);
  }

  panEnd(event) {
    if (event.center.x - event.deltaX > vars.sideNavThreshold) {

      if (Math.abs(event.deltaX) > this.panThreshold) {
        if (event.deltaX > 0) {
          console.log("emit right")
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
    console.log("ondestroy")
  }

}
