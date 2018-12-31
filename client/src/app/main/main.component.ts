import {Component, OnInit} from '@angular/core';
import {BreakpointDetectorService} from "../shared/breakpoint.service";
import {Categories, Category} from "../../../../model/Categories";
import {SidebarService} from "./sidebar.service";
import {ConfigService} from "../shared/config.service";
import {ArticleService} from "../shared/article.service";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    isSmallScreen: boolean;
    categories: Category[];
    isOpenSidebar = false;
    image: string;

    constructor(private breakpointService: BreakpointDetectorService,
                private sidebarService: SidebarService,
                public configService: ConfigService,
                private articleService: ArticleService) {
    }

    ngOnInit() {
        this.categories = Categories
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.sidebarService.onSideBarToogle.subscribe(() => {
            this.isOpenSidebar = !this.isOpenSidebar
        })

        this.articleService.onStorySelected.subscribe(article => {
            this.image = article.story.images[0].imageUrl
        })
    }

    changeLightTheme() {
        this.configService.updateConfig({darkTheme: false})


    }

    changeDardTheme() {
        this.configService.updateConfig({darkTheme: true})

    }
}
