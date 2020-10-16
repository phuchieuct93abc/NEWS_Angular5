import {AfterViewInit, Component, OnInit} from '@angular/core';
import CategoryHelper, {Category} from "../../../../../model/Categories";
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../shared/config.service";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {CategoryService} from "../../shared/category.service";
import RequestAnimationFrame from "../../requestAnimationFrame.cons";

@Component({
    selector: 'app-category-selector',
    templateUrl: './category-selector.component.html',
    styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit, AfterViewInit {


    vietnameseCategories: Category[];
    englishCategories: Category[];
    selectedCategory: Category;
    isDarkMode: boolean;
    isSmallImage: boolean;

    constructor(private route: ActivatedRoute,
                private configService: ConfigService,
                public breakpointService: BreakpointDetectorService,
                private categoryService: CategoryService) {
    }


    ngOnInit() {
        this.vietnameseCategories = CategoryHelper.vietnameseCategories();
        this.englishCategories = CategoryHelper.englishCategories();
        this.isDarkMode = this.configService.getConfig().darkTheme;
        this.isSmallImage = this.configService.getConfig().smallImage;


    }

    toggleDarkMode() {
        this.configService.updateConfig({darkTheme: this.isDarkMode})
    }

    toogleDisplay() {
        this.configService.updateConfig({smallImage: this.isSmallImage})

    }


    ngAfterViewInit(): void {
        this.categoryService.onUpdateCategory().subscribe(selectedCategory => {
            setTimeout(() => {
                RequestAnimationFrame(() => this.selectedCategory = selectedCategory)

            })

        });
    }
}
