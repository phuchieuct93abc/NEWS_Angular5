import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Config, ConfigService} from "./shared/config.service";
import {ArticleService} from "./shared/article.service";
import {BreakpointDetectorService} from "./shared/breakpoint.service";
import CONFIG from "../environments/environment";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    name = 'Angular';
    config: Config;
    image: string;
    isSmallDevice: boolean;

    constructor(private router: Router,
                private configService: ConfigService,
                private articleService: ArticleService,
                private breakpointService: BreakpointDetectorService,
                private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.config = this.configService.getConfig();
        this.redirectToLastCategory();
        this.configService.configUpdated.subscribe(data => {
            this.config = data.new
        });
        this.articleService.onStorySelected.subscribe(article => {
            if (article.story != null) {
                this.getBlurImageUrl(article.story.images[0].imageUrl)
            }
        });


        this.isSmallDevice = this.breakpointService.isSmallScreen;

        this.track();

    }

    private track(): void {
        this.router.events.subscribe(event => {

            if (event instanceof NavigationEnd) {
                (<any>window).ga('set', 'page', event.urlAfterRedirects);
                (<any>window).ga('send', 'pageview');
            }
        })
    }

    getBlurImageUrl(url) {
        let img = new Image();
        const blurUrl = CONFIG.baseUrl + "blur?url=" + url;
        img.src = blurUrl;
        img.onload = () => {
            this.image = blurUrl;

        }
    }

    redirectToLastCategory() {
        if (this.route.firstChild == null) {

            this.router.navigate([this.config.category || 'tin-nong']);
        }
    }

}
