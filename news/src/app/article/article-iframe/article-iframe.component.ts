import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-article-iframe',
  templateUrl: './article-iframe.component.html',
  styleUrls: ['./article-iframe.component.scss'],
})
export class ArticleIframeComponent {
  @Input()
  url: string;
  @ViewChild('iframe')
  iframe: ElementRef<HTMLIFrameElement>;

}
