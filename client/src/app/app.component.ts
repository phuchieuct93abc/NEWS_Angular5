import { Component, Inject, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatSidenav } from '@angular/material/sidenav';
import CONFIG from '../environments/environment';
import { Config, ConfigService } from './shared/config.service';
import { ArticleService } from './shared/article.service';
import { BreakpointDetectorService } from './shared/breakpoint.service';
import { opacityNgIf } from './animation';
import { AppService } from './app.service';
import { LoadingEventType, LoadingService } from './shared/loading.service';
import vars from './variable';

@Component({
    selector: 'main',
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
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSidenav, { static: false })
    private sidebar: MatSidenav;

    private config: Config;
    public image: string;
    private isSmallDevice: boolean;
    private isOpenSidebar: boolean;
    public isShowProgressBar = false;
    public isRenderSidebar: boolean;

    public constructor(private router: Router,
        private configService: ConfigService,
        private articleService: ArticleService,
        private breakpointService: BreakpointDetectorService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        private appService: AppService,
        private loadingService: LoadingService,
    ) {

    }

    public ngOnInit(): void {


        this.config = this.configService.getConfig();
        this.configService.configUpdated.subscribe((data) => {
            this.config = data.new;
            this.updateBodyClass();
        });
        this.articleService.onStorySelected.subscribe((article) => {
            if (article.story != null) {
                this.getBlurImageUrl(article.story.images[0].imageUrl);
            } else if (article.images.length > 0) {
                this.getBlurImageUrl(article.images[0]);
            }
        });


        this.isSmallDevice = this.breakpointService.isSmallScreen;
        this.isOpenSidebar = !this.isSmallDevice && !CONFIG.isRunningInNode;
        this.isRenderSidebar = this.isOpenSidebar;
        this.track();
        this.updateBodyClass();

        this.appService.onToogleSidebar.subscribe(() => {
            this.sidebar.toggle();
        });

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

    public updateBodyClass() {
        const className = this.config.darkTheme ? 'unicorn-dark-theme' : 'unicorn-light-theme';
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
