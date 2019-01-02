import {Component, OnInit} from '@angular/core';
import {Categories} from "../../../../model/Categories";
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
    categories: any;

    isHiding = false;
    isShowing = false;

    hidingScrollEvent: IPageInfo;
    showingScrollEvent: IPageInfo;

    readonly MIN_TOP = -63;
    readonly MAX_TOP = 0;
    toolbarTop = 0;
    heightScale = 1;
    currentToolbarTOP = this.toolbarTop;

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
        this.storyListService.onScrollDown.subscribe((event: IPageInfo) => {
            //Hide toolbar
            if (this.toolbarTop == this.MIN_TOP) {
                return;
            }
            if (event.startIndex == 0) {
                this.toolbarTop = 0;
            }
            if (!this.isHiding) {
                this.isHiding = true;
                this.isShowing = false;
                this.hidingScrollEvent = event;
                this.showingScrollEvent = event;
                this.currentToolbarTOP = this.toolbarTop;


            }
            if (this.hidingScrollEvent) {

                const height = event.scrollStartPosition - this.hidingScrollEvent.scrollStartPosition;
                this.toolbarTop = this.restrictTop(this.currentToolbarTOP - (height / this.heightScale))

            }

        });
    }

    private registerScrollUp() {
        this.storyListService.onScrollUp.subscribe((event: IPageInfo) => {
            //Show toolbar
            if (this.toolbarTop == this.MAX_TOP) return;

            if (!this.isShowing) {
                this.isShowing = true;
                this.isHiding = false;
                this.showingScrollEvent = event;
                this.hidingScrollEvent = event;
                this.currentToolbarTOP = this.toolbarTop;

            }
            if (this.showingScrollEvent) {
                const height = (this.showingScrollEvent.scrollStartPosition - event.scrollStartPosition);
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
