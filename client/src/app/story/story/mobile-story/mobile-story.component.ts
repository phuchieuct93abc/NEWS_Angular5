import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ConfigState } from './../../../reducers/index';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { StoryComponent } from "../story.component";
import { BreakpointDetectorService } from "../../../shared/breakpoint.service";
import { ConfigService } from "../../../shared/config.service";
import { FavoriteService } from "../../../shared/favorite-story.service";
import { ActivatedRoute, Router } from "@angular/router";
import RequestAnimationFrame from "../../../requestAnimationFrame.cons";
import { StoryListService } from "../../story-list/story-list.service";

@Component({
    selector: 'app-mobile-story',
    templateUrl: './mobile-story.component.html',
    styleUrls: ['./mobile-story.component.scss']
})
export class MobileStoryComponent extends StoryComponent {

    @ViewChild("storyElement", { static: false })
    storyElement: ElementRef;
    public config$: Observable<ConfigState>;

    constructor(public breakpointService: BreakpointDetectorService,
        protected configService: ConfigService,
        protected favoriteService: FavoriteService,
        protected route: Router,
        protected activatedRoute: ActivatedRoute,
        protected storyListService: StoryListService,
        protected element: ElementRef,
        private store: Store<ConfigState>
    ) {
        super(breakpointService, configService, favoriteService, route, activatedRoute, storyListService, element)
    }
    ngOnInit() {
        super.ngOnInit();
        this.config$ = this.store.pipe<ConfigState>(select('config'));

    }

    onSelectStory() {
        super.onSelectStory();
        window.scrollTo({ top: this.element.nativeElement.offsetTop - 60, behavior: 'smooth' })


    }
    onOpenStory() {


    }
    close() {
        window.scrollTo({ top: this.element.nativeElement.offsetTop - 60, behavior: "auto" })

        this.story.selected = false;
    }




}
