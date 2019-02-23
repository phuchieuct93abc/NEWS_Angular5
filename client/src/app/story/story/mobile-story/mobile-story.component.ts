import {Component, OnDestroy} from '@angular/core';
import {StoryComponent} from "../story.component";
import {BreakpointDetectorService} from "../../../shared/breakpoint.service";
import {ConfigService} from "../../../shared/config.service";
import {FavoriteService} from "../../../shared/favorite-story.service";

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss']
})
export class MobileStoryComponent extends StoryComponent{

    constructor(public breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected favoriteService: FavoriteService
    ) {
        super(breakpointService, configService, favoriteService)
    }
m
}
