import {Component, ElementRef, ViewChild} from '@angular/core';
import {StoryComponent} from "../story.component";
import {BreakpointDetectorService} from "../../../shared/breakpoint.service";
import {ConfigService} from "../../../shared/config.service";
import {FavoriteService} from "../../../shared/favorite-story.service";
import {ActivatedRoute, Router} from "@angular/router";
import RequestAnimationFrame from "../../../requestAnimationFrame.cons";
import {StoryListService} from "../../story-list/story-list.service";

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss']
})
export class MobileStoryComponent extends StoryComponent {

    @ViewChild("storyElement", {static: false})
    storyElement: ElementRef;


    constructor(public breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected favoriteService: FavoriteService,
                protected route: Router,
                protected activatedRoute: ActivatedRoute,
                protected storyListService: StoryListService
    ) {
        super(breakpointService, configService, favoriteService, route, activatedRoute, storyListService)
    }

    onOpenStory() {
        RequestAnimationFrame(() => {
            this.story.isTouch = true;
            this.story.height = 0
        });

    }

    ngOnDestroy(): void {
        if (this.story.isTouch) {
            let clientHeight = (<HTMLDivElement>this.storyElement.nativeElement).clientHeight;
            this.story.height = clientHeight
        }
        super.ngOnDestroy();


    }


}
