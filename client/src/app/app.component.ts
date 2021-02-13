import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, Inject, OnInit, Renderer2, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatSidenav } from '@angular/material/sidenav';
import CONFIG from '../environments/environment';
import { IS_MOBILE } from 'src/app/shared/const';
import { ConfigService } from './shared/config.service';
import { ArticleService } from './shared/article.service';
import { AppService } from './app.service';
import { LoadingEventType, LoadingService } from './shared/loading.service';
import vars from './variable';

@Component({
    selector: 'app-news',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [

        trigger('opacityNgIf', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('1s 0.5s', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('1s', style({ opacity: 0 })),
            ]),
        ]),
        trigger('opacityNgIfNoDelay', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('0.5s', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('0.5s', style({ opacity: 0 })),
            ]),
        ]),
    ],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatSidenav)
    private sidebar: MatSidenav;

    public isShowProgressBar = false;
    public isRenderSidebar: boolean;
    public image: string;

    public isSmallDevice: boolean;
    public isOpenSidebar: boolean;
    private onDestroy$ = new Subject<void>();

    public constructor(private router: Router,
        private configService: ConfigService,
        private articleService: ArticleService,
        @Inject(IS_MOBILE) private isMobile: boolean,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        private appService: AppService,
        private loadingService: LoadingService,
    ) {

    }
    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    public ngOnInit(): void {


        this.configService.getConfig().pipe(takeUntil(this.onDestroy$)).subscribe(({ darkTheme }) => {
            this.updateBodyClass(darkTheme);
        });

        this.articleService.onStorySelected.subscribe((article) => {
            if (article.story != null) {
                this.getBlurImageUrl(article.story.getThumbnail());
            } else if (article.images.length > 0) {
                this.getBlurImageUrl(article.getThumbnail());
            }
        });


        this.isSmallDevice = this.isMobile;
        this.isOpenSidebar = !this.isSmallDevice && !CONFIG.isRunningInNode;
        this.isRenderSidebar = this.isOpenSidebar;
        this.track();

        this.appService.onToogleSidebar.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.sidebar.toggle());

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

    public ngAfterViewInit(): void {
        this.loadingService.onLoading.subscribe((data) => {
            setTimeout(() => {
                this.isShowProgressBar = data.type === LoadingEventType.START;
            });
        });

    }


    public getBlurImageUrl(url) {
        if (typeof window !== 'undefined' && !this.isSmallDevice && url !== undefined) {
            this.image = `${CONFIG.baseUrl}blur?url=${url}`;
        }
    }

    public updateBodyClass(darkTheme: boolean) {
        const className = darkTheme ? 'unicorn-dark-theme' : 'unicorn-light-theme';
        this.renderer.removeClass(this.document.body, 'unicorn-dark-theme');
        this.renderer.removeClass(this.document.body, 'unicorn-light-theme');
        this.renderer.addClass(this.document.body, className);
        if (this.isSmallDevice) {
            this.renderer.addClass(this.document.body, 'small-device');
        }
    }


    private track(): void {
        this.router.events.subscribe((event) => {
            if (typeof window !== 'undefined') {
                if (event instanceof NavigationEnd) {
                    (window as any).ga('set', 'page', event.urlAfterRedirects);
                    (window as any).ga('send', 'pageview');
                }
            }
        });
    }

}
