import {Component, OnInit} from '@angular/core';
import {BreakpointDetectorService} from "../shared/breakpoint.service";

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

    isSmallScreen: boolean

    constructor(public breakpointService: BreakpointDetectorService) {
    }

    ngOnInit() {
        this.isSmallScreen = this.breakpointService.isSmallScreen;
    }

}
