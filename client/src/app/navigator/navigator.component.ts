import { changeImageSize } from './../reducers/index';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointDetectorService } from "../shared/breakpoint.service";
import { StoryListService } from "../story/story-list/story-list.service";
import { ConfigService } from "../shared/config.service";
import { AppComponent } from "../app.component";
import { AppService } from "../app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from '@ngrx/store';
import { changeDarkMode } from '../reducers';

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.scss'],
})
export class NavigatorComponent implements OnInit {




   

    constructor(public breakpointService: BreakpointDetectorService,        private appService: AppService) {

    }

    ngOnInit() {
    }

    toogleSidebar() {
        this.appService.toggleSidebar();
    }
}
