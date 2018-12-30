import {Component, OnInit} from '@angular/core';
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {Categories, Category} from "../../../../model/Categories";
import {SidebarService} from "./sidebar.service";
import {ConfigService} from "../shared/config.service";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    isSmallScreen: boolean;
    categories: Category[];
    isOpenSidebar = false;

    constructor(private breakpointService: BreakpointDetectorService, private sidebarService: SidebarService, public configService: ConfigService) {
    }

    ngOnInit() {
        this.categories = Categories
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.sidebarService.onSideBarToogle.subscribe(() => {
            this.isOpenSidebar = !this.isOpenSidebar
        })
    }

    changeLightTheme() {
        this.configService.updateConfig({darkTheme: false})


    }

    changeDardTheme() {
        this.configService.updateConfig({darkTheme: true})

    }
}
