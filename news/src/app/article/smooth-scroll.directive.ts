import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appSmoothScroll]',
})
export class SmoothScrollDirective {
  private currentScrollRequest: number;
  constructor(private view: ElementRef<HTMLElement>) {}

  private smoothScroll(start: number, scrollBy: number, duration: number = 200) {
    const elapsed = new Date().getTime() - start;
    if (elapsed >= duration) {
      return;
    }

    this.currentScrollRequest = window.requestAnimationFrame(() => {
      this.view.nativeElement.scrollBy({ top: scrollBy });
      this.smoothScroll(start, scrollBy, duration);
    });
  }

  public up() {
    const articleView = this.view.nativeElement;
    cancelAnimationFrame(this.currentScrollRequest);
    this.smoothScroll(new Date().getTime(), -5, 200);
  }

  public down() {
    const articleView = this.view.nativeElement;
    cancelAnimationFrame(this.currentScrollRequest);

    this.smoothScroll(new Date().getTime(), 5, 200);
  }
}
