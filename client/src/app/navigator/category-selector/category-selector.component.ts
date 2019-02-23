import {Component, OnInit} from '@angular/core';
import {Categories, Category} from "../../../../../model/Categories";
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../shared/config.service";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";

@Component({
    selector: 'app-category-selector',
    templateUrl: './category-selector.component.html',
    styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit {


    categories: Category[];
    selectedCategory: Category = Categories[0];
    isDarkMode: boolean;
    isSmallImage: boolean;

    constructor(private route: ActivatedRoute, private configService: ConfigService, public breakpointService: BreakpointDetectorService) {
    }


    ngOnInit() {
        this.categories = Categories;
        this.isDarkMode = this.configService.getConfig().darkTheme
        this.isSmallImage = this.configService.getConfig().smallImage;
        setTimeout(() => {
            this.route.firstChild.params.subscribe(params => {
                this.selectedCategory = Categories.find(category => category.name === params['category'])
            })
        })

    }

    toggleDarkMode() {
        this.configService.updateConfig({darkTheme: this.isDarkMode})
    }

    toogleDisplay() {
        this.configService.updateConfig({smallImage: this.isSmallImage})

    }
}
