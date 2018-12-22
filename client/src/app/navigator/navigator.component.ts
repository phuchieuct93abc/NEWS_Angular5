import {Component, OnInit} from '@angular/core';
import {Categories} from "../../../../model/Categories";

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {
    categories: any;

    constructor() {
    }

    ngOnInit() {
        this.categories = Categories;
    }

}
