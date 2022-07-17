import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

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

  iframeHeight$: Observable<number>;
  private destroy = new Subject<void>();
  ngOnInit(): void {
    this.iframeHeight$ = fromEvent(window, 'message').pipe(
      take(1),
      map((event: unknown) => parseInt((event as IframeMessage).data?.height, 10)),
      takeUntil(this.destroy)
    );
  }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
