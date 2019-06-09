import {Component, Input, OnInit} from '@angular/core';
import CategoryHelper, {Category} from "../../../../model/Categories";
import {ConfigService} from "../shared/config.service";
import {trigger} from "@angular/animations";
import {opacityNgIf} from "../animation";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations:[
        opacityNgIf
    ]
})
export class SidebarComponent implements OnInit {

    public vietnameseCategories: Category[];
    isDarkMode: boolean;
    isSmallImage: boolean;
    @Input()
    isOpen:boolean;

    constructor(private configService: ConfigService,) {
    }

    ngOnInit() {
        this.vietnameseCategories = CategoryHelper.vietnameseCategories();

        this.isDarkMode = this.configService.getConfig().darkTheme;
        this.isSmallImage = this.configService.getConfig().smallImage;
    }

    toggleDarkMode() {
        this.configService.updateConfig({darkTheme: this.isDarkMode})
    }

    toogleDisplay() {
        this.configService.updateConfig({smallImage: this.isSmallImage})

    }
}
