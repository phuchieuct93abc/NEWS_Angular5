import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import CategoryHelper from '../../../../model/Categories';
import { AppComponent } from '../app.component';
import { AppService } from '../app.service';
import { ConfigService } from '../shared/config.service';
import { Category } from './../../../../model/Categories';
import { DestroySubscriber } from './../shared/destroy-subscriber';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
})
export class NavigatorComponent extends DestroySubscriber implements OnInit {
  @ViewChild(AppComponent)
  public app: AppComponent;
  public readonly MIN_TOP = -63;
  public readonly MAX_TOP = 0;

  public toolbarTop = 0;

  public isDarkMode: boolean;
  public isSmallImage: boolean;
  public selectedCategory$: Observable<Category>;

  public constructor(
    @Inject(IS_MOBILE) public isMobile: boolean,

    private configService: ConfigService,
    private appService: AppService
  ) {
    super();
  }

  public ngOnInit() {
    this.selectedCategory$ = this.configService.getConfig().pipe(map(({ category }) => CategoryHelper.getCategory(category)));
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
