import {Component, OnInit} from '@angular/core';
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {Categories} from "../../../../model/Categories";
import {SidebarService} from "./sidebar.service";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    isSmallScreen: boolean;
    categories: any;
    isOpenSidebar = false;

    constructor(private breakpointService: BreakpointDetectorService, private sidebarService: SidebarService) {
    }

    ngOnInit() {
        this.categories = Categories
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.sidebarService.onSideBarToogle.subscribe(() => {
            this.isOpenSidebar = !this.isOpenSidebar
        })
    }

}
