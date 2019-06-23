import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {StoryComponent} from "../story.component";
import {BreakpointDetectorService} from "../../../shared/breakpoint.service";
import {ConfigService} from "../../../shared/config.service";
import {FavoriteService} from "../../../shared/favorite-story.service";
import {ActivatedRoute, Router} from "@angular/router";
import RequestAnimationFrame from "../../../requestAnimationFrame.cons";

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss']
})
export class MobileStoryComponent extends StoryComponent  {

    @ViewChild("storyElement", {static: false})
    storyElement: ElementRef;



    constructor(public breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected favoriteService: FavoriteService,
                protected route: Router,
                protected activatedRoute: ActivatedRoute
    ) {
        super(breakpointService, configService, favoriteService, route, activatedRoute)
    }

    onOpenStory() {
        RequestAnimationFrame(() => this.story.height = 0)

    }

    ngOnDestroy(): void {
        this.story.height = (<HTMLDivElement>this.storyElement.nativeElement).clientHeight;
        super.ngOnDestroy();
    }




}
