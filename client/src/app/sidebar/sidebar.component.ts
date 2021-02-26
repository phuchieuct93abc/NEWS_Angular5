import { Component, Inject, Input, OnInit } from '@angular/core';
import { IS_MOBILE } from 'src/app/shared/const';
import CategoryHelper, { Category } from '../../../../model/Categories';
import { ConfigService } from '../shared/config.service';
import { opacityNgIf } from '../animation';
import { DestroySubscriber } from './../shared/destroy-subscriber';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [
        opacityNgIf
    ]
})
export class SidebarComponent extends DestroySubscriber implements OnInit {

    @Input()
    public isOpen: boolean;
    public vietnameseCategories: Category[];
    public englishCategories: Category[];
    public isDarkMode: boolean;
    public isSmallImage: boolean;

    public activatedCatagory: string;

    public constructor(private configService: ConfigService,
        @Inject(IS_MOBILE) public isMobile: boolean        ) {
        super();
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
