import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,} from '@angular/core';
import {Story} from "../../../../../model/Story";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {Config, ConfigService} from "../../shared/config.service";
import {Subscription} from "rxjs";
import * as url from 'speakingurl';
import {FavoriteService} from "../../shared/favorite-story.service";

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit, OnDestroy {

    @Input()
    story: Story;
    @Input()
    scrollContainer: ElementRef;
    @Output()
    onSelectedStory = new EventEmitter<Story>();
    scrollTarget: any;

    selected: boolean = false;
    isSmallScreen: boolean;

    config: Config;
    configListener: Subscription;
    friendlyUrl: string;


    constructor(public breakpointService: BreakpointDetectorService,
                private configService: ConfigService,
                private favoriteService: FavoriteService
    ) {
    }

    onSelectStory() {

        this.selected = true;
        this.story.isRead = true;
    }

    ngOnInit(): void {
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.scrollTarget = this.scrollContainer;
        this.getConfig();
        this.friendlyUrl = url(this.story.title);
        this.story.isFavorite = this.favoriteService.findById(this.story.id) != null;

    }

    private getConfig() {
        this.config = this.configService.getConfig();
        this.configListener = this.configService.configUpdated.subscribe(config => {
            this.config = config.new;
        })
    }

    ngOnDestroy(): void {
        this.configListener.unsubscribe();
    }


}
