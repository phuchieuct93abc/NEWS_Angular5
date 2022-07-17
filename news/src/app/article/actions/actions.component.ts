import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { asyncScheduler, Observable } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import { configFeature, updateConfigAction } from 'src/app/store/config.reducer';
import CONFIG from 'src/environments/environment';
import Article from '../../../../../model/Article';
import { IS_NODE } from './../../shared/const';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        style({ transform: 'translateY(50%)', opacity: 0 }),
        animate('200ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('200ms', style({ transform: 'translateY(50%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class ActionsComponent implements OnDestroy, OnChanges, AfterViewInit {
  // @Input()
  // article: Article;
  @Output()
  public onClosed = new EventEmitter<void>();
  @ViewChild('actionsElement')
  public actionsElement: ElementRef;

  public isFixedTop = false;
  public isFixedTop$: Observable<boolean>;
  public ttsAudioSource: { title: string; link: string; artist: string; duration: number }[] = [];
  public showIframe$ = this.store.select(configFeature.selectViewInSource);
  private observerWindow: IntersectionObserver;
  private isDisplayingAction = false;
  private isDisplayingArticle = true;

  private readonly intersectionConfig = {
    rootMargin: '-80px 0px 0px 0px',
    threshold: [0],
  };
  constructor(@Inject(IS_MOBILE) private isMobile: boolean, @Inject(IS_NODE) private isNode: boolean, private store: Store) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.article.currentValue != null) {
      const { id, category } = changes.article.currentValue as Article;
      this.ttsAudioSource = [
        {
          title: 'Audio One Title',
          link: `${CONFIG.baseUrl}tts?id=${id}&category=${category}`,
          artist: 'Artist',
          duration: 10,
        },
      ];
    }
  }

  ngAfterViewInit(): void {
    this.registerStickyActions();
  }

  checkPosition(): void {
    this.isFixedTop = !this.isDisplayingAction && this.isDisplayingArticle;
  }

  close(event: MouseEvent): void {
    event?.stopPropagation();
    this.onClosed.emit();
  }
  changeShowIframe(showIframe: boolean): void {
    this.store.dispatch(updateConfigAction({ viewInSource: showIframe }));
  }

  ngOnDestroy(): void {
    this.observerWindow?.disconnect();
  }

  private registerStickyActions() {
    if (!this.isMobile || this.isNode) {
      return;
    }
    this.isFixedTop$ = new Observable<boolean>((observer) => {
      this.observerWindow = new IntersectionObserver((data: IntersectionObserverEntry[]) => {
        if (data[0].target === this.actionsElement.nativeElement) {
          observer.next(!data[0].isIntersecting);
        }
      }, this.intersectionConfig);
      this.observerWindow.observe(this.actionsElement.nativeElement);
    }).pipe(throttleTime(200, asyncScheduler, { leading: true, trailing: true }));
  }
}
