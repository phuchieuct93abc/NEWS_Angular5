import { Component, OnInit } from '@angular/core';
import { BreakpointDetectorService } from "../shared/breakpoint.service";
import { AppService } from "../app.service";

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
