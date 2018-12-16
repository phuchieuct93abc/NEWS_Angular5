import {Component, OnInit} from '@angular/core';
import {BreakpointDetectorService} from "../shared/breakpoint.service";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    isSmallScreen: boolean;

    constructor(private breakpointService: BreakpointDetectorService) {
    }

    ngOnInit() {
        this.isSmallScreen = this.breakpointService.isSmallScreen;
    }

}
