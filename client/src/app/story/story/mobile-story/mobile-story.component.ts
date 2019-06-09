import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {StoryComponent} from "../story.component";
import {BreakpointDetectorService} from "../../../shared/breakpoint.service";
import {ConfigService} from "../../../shared/config.service";
import {FavoriteService} from "../../../shared/favorite-story.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Story} from "../../../../../../model/Story";

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss']
})
export class MobileStoryComponent extends StoryComponent implements OnInit {

    @ViewChild("storyElement")
    storyElement: ElementRef;

    @Output()
    invalidCache = new EventEmitter<Story>();
    //
    // minHeight: number;
    //
    // private observerChange = new Subject<HTMLElement>();

    constructor(public breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected favoriteService: FavoriteService,
                protected route: Router,
                protected activatedRoute: ActivatedRoute,
    ) {
        super(breakpointService, configService, favoriteService, route, activatedRoute)
    }

    onOpenStory() {
        requestAnimationFrame(() => setTimeout(() => {
                this.story.height = 0
            }, 1200)
        )
    }


    ngOnDestroy(): void {
        this.story.height = (<HTMLDivElement>this.storyElement.nativeElement).clientHeight;
        let normalSize = this.config.smallImage ? 127 : 309;
        if (this.story.height !== normalSize) {

            requestAnimationFrame(() => {
                this.invalidCache.emit(this.story);
            })
        }
        super.ngOnDestroy();
    }


}
