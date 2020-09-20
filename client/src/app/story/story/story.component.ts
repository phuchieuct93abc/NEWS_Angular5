import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ConfigState } from './../../reducers/index';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, } from '@angular/core';
import { Story } from "../../../../../model/Story";
import { BreakpointDetectorService } from "../../shared/breakpoint.service";
import { ConfigService } from "../../shared/config.service";
import * as url from 'speakingurl';
import { FavoriteService } from "../../shared/favorite-story.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "../../../../../model/Categories";
import { StoryListService } from "../story-list/story-list.service";

@Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {

    @Input()
    public story: Story;
    @Input()
    public scrollContainer: ElementRef;
    @ViewChild("ell", { static: false })
    ell: any;
    @Output()
    public onSelectedStory = new EventEmitter<number>();

    public scrollTarget: any;

    public selected: boolean = false;

    public friendlyUrl: string;
    @Input()
    public index: number;
    @Input()
    category: Category;

    @Input()
    scrollElement: Element;

    constructor(public breakpointService: BreakpointDetectorService,
        protected configService: ConfigService,
        protected favoriteService: FavoriteService,
        protected route: Router,
        protected activatedRoute: ActivatedRoute,
        protected storyListService: StoryListService,
        protected element: ElementRef   ) {
    }

    public onSelectStory() {
        this.storyListService.currentSelectedStory = this.story;
        let navigate: Promise<any>;
        if (this.category) {
            navigate = this.route.navigate(["/", this.category.name, this.friendlyUrl, this.story.id])
        } else {
            navigate = this.route.navigate([this.friendlyUrl, this.story.id], { relativeTo: this.activatedRoute })
        }

        navigate.then(() => {
            this.story.selected = true;
            this.story.isRead = true;
            this.onSelectedStory.emit(this.index);
        })
    }

    ngOnInit(): void {
        this.scrollTarget = this.scrollContainer;

        this.friendlyUrl = url(this.story.title);
        this.story.isFavorite = this.favoriteService.findById(this.story.id) != null;

        this.handleAutoOpenStory();



    }

    private handleAutoOpenStory() {
        if (this.story.isAutoOpen) {
            this.onSelectStory();
            this.route.navigate([this.friendlyUrl, this.story.id], { relativeTo: this.activatedRoute });
            this.story.isAutoOpen = false;
        }
    }

    getElement():HTMLElement{
        return this.element.nativeElement
    }



}
