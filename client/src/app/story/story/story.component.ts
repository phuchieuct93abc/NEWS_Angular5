import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,} from '@angular/core';
import {Story} from "../../../../../model/Story";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {Config, ConfigService} from "../../shared/config.service";
import {Subscription} from "rxjs";
import * as url from 'speakingurl';
import {FavoriteService} from "../../shared/favorite-story.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Category} from "../../../../../model/Categories";

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit, OnDestroy {

    @Input()
    public story: Story;
    @Input()
    public scrollContainer: ElementRef;
    @Output()
    public onSelectedStory = new EventEmitter<number>();
    @Output()
    public onDestroyedStory = new EventEmitter<number>();
    public scrollTarget: any;

    public selected: boolean = false;
    public isSmallScreen: boolean;

    public config: Config;
    public configListener: Subscription;
    public friendlyUrl: string;
    @Input()
    public index: number;
    @Input()
    category: Category;


    constructor(public breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected favoriteService: FavoriteService,
                protected route: Router,
                protected activatedRoute: ActivatedRoute
    ) {
    }

    onSelectStory() {

        let navigate: Promise<any>;
        if (this.category) {
            navigate = this.route.navigate(["/", this.category.name, this.friendlyUrl, this.story.id])
        } else {
            navigate = this.route.navigate([this.friendlyUrl, this.story.id], {relativeTo: this.activatedRoute})
        }

        navigate.then(() => {

            this.story.selected = true;
            this.story.isRead = true;
            this.onSelectedStory.emit(this.index);
        })
    }

    ngOnInit(): void {
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.scrollTarget = this.scrollContainer;
        this.getConfig();

        this.friendlyUrl = url(this.story.title);
        this.story.isFavorite = this.favoriteService.findById(this.story.id) != null;

        if (this.story.isAutoOpen) {
            this.onSelectStory();
            this.route.navigate([this.friendlyUrl, this.story.id], {relativeTo: this.activatedRoute})
            this.story.isAutoOpen = false;
        }

    }

    private getConfig() {
        this.config = this.configService.getConfig();
        this.configListener = this.configService.configUpdated.subscribe(config => {
            this.config = config.new;
        })
    }

    close() {
        this.story.selected = false;
        this.onSelectedStory.emit(this.index);

    }

    ngOnDestroy(): void {
        this.configListener.unsubscribe();
        this.selected && console.log("destroey", this.index)
        this.selected && this.onDestroyedStory.emit(this.index);
    }


}
