import { IS_NODE } from './../app/shared/const';
import { Directive, Output, OnInit, ElementRef, EventEmitter, AfterViewInit, NgZone, Inject } from '@angular/core';

@Directive({
  selector: '[appIsIntersect]',
})
export class IsIntersectDirective implements AfterViewInit {

  @Output()
  public appIsIntersect = new EventEmitter<boolean>();

  public constructor(private element: ElementRef, @Inject(IS_NODE) private isNode: boolean) { }

  public ngAfterViewInit(): void {
    if(this.isNode){
      return;
    }
    new IntersectionObserver(
      async (data) => this.appIsIntersect.emit(data[0].isIntersecting)
      , {
        threshold: 0.1,
        rootMargin: '200px',
      })
      .observe(this.element.nativeElement);
  }

};
