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
    isHide: boolean = false;
    isListeningScrollUp = true;
    isListeningScrollDown = true;

    isHidding = false;
    isShowing = false;

    hiddingScrollEvent: IPageInfo;
    showingScrollEvent: IPageInfo;
    maxHeight = 56;

    height = this.maxHeight;
    heightScale = 5;



    constructor(private storyListService: StoryListService,
                private media: MediaMatcher,
                private sidebarService: SidebarService,
                public breakpointService: BreakpointDetectorService,
                public configService: ConfigService) {

    }

    ngOnInit() {
        this.categories = Categories;


        setTimeout(() => {


            if (this.breakpointService.isSmallScreen) {

                let currentToolbarHeight;
                this.storyListService.onScrollUp.subscribe((event: IPageInfo) => {
                    if (!this.isShowing) {
                        this.isShowing = true;
                        this.isHidding = false;
                        this.showingScrollEvent = event;
                        this.hiddingScrollEvent = event;
                        currentToolbarHeight = this.height;

                    }
                    if (this.showingScrollEvent) {


                        const height = (this.showingScrollEvent.scrollStartPosition - event.scrollStartPosition) ;

                        this.height = Math.min(this.maxHeight, (height  / this.heightScale) + currentToolbarHeight)
                        console.log(this.height)

                    }


                });
                this.storyListService.onScrollDown.subscribe((event: IPageInfo) => {
                    if (!this.isHidding) {
                        this.isHidding = true;
                        this.isShowing = false;
                        this.hiddingScrollEvent = event;
                        this.showingScrollEvent = event;
                        currentToolbarHeight = this.height;


                    }
                    if (this.hiddingScrollEvent) {

                        const height = event.scrollStartPosition - this.hiddingScrollEvent.scrollStartPosition;
                        this.height = Math.max(0, currentToolbarHeight - (height / this.heightScale) )
                        console.log(this.height)

                    }

                    //  this.unsubscribeScrollDown();
                });
            }

        }, 3000)


    }

    toggle() {
        this.sidebarService.onSideBarToogle.next()
    }

    changeTheme() {
        this.configService.updateConfig({darkTheme: !this.configService.getConfig().darkTheme})

    }

    private unsubscribeScrollUp() {
        this.isListeningScrollUp = false;
        setTimeout(() => this.isListeningScrollUp = true, 1000)
    }

    private unsubscribeScrollDown() {
        this.isListeningScrollDown = false;
        setTimeout(() => this.isListeningScrollDown = true, 1000)
    }
}
