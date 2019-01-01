import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
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
    isSmallDevice: boolean

    constructor(private router: Router, private configService: ConfigService, private articleService: ArticleService, private breakpointService: BreakpointDetectorService) {
    }

    ngOnInit(): void {
        this.config = this.configService.getConfig();
        this.router.navigate([`/${this.config.category}`]);
        this.configService.configUpdated.subscribe((config) => {
            this.config = config
        })
        this.articleService.onStorySelected.subscribe(article => this.image = this.getBlurImageUrl(article.story.images[0].imageUrl))

        setTimeout(()=>{

            this.isSmallDevice = this.breakpointService.isSmallScreen
        })
    }
    getBlurImageUrl(url){
        console.log( CONFIG.baseUrl + "blur?url="+url)
        return CONFIG.baseUrl + "blur?url="+url;
    }

}
