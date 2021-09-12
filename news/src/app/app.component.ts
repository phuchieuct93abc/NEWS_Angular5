import { filter, map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Component, Inject, OnInit, Renderer2, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatSidenav } from '@angular/material/sidenav';
import { IS_MOBILE } from 'src/app/shared/const';
import CONFIG from '../environments/environment';
import { IS_NODE } from './shared/const';
import { ConfigService } from './shared/config.service';
import { ArticleService } from './shared/article.service';
import { AppService } from './app.service';
import { LoadingEventType, LoadingService } from './shared/loading.service';
import vars from './variable';
import { CheckForUpdateService } from './shared/checkForUpdate.service';

@Component({
    selector: 'app-news',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [

        trigger('opacityNgIf', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('1s 0.5s', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('1s', style({ opacity: 0 }))
            ])
        ]),
        trigger('opacityNgIfNoDelay', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('0.5s', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('0.5s', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatSidenav)
    private sidebar: MatSidenav;

    public isShowProgressBar$: Observable<boolean>;

    public isSmallDevice: boolean;
    public isOpenSidebar: boolean;
    public thumbnail$: Observable<string>;
    private onDestroy$ = new Subject<void>();

    public constructor(private router: Router,
        private configService: ConfigService,
        private articleService: ArticleService,
        @Inject(IS_MOBILE) private isMobile: boolean,
        @Inject(IS_NODE) public isNode: boolean,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        private appService: AppService,
        private loadingService: LoadingService,
        private checkForUpdateService: CheckForUpdateService
    ) {
    }
    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    public ngOnInit(): void {
        this.checkForUpdateService.checkUpdate();


        this.configService.getConfig().pipe(takeUntil(this.onDestroy$)).subscribe(({ darkTheme }) => {
            this.updateBodyClass(darkTheme);
        });


        this.isSmallDevice = this.isMobile;
        this.isOpenSidebar = !this.isSmallDevice ;

        this.appService.onToogleSidebar.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.sidebar.toggle());
        this.track();

        if(!this.isNode && !this.isSmallDevice ){
            this.thumbnail$ = this.articleService.onStorySelected.pipe(filter(article => article !=null),map(article => this.getBlurImageUrl(article.getThumbnail())));
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

    public ngAfterViewInit(): void {
        this.isShowProgressBar$ = this.loadingService.onLoading.pipe(map(data=>data.type === LoadingEventType.START));

    }


    public getBlurImageUrl(url: string): string {
        if (url !== undefined) {
            return `${CONFIG.asiaUrl}blur?url=${url}`;
        }
        return '';
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
        }else{
            this.renderer.addClass(this.document.body, 'desktop-device');

        }
    }


    private track(): void {
        if(this.isNode){
            return;
        }
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
