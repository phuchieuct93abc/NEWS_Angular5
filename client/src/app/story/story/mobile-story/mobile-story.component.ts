import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {StoryComponent} from "../story.component";
import {BreakpointDetectorService} from "../../../shared/breakpoint.service";
import {ConfigService} from "../../../shared/config.service";
import {FavoriteService} from "../../../shared/favorite-story.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss']
})
export class MobileStoryComponent extends StoryComponent implements AfterViewInit {

    @ViewChild("storyElement")
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
        // this.updateheight(100)
    }

    private updateheight(time) {
        setTimeout(() => {
            this.story.height = (<HTMLDivElement>this.storyElement.nativeElement).clientHeight;
        }, time)
    }

    close() {
        super.close();
        // this.updateheight(0);
    }

    ngOnDestroy(): void {
        this.story.height = (<HTMLDivElement>this.storyElement.nativeElement).clientHeight;

        super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.story.height = null;

        },2000)
    }

}
