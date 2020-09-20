import { changeImageSize } from './../reducers/index';
import { Component, Input, OnInit } from '@angular/core';
import CategoryHelper, { Category } from "../../../../model/Categories";
import { opacityNgIf } from "../animation";
import { select, Store } from '@ngrx/store';
import { changeDarkMode, ConfigState } from '../reducers';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [
        opacityNgIf
    ]
})
export class SidebarComponent implements OnInit {

    public vietnameseCategories: Category[];
    public englishCategories: Category[];
    isDarkMode: boolean;
    isSmallImage: boolean;
    @Input()
    isOpen: boolean;

    constructor(private store: Store<ConfigState>) {
    }

    ngOnInit() {
        this.vietnameseCategories = CategoryHelper.vietnameseCategories();
        this.englishCategories = CategoryHelper.englishCategories();
        this.store.pipe<ConfigState>(select('config')).subscribe(config => {
            this.isDarkMode = config.darkmode;
            this.isSmallImage = config.smallImage
        })

    }

    toggleDarkMode() {
        this.store.dispatch(changeDarkMode());
    }

    toogleDisplay() {
        this.store.dispatch(changeImageSize());

    }
}
