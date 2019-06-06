import {Component, ViewEncapsulation} from '@angular/core';
import {StoryService} from "../../../shared/story.service";
import {ActivatedRoute, Router} from "@angular/router";
import {StoryListService} from "../story-list.service";
import {BreakpointDetectorService} from "../../../shared/breakpoint.service";
import {ConfigService} from "../../../shared/config.service";
import {LoadingService} from "../../../shared/loading.service";
import {ArticleService} from "../../../shared/article.service";
import {StoryListComponent} from "../story-list.component";

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
                protected articleService: ArticleService
    ) {
        super(storyService, activatedRoute, route, router, storyListService, breakpointService, configService, loadingService, articleService)
    }

    updateStory(storyIndex: number) {

        this.virtualScroller.invalidateCachedMeasurementAtIndex(storyIndex);


    }


}
