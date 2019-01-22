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
    protected story: Story;
    @Input()
    protected scrollContainer: ElementRef;
    @Output()
    protected onSelectedStory = new EventEmitter<Story>();
    protected scrollTarget: any;

    protected selected: boolean = false;
    protected isSmallScreen: boolean;

    protected config: Config;
    protected configListener: Subscription;
    protected friendlyUrl: string;


    constructor(public breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected favoriteService: FavoriteService
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
