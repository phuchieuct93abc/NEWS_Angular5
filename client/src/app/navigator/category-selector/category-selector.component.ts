import { ConfigState, changeDarkMode, changeImageSize } from './../../reducers/index';
import {AfterViewInit, Component, OnInit} from '@angular/core';
import CategoryHelper, {Category} from "../../../../../model/Categories";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {CategoryService} from "../../shared/category.service";
import RequestAnimationFrame from "../../requestAnimationFrame.cons";
import { select, Store } from '@ngrx/store';

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

    constructor(public breakpointService: BreakpointDetectorService,
                private categoryService: CategoryService,
                private store: Store<ConfigState>) {
    }


    ngOnInit() {
        this.vietnameseCategories = CategoryHelper.vietnameseCategories();
        this.englishCategories = CategoryHelper.englishCategories();
        this.store.pipe<ConfigState>(select('config')).subscribe(config=>{
            this.isDarkMode = config.darkmode;
            this.isSmallImage = config.smallImage;

        })


    }

    toggleDarkMode() {
        this.store.dispatch(changeDarkMode());
    }

    toogleDisplay() {
        this.store.dispatch(changeImageSize());

    }


    ngAfterViewInit(): void {
        this.categoryService.onUpdateCategory().subscribe(selectedCategory => {
            setTimeout(() => {
                RequestAnimationFrame(() => this.selectedCategory = selectedCategory)

            })

        });
    }
}
