import {Component, OnInit} from '@angular/core';
import {Categories, Category} from "../../../../../model/Categories";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {


    categories: Category[];
    selectedCategory: Category = Categories[0];

    constructor(private route: ActivatedRoute) {
    }


    ngOnInit() {
        this.categories = Categories;
        console.log(this.route)

        setTimeout(() => {
            this.route.firstChild.params.subscribe(params => {
                this.selectedCategory = Categories.find(category => category.name === params['category'])
            })
        })

    }

}
