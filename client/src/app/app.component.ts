import { Component, Inject, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Config, ConfigService } from "./shared/config.service";
import { ArticleService } from "./shared/article.service";
import { BreakpointDetectorService } from "./shared/breakpoint.service";
import CONFIG from "../environments/environment";
import { DOCUMENT } from "@angular/common";
import { opacityNgIf } from "./animation";
import { animate, style, transition, trigger } from "@angular/animations";
import { AppService } from "./app.service";
import { MatSidenav } from "@angular/material/sidenav";
import { LoadingEventType, LoadingService } from "./shared/loading.service";
import vars from './variable';
import { select, Store } from '@ngrx/store';
import { ConfigState } from './reducers';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [

        trigger("opacityNgIf", [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('1s 0.5s', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('1s', style({ opacity: 0 }))
            ])
        ]),
        trigger("opacityNgIfNoDelay", [
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
export class AppComponent implements OnInit {
    config: Config;
    image: string;
    isSmallDevice: boolean;
    isOpenSidebar: boolean;
    isShowProgressBar = false;
    isRenderSidebar: boolean;



    @ViewChild(MatSidenav, { static: false })
    sidebar: MatSidenav;

    constructor(private router: Router,
        private configService: ConfigService,
        private articleService: ArticleService,
        private breakpointService: BreakpointDetectorService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        private appService: AppService,
        private loadingService: LoadingService,
        private store:Store<ConfigState>
    ) {

    }

    ngOnInit(): void {        
  
        this.store.pipe(select('config')).subscribe(data => {
            this.updateBodyClass(data.darkmode);
        });
        this.articleService.onStorySelected.subscribe(article => {
            if (article.story != null) {
                this.getBlurImageUrl(article.story.images[0].imageUrl)
            } else if (article.images.length > 0) {
                this.getBlurImageUrl(article.images[0])
            }
        });


        this.isSmallDevice = this.breakpointService.isSmallScreen;
        this.isOpenSidebar = !this.isSmallDevice && !CONFIG.isRunningInNode;
        this.isRenderSidebar = this.isOpenSidebar;
        this.track();
        // this.updateBodyClass();

        this.appService.onToogleSidebar.subscribe(() => {
            this.sidebar.toggle()
        });

    }
    swipeRight(ev) {
        if (this.isSmallDevice) {
            if (this.sidebar.opened) return
            if (ev.center.x - ev.deltaX < vars.sideNavThreshold) {
                this.sidebar.open();
                ev.srcEvent.preventDefault();
            }
        }
    }

    ngAfterViewInit(): void {
        this.loadingService.onLoading.subscribe(data => {
            setTimeout(() => {
                this.isShowProgressBar = data.type == LoadingEventType.START;
            });
        })

    }

    private track(): void {
        this.router.events.subscribe(event => {
            if (typeof window !== 'undefined') {
                if (event instanceof NavigationEnd) {
                    (<any>window).ga('set', 'page', event.urlAfterRedirects);
                    (<any>window).ga('send', 'pageview');
                }
            }
        })
    }

    getBlurImageUrl(url) {
        if (typeof window !== 'undefined' && !this.isSmallDevice && url != undefined) {
            this.image = `${CONFIG.baseUrl}blur?url=${url}`;
        }
    }

    updateBodyClass(darkmode:boolean) {
        let className = darkmode ? 'unicorn-dark-theme' : 'unicorn-light-theme';
        this.renderer.removeClass(this.document.body, 'unicorn-dark-theme');
        this.renderer.removeClass(this.document.body, 'unicorn-light-theme');
        this.renderer.addClass(this.document.body, className);
        if (this.isSmallDevice) {
            this.renderer.addClass(this.document.body, 'small-device')
        }
    }

}
