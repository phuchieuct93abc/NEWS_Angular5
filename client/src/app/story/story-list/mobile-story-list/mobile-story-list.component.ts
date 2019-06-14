import {Component, ViewEncapsulation} from '@angular/core';
import {StoryService} from "../../../shared/story.service";
import {ActivatedRoute, Router} from "@angular/router";
import {StoryListService} from "../story-list.service";
import {BreakpointDetectorService} from "../../../shared/breakpoint.service";
import {ConfigService} from "../../../shared/config.service";
import {LoadingService} from "../../../shared/loading.service";
import {ArticleService} from "../../../shared/article.service";
import {StoryListComponent} from "../story-list.component";
import {Story} from "../../../../../../model/Story";
import {StorySizechangeDetectorService} from "../../story/mobile-story/story-sizechange-detector.service";

@Component({
    selector: 'app-mobile-story-list',
    templateUrl: './mobile-story-list.component.html',
    styleUrls: ['./mobile-story-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MobileStoryListComponent extends StoryListComponent {

    constructor(protected storyService: StoryService,
                protected activatedRoute: ActivatedRoute,
                protected route: ActivatedRoute,
                protected router: Router,
                protected storyListService: StoryListService,
                protected breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected loadingService: LoadingService,
                protected articleService: ArticleService,
                private changeDetector: StorySizechangeDetectorService
    ) {
        super(storyService, activatedRoute, route, router, storyListService, breakpointService, configService, loadingService, articleService)
    }

    async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.changeDetector.sizeDetector.subscribe(story => {
            setTimeout(() => {
                this.virtualScroller.invalidateCachedMeasurementForItem(story);
            }, 100)
        })
    }

}
