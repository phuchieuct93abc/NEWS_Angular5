import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
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

    @Output()
    invalidCache = new EventEmitter();

    constructor(public breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected favoriteService: FavoriteService,
                protected route: Router,
                protected activatedRoute: ActivatedRoute
    ) {
        super(breakpointService, configService, favoriteService, route, activatedRoute)
    }

    onOpenStory() {
        setTimeout(() => {
            this.story.height = 0;
        }, 5000)
    }


    ngOnDestroy(): void {
        this.story.height = (<HTMLDivElement>this.storyElement.nativeElement).clientHeight;
        this.invalidCache.emit(this.story);
        super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        // setTimeout(() => {
        //     this.story.height = 0;
        //
        // }, 2000);
    }

}
