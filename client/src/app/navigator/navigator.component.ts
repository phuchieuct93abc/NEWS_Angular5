import {Component, OnInit, ViewChild} from '@angular/core';
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {StoryListService} from "../story/story-list/story-list.service";
import {IPageInfo} from "ngx-virtual-scroller";
import {ConfigService} from "../shared/config.service";
import {AppComponent} from "../app.component";
import {AppService} from "../app.service";
import {MatSidenav} from "@angular/material";

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.scss'],
})
export class NavigatorComponent implements OnInit {
    toolbarTop = 0;

    private isHiding = false;

    private isShowing = false;
    private hidingScrollEvent: IPageInfo;

    private showingScrollEvent: IPageInfo;
    private heightScale = 1;

    private currentToolbarTOP = this.toolbarTop;
    readonly MIN_TOP = -63;
    readonly MAX_TOP = 0;
    isDarkMode: boolean;
    isSmallImage: boolean;
    @ViewChild(AppComponent,{static:false})
    app: AppComponent

    constructor(private storyListService: StoryListService,
                public breakpointService: BreakpointDetectorService,
                private configService: ConfigService,
                private appService: AppService
    ) {

    }

    ngOnInit() {
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


    restrictTop(top: number): number {
        return Math.min(this.MAX_TOP, Math.max(this.MIN_TOP, top));
    }

    toggleDarkMode() {
        this.configService.updateConfig({darkTheme: this.isDarkMode})
    }

    toogleDisplay() {
        this.configService.updateConfig({smallImage: this.isSmallImage})

    }


    toogleSidebar() {
        this.appService.toggleSidebar();
    }
}
