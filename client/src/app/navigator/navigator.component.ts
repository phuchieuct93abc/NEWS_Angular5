import {Component, OnInit} from '@angular/core';
import {Categories, Category} from "../../../../model/Categories";
import {MediaMatcher} from "@angular/cdk/layout";
import {SidebarService} from "../main/sidebar.service";
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {ConfigService} from "../shared/config.service";
import {StoryListService} from "../story/story-list/story-list.service";
import {IPageInfo} from "ngx-virtual-scroller";

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.scss'],
})
export class NavigatorComponent implements OnInit {
    toolbarTop = 0;

    categories: Category[];
    private isHiding = false;

    private isShowing = false;
    private hidingScrollEvent: IPageInfo;

    private showingScrollEvent: IPageInfo;
    private heightScale = 1;

    private currentToolbarTOP = this.toolbarTop;
    readonly MIN_TOP = -63;
    readonly MAX_TOP = 0;

    constructor(private storyListService: StoryListService,
                private media: MediaMatcher,
                private sidebarService: SidebarService,
                public breakpointService: BreakpointDetectorService,
                public configService: ConfigService
    ) {

    }

    ngOnInit() {
        this.categories = Categories;
        if (this.breakpointService.isSmallScreen) {
            this.registerScrollUp();
            this.registerScrollDown();

        }


    }

    private registerScrollDown() {
        this.storyListService.onScrollDown.subscribe(event => {
            //Hide toolbar
            if (this.toolbarTop == this.MIN_TOP) {
                this.updateCurrentScrollEvent(event);
                return;
            }
            if (event.startIndex == 0) {
                this.toolbarTop = 0;
            }
            if (!this.isHiding) {
                this.isHiding = true;
                this.isShowing = false;
                this.updateCurrentScrollEvent(event);
                this.currentToolbarTOP = this.toolbarTop;


            }
            if (this.hidingScrollEvent) {
                const height = event.scrollStartPosition - this.hidingScrollEvent.scrollStartPosition;
                this.toolbarTop = this.restrictTop(this.currentToolbarTOP - (height / this.heightScale))

            }

        });
    }

    private updateCurrentScrollEvent(event: IPageInfo) {
        this.hidingScrollEvent = event;
        this.showingScrollEvent = event;
    }

    private registerScrollUp() {
        this.storyListService.onScrollUp.subscribe(event => {
            //Show toolbar
            if (this.toolbarTop == this.MAX_TOP) {
                this.updateCurrentScrollEvent(event);
                return;
            }
            ;

            if (!this.isShowing) {
                this.isShowing = true;
                this.isHiding = false;
                this.updateCurrentScrollEvent(event);
                this.currentToolbarTOP = this.toolbarTop;

            }
            if (this.showingScrollEvent) {
                const height = this.showingScrollEvent.scrollStartPosition - event.scrollStartPosition;

                this.toolbarTop = this.restrictTop((height / this.heightScale) + this.currentToolbarTOP)
            }
            if (event.startIndex == 0) {
                this.toolbarTop = 0;
            }

        });
    }

    toggle() {
        this.sidebarService.onSideBarToogle.next()
    }

    changeTheme() {
        this.configService.updateConfig({darkTheme: !this.configService.getConfig().darkTheme})

    }

    restrictTop(top: number): number {
        return Math.min(this.MAX_TOP, Math.max(this.MIN_TOP, top));
    }


}
