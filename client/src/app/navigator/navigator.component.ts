import { Component, OnInit, ViewChild } from '@angular/core';
import CategoryHelper from '../../../../model/Categories';
import { AppComponent } from '../app.component';
import { AppService } from '../app.service';
import { BreakpointDetectorService } from '../shared/breakpoint.service';
import { ConfigService } from '../shared/config.service';
import { DestroySubscriber } from './../shared/destroy-subscriber';
import { Category } from './../../../../model/Categories';

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.scss'],
})
export class NavigatorComponent extends DestroySubscriber implements OnInit  {
    @ViewChild(AppComponent, { static: false })
    public app: AppComponent;
    public toolbarTop = 0;


    public  readonly MIN_TOP = -63;
    public readonly MAX_TOP = 0;
    public isDarkMode: boolean;
    public isSmallImage: boolean;
    public selectedCategory: Category;

    public constructor(public breakpointService: BreakpointDetectorService,
        private configService: ConfigService,
        private appService: AppService) {
            super();
    }

    public ngOnInit() {
        this.configService.getConfig().pipe(this.getTakeUntilDestroy()).subscribe(({category})=>{
            this.selectedCategory = CategoryHelper.getCategory(category);
        });
    }

    public restrictTop(top: number): number {
        return Math.min(this.MAX_TOP, Math.max(this.MIN_TOP, top));
    }

    public toggleDarkMode() {
        this.configService.updateConfig({ darkTheme: this.isDarkMode });
    }

    public toogleDisplay() {
        this.configService.updateConfig({ smallImage: this.isSmallImage });
    }

    public toogleSidebar() {
        this.appService.toggleSidebar();
    }
}
