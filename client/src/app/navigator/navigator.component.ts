import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointDetectorService } from "../shared/breakpoint.service";
import { StoryListService } from "../story/story-list/story-list.service";
import { ConfigService } from "../shared/config.service";
import { AppComponent } from "../app.component";
import { AppService } from "../app.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.scss'],
})
export class NavigatorComponent implements OnInit {
    toolbarTop = 0;




    readonly MIN_TOP = -63;
    readonly MAX_TOP = 0;
    isDarkMode: boolean;
    isSmallImage: boolean;
    @ViewChild(AppComponent, { static: false })
    app: AppComponent;
    selectedCategory: string;

    constructor(public breakpointService: BreakpointDetectorService,
        private configService: ConfigService,
        private appService: AppService) {

    }

    ngOnInit() {
    }

    restrictTop(top: number): number {
        return Math.min(this.MAX_TOP, Math.max(this.MIN_TOP, top));
    }

    toggleDarkMode() {
        this.configService.updateConfig({ darkTheme: this.isDarkMode })
    }

    toogleDisplay() {
        this.configService.updateConfig({ smallImage: this.isSmallImage })
    }

    toogleSidebar() {
        this.appService.toggleSidebar();
    }
}
