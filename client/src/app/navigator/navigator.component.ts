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
    animations: [
        trigger('openHide', [
            // ...
            state('hide', style({
                height: '0',
                overflow: 'hidden'
            })),
            transition('* => *', [
                animate('0.5s')
            ]),

        ]),
    ]
})
export class NavigatorComponent implements OnInit {
    categories: any;
    isHide: boolean = false;


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

                    this.isHide = false
                })
                this.storyListService.onScrollDown.subscribe(() => {
                    this.isHide = true;
                })
            }

        }, 5000)


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
}
