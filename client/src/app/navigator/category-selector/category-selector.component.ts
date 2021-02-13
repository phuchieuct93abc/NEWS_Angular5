import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import CategoryHelper, { Category } from '../../../../../model/Categories';
import { ConfigService } from '../../shared/config.service';
import { Config } from './../../shared/config.service';

@Component({
    selector: 'app-category-selector',
    templateUrl: './category-selector.component.html',
    styleUrls: ['./category-selector.component.scss'],
})
export class CategorySelectorComponent implements OnInit, OnDestroy {


    public vietnameseCategories: Category[];
    public englishCategories: Category[];
    public selectedCategory: Category;
    public isDarkMode: boolean;
    public isSmallImage: boolean;
    public config$: Observable<Config>;
    private onDestroy$ = new Subject<void>();

    public constructor(private configService: ConfigService, @Inject(IS_MOBILE) public isMobile: boolean,
    ) {
    }
    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }


    public ngOnInit() {
        this.vietnameseCategories = CategoryHelper.vietnameseCategories();
        this.englishCategories = CategoryHelper.englishCategories();

        this.configService.getConfig().pipe(takeUntil(this.onDestroy$)).subscribe(({ darkTheme, smallImage, category }) => {
            this.isDarkMode = darkTheme;
            this.isSmallImage = smallImage;
            this.selectedCategory = CategoryHelper.getCategory(category);
        });
    }

    public toggleDarkMode() {
        this.configService.updateConfig({ darkTheme: this.isDarkMode });
    }

    public toogleDisplay() {
        this.configService.updateConfig({ smallImage: this.isSmallImage });

    }

}
