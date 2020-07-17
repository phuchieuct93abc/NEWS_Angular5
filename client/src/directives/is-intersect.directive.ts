import { Directive, Output, OnInit, ElementRef, EventEmitter, AfterViewInit, NgZone } from '@angular/core';

@Directive({
  selector: '[appIsIntersect]'
})
export class IsIntersectDirective implements AfterViewInit {

  @Output()
  appIsIntersect = new EventEmitter<boolean>()

  constructor(private element: ElementRef, private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    new IntersectionObserver(
      async (data) => this.appIsIntersect.emit(data[0].isIntersecting)
      , {
        threshold: 0.1,
        rootMargin: '200px'
      })
      .observe(this.element.nativeElement)
  }

};
