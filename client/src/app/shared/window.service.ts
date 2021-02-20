import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { throttle } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WindowService implements OnInit {
  dispatchScroll$ = new Subject<void>();

constructor() { }
  ngOnInit(): void {

    this.dispatchScroll$.pipe(throttle(() => interval(1000))).subscribe(()=>{

    });
  }

}
