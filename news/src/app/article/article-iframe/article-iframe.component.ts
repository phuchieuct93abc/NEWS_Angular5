import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';

interface IframeMessage {
  data: {
    height: string;
  };
}
@Component({
  selector: 'app-article-iframe',
  templateUrl: './article-iframe.component.html',
  styleUrls: ['./article-iframe.component.scss'],
})
export class ArticleIframeComponent implements OnInit, OnDestroy {
  @Input()
  url: string;
  @ViewChild('iframe')
  iframe: ElementRef<HTMLIFrameElement>;
  public loaded = false;

  iframeHeight$: Observable<number>;
  private destroy = new Subject<void>();
  ngOnInit(): void {
    console.log('load iframe');
    this.iframeHeight$ = fromEvent(window, 'message').pipe(
      take(1),
      map((event: unknown) => parseInt((event as IframeMessage).data?.height, 10)),
      tap(() => (this.loaded = true)),
      takeUntil(this.destroy)
    );
  }
  onError($event) {
    console.log($event);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
