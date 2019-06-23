import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {StoryComponent} from "../story.component";
import {BreakpointDetectorService} from "../../../shared/breakpoint.service";
import {ConfigService} from "../../../shared/config.service";
import {FavoriteService} from "../../../shared/favorite-story.service";
import {ActivatedRoute, Router} from "@angular/router";
import RequestAnimationFrame from "../../../requestAnimationFrame.cons";
import {Story} from "../../../../../../model/Story";

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
                private zone: NgZone
    ) {
        super(breakpointService, configService, favoriteService, route, activatedRoute)
    }

    onOpenStory() {
        RequestAnimationFrame(() => this.story.height = 0)
        this.story.isTouch = true;

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();

        if (this.story.isTouch) {
            this.zone.runOutsideAngular(() => {
                let clientHeight = (<HTMLDivElement>this.storyElement.nativeElement).clientHeight;
                RequestAnimationFrame((function (clienHeight, story: Story) {
                    return () => {
                        story.height = clienHeight
                    }
                }).call(this, clientHeight, this.story))
            })
        }

    }


}
