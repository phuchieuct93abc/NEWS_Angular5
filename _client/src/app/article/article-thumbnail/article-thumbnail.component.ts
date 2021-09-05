import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import Article from '../../../../../model/Article';
import { IS_NODE } from '../../shared/const';

@Component({
  selector: 'app-article-thumbnail',
  templateUrl: './article-thumbnail.component.html',
  styleUrls: ['./article-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sticky', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms', style({
          opacity: 0,
          transform: 'translateY(-100px)'
        }))
      ])
    ])
  ]
})
export class ArticleThumbnailComponent implements OnInit {

  @Input()
  public thumbnailPath: string;
  @Input()
  public article: Article;
  @Input()
  public rootArticle: HTMLElement;
  @ViewChild('articleHeader')
  protected articleHeader: ElementRef;

  public isStickHeader$;

  private readonly thresholds = [0, 1];


  public constructor(private element: ElementRef<HTMLElement>, @Inject(IS_NODE) private isNode: boolean) { }

  public ngOnInit(): void {
    if (!this.isNode) {
       this.isStickHeader$ = this.registerStickyHeader().pipe(startWith(false));
    }
  }

  protected registerStickyHeader(): Observable<boolean> {

    return new Observable(resolver => {
      const options = {
        threshold: this.thresholds,
        root: this.rootArticle
      };
      setTimeout(() => {
        const observer = new IntersectionObserver(([entry]) => {
          resolver.next(!entry.isIntersecting && entry.intersectionRatio === 0);
        }, options);

        observer.observe(this.articleHeader.nativeElement);

      }, 500);
    });
  }

}
