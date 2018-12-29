import {Component, OnInit} from '@angular/core';
import {Categories} from "../../../../model/Categories";
import {MediaMatcher} from "@angular/cdk/layout";
import {SidebarService} from "../main/sidebar.service";
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {ConfigService} from "../shared/config.service";
import {StoryListService} from "../story/story-list/story-list.service";
import {IPageInfo} from "ngx-virtual-scroller";
import {interval, Subject} from "rxjs";
import {debounce} from "rxjs/operators";
import {StoryService} from "../shared/story.service";

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.scss'],
})
export class NavigatorComponent implements OnInit {
    categories: any;

    isHidding = false;
    isShowing = false;

    hiddingScrollEvent: IPageInfo;
    showingScrollEvent: IPageInfo;
    maxHeight = 56;

    height = this.maxHeight;
    heightScale = 5;
    currentToolbarHeight = this.height;

    private keyupSubject = new Subject<string>();

    constructor(private storyListService: StoryListService,
                private media: MediaMatcher,
                private sidebarService: SidebarService,
                public breakpointService: BreakpointDetectorService,
                public configService: ConfigService,
                private storyService: StoryService) {

    }

    ngOnInit() {
        this.categories = Categories;
        setTimeout(() => {
            if (this.breakpointService.isSmallScreen) {
                this.height = 56;
                this.registerScrollUp();
                this.registerScrollDown();

            } else {
                this.height = 63;
            }
        })
        this.keyupSubject.pipe(debounce(() => interval(1000))).subscribe(searchTextValue => {
            console.log(searchTextValue)
            this.storyService.onSearch.next(searchTextValue);
        });


    }

    private registerScrollDown() {
        this.storyListService.onScrollDown.subscribe((event: IPageInfo) => {

            if (this.height == 0) return;

            if (!this.isHidding) {
                this.isHidding = true;
                this.isShowing = false;
                this.hiddingScrollEvent = event;
                this.showingScrollEvent = event;
                this.currentToolbarHeight = this.height;


            }
            if (this.hiddingScrollEvent) {

                const height = event.scrollStartPosition - this.hiddingScrollEvent.scrollStartPosition;
                this.height = Math.max(0, this.currentToolbarHeight - (height / this.heightScale))

            }

            //  this.unsubscribeScrollDown();
        });
    }

    private registerScrollUp() {
        this.storyListService.onScrollUp.subscribe((event: IPageInfo) => {
            if (this.height == this.maxHeight) return;

            if (!this.isShowing) {
                this.isShowing = true;
                this.isHidding = false;
                this.showingScrollEvent = event;
                this.hiddingScrollEvent = event;
                this.currentToolbarHeight = this.height;

            }
            if (this.showingScrollEvent) {
                const height = (this.showingScrollEvent.scrollStartPosition - event.scrollStartPosition);
                this.height = Math.min(this.maxHeight, (height / this.heightScale) + this.currentToolbarHeight)
            }

        });
    }

    toggle() {
        this.sidebarService.onSideBarToogle.next()
    }

    changeTheme() {
        this.configService.updateConfig({darkTheme: !this.configService.getConfig().darkTheme})

    }

    onKeyup($event) {
        this.keyupSubject.next($event)
    }
}
