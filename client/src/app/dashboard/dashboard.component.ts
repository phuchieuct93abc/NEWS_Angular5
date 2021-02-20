import {Component, OnInit} from '@angular/core';
import CategoryHelper, {Category} from '../../../../model/Categories';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

    public vietnameseCategories: Category[];

    constructor() {
    }

    ngOnInit() {
        this.vietnameseCategories = CategoryHelper.vietnameseCategories();
    }

}
