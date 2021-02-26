import { Directive, OnInit, Output, HostListener, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { throttle, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appNavigationKeyboard]'
})
export class NavigationKeyboardDirective implements OnInit, OnDestroy {
  @Output()
  up = new EventEmitter<void>();
  @Output()
  down = new EventEmitter<void>();
  @Output()
  right = new EventEmitter<void>();
  @Output()
  left = new EventEmitter<void>();

  onKeyDown$ = new Subject<KeyboardEvent>();
  onDestroy$ = new Subject<void>();

  constructor() { }


  ngOnInit(): void {
    this.onKeyDown$.pipe(throttle(() => interval(100)),takeUntil(this.onDestroy$)).subscribe((event) => {
      switch (event.key) {
        case 'ArrowDown':
        case 's':
          return this.down.emit();
        case 'ArrowUp':
        case 'w':
          return this.up.emit();
        default:
          break;
      }
    });

    this.onKeyDown$.pipe(throttle(() => interval(1000)),takeUntil(this.onDestroy$)).subscribe((event) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
          return this.left.emit();

        case 'ArrowRight':
        case 'd':
          return this.right.emit();
        default:
          break;
      }


    });

  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
    this.onKeyDown$.next(event);


  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
