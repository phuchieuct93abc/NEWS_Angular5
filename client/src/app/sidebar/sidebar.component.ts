import { Router } from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import CategoryHelper, {Category} from "../../../../model/Categories";
import {ConfigService} from "../shared/config.service";
import {trigger} from "@angular/animations";
import {opacityNgIf} from "../animation";
import { BreakpointDetectorService } from '../shared/breakpoint.service';

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
    public englishCategories: Category[];
    isDarkMode: boolean;
    isSmallImage: boolean;
    @Input()
    isOpen:boolean;

    activatedCatagory:string;
    isMobile:boolean;

    constructor(private configService: ConfigService,private router: Router, breakpointService:BreakpointDetectorService ) {
        this.isMobile = breakpointService.isSmallScreen;

    }

    ngOnInit() {
        this.vietnameseCategories = CategoryHelper.vietnameseCategories();
        this.englishCategories = CategoryHelper.englishCategories();

        this.isDarkMode = this.configService.getConfig().darkTheme;
        this.isSmallImage = this.configService.getConfig().smallImage;
        this.activatedCatagory = this.configService.getConfig().category; 
    }

    toggleDarkMode(value) {
        this.configService.updateConfig({darkTheme: value})
    }

    toogleDisplay(value) {
        this.configService.updateConfig({smallImage: value})

    }

    onSelectCategory(category: string){
        this.activatedCatagory = category;
        this.router.navigate([category]);
    }
}
