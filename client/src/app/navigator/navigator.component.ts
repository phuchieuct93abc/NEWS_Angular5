import {Component, OnInit} from '@angular/core';
import {Categories} from "../../../../model/Categories";
import {MediaMatcher} from "@angular/cdk/layout";
import {SidebarService} from "../main/sidebar.service";
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {ConfigService} from "../shared/config.service";
import {StoryListService} from "../story/story-list/story-list.service";

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


        setTimeout(() => {


            if (this.breakpointService.isSmallScreen) {

                this.storyListService.onScrollUp.subscribe(() => {
                    if (this.isListeningScrollUp) {
                        this.isHide = false;
                      //  this.unsubscribeScrollUp();
                    }

                });
                this.storyListService.onScrollDown.subscribe(() => {
                    if (this.isListeningScrollDown) {
                        this.isHide = true;
                      //  this.unsubscribeScrollDown();
                    }
                });
            }

        }, 0)


    }

    toggle() {
        this.sidebarService.onSideBarToogle.next()
    }

    changeTheme(){
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
