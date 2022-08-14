import { animate, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import environment from '../environments/environment';
import { AppService } from './app.service';
import { ArticleService } from './shared/article.service';
import { CheckForUpdateService } from './shared/checkForUpdate.service';
import { IS_NODE } from './shared/const';
import { LoadingEventType, LoadingService } from './shared/loading.service';
import { configFeature } from './store/config.reducer';
import vars from './variable';

@Component({
  selector: 'app-news',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('opacityNgIf', [
      transition(':enter', [style({ opacity: 0 }), animate('1s 0.5s', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('1s', style({ opacity: 0 }))]),
    ]),
    trigger('opacityNgIfNoDelay', [
      transition(':enter', [style({ opacity: 0 }), animate('0.5s', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('0.5s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSidenav)
  private sidebar: MatSidenav;

  public isShowProgressBar$: Observable<boolean>;

  public isSmallDevice: boolean;
  public isOpenSidebar: boolean;
  public thumbnail$: Observable<string>;
  onDestroy$ = new Subject<void>();

  private configStore$ = this.store.select(configFeature.selectDarkTheme);
  public constructor(
    private router: Router,
    private articleService: ArticleService,
    @Inject(IS_MOBILE) private isMobile: boolean,
    @Inject(IS_NODE) public isNode: boolean,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private appService: AppService,
    private loadingService: LoadingService,
    private checkForUpdateService: CheckForUpdateService,
    private httpClient: HttpClient,
    private gtmService: GoogleTagManagerService,
    private store: Store
  ) {}

  ngAfterViewInit(): void {
    this.configStore$.pipe(takeUntil(this.onDestroy$)).subscribe((darkTheme) => this.updateBodyClass(darkTheme));
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public ngOnInit(): void {
    this.checkForUpdateService.checkUpdate();

    this.isSmallDevice = this.isMobile;
    this.isOpenSidebar = !this.isSmallDevice;

    this.appService.onToogleSidebar.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.sidebar.toggle());
    this.track();

    if (!this.isNode && !this.isSmallDevice) {
      this.thumbnail$ = this.articleService.onStorySelected.pipe(
        filter((article) => article != null),
        switchMap((article) => this.getBlurImageUrl(article.getThumbnail())),
        shareReplay()
      );
    }
    this.isShowProgressBar$ = this.loadingService.onLoading.pipe(
      map((data) => data.type === LoadingEventType.START),
      debounceTime(100)
    );

    this.loadGoogleAnalytics();
  }
  loadGoogleAnalytics(): void {
    if (this.isNode) {
      return;
    }
  }
  public swipeRight(ev) {
    if (this.isSmallDevice) {
      if (this.sidebar.opened) {
        return;
      }
      if (ev.center.x - ev.deltaX < vars.sideNavThreshold) {
        this.sidebar.open();
        ev.srcEvent.preventDefault();
      }
    }
  }

  public getBlurImageUrl(url: string): Observable<string> {
    if (url !== undefined) {
      return this.httpClient.get(`${environment.asiaUrl}blur?url=${url}`, { responseType: 'blob' }).pipe(map((blob) => URL.createObjectURL(blob)));
    }
    return of();
  }

  public updateBodyClass(darkTheme: boolean) {
    const className = darkTheme ? 'unicorn-dark-theme' : 'unicorn-light-theme';
    this.renderer.removeClass(this.document.body, 'unicorn-dark-theme');
    this.renderer.removeClass(this.document.body, 'unicorn-light-theme');
    this.renderer.removeClass(this.document.body, 'mobile-device');
    this.renderer.removeClass(this.document.body, 'desktop-device');
    this.renderer.addClass(this.document.body, className);
    if (this.isSmallDevice) {
      this.renderer.addClass(this.document.body, 'mobile-device');
    } else {
      this.renderer.addClass(this.document.body, 'desktop-device');
    }
  }

  private track(): void {
    if (this.isNode) {
      return;
    }
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => event as NavigationEnd)
      )
      .subscribe((event) => {
        const gtmTag = {
          event: 'page',
          pageName: event.url,
        };
        this.gtmService.pushTag(gtmTag);
      });
  }
}
