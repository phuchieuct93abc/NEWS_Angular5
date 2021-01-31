import { DestroySubscriber } from './../shared/destroy-subscriber';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import CategoryHelper, { Category } from '../../../../model/Categories';
import { ConfigService } from '../shared/config.service';
import { opacityNgIf } from '../animation';
import { BreakpointDetectorService } from '../shared/breakpoint.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [
        opacityNgIf,
    ],
})
export class SidebarComponent extends DestroySubscriber implements OnInit {

    @Input()
    public isOpen: boolean;
    public vietnameseCategories: Category[];
    public englishCategories: Category[];
    public isDarkMode: boolean;
    public isSmallImage: boolean;

    public activatedCatagory: string;
    public isMobile: boolean;

    public constructor(private configService: ConfigService,
        breakpointService: BreakpointDetectorService) {
        super();
        this.isMobile = breakpointService.isSmallScreen;
    }

    public ngOnInit() {
        this.vietnameseCategories = CategoryHelper.vietnameseCategories();
        this.englishCategories = CategoryHelper.englishCategories();
        
        this.configService.getConfig().pipe(this.getTakeUntilDestroy())
        .subscribe(({ darkTheme, smallImage, category }) => {
            this.isDarkMode = darkTheme;
            this.isSmallImage = smallImage;
            this.activatedCatagory = category;
        });
    }

    public toggleDarkMode(value) {
        this.configService.updateConfig({ darkTheme: value });
    }

    public toogleDisplay(value) {
        this.configService.updateConfig({ smallImage: value });

    }

    public onSelectCategory(category: string) {
        this.configService.updateConfig({ category });
    }
}
