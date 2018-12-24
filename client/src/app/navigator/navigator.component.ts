import {Component, OnInit} from '@angular/core';
import {Categories} from "../../../../model/Categories";
import {StoryListService} from "../shared/story-list.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MediaMatcher} from "@angular/cdk/layout";
import {SidebarService} from "../main/sidebar.service";
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {ConfigService} from "../shared/config.service";

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

    constructor(private storyListService: StoryListService,
                private media: MediaMatcher,
                private sidebarService: SidebarService,
                public breakpointService: BreakpointDetectorService,
                public configService: ConfigService) {

    }

    ngOnInit() {
        this.categories = Categories;


        window.scrollTo(0,0);
        setTimeout(() => {

            window.scrollTo(0,10);

            if (this.breakpointService.isSmallScreen) {

                this.storyListService.onScrollUp.subscribe(() => {
                    if (this.isListeningScrollUp) {
                        this.isHide = false;
                        this.unsubscribeScrollUp();
                    }

                });
                this.storyListService.onScrollDown.subscribe(() => {
                    if (this.isListeningScrollDown) {
                        this.isHide = true;
                        this.unsubscribeScrollDown();
                    }
                });
            }

        }, 0)


    }

    toggle() {
        this.sidebarService.onSideBarToogle.next()
    }

    darkTheme() {
        this.configService.updateConfig({darkTheme: true})
    }

    lightTheme() {
        this.configService.updateConfig({darkTheme: false})

    }

    private unsubscribeScrollUp() {
        this.isListeningScrollUp = false;
        setTimeout(() => this.isListeningScrollUp = true, 5000)
    }

    private unsubscribeScrollDown() {
        this.isListeningScrollDown = false;
        setTimeout(() => this.isListeningScrollDown = true, 5000)
    }
}
