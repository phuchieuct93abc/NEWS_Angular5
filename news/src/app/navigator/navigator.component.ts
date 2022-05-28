import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import CategoryHelper from '../../../../model/Categories';
import { AppComponent } from '../app.component';
import { AppService } from '../app.service';
import { ConfigService } from '../shared/config.service';
import { configFeature, updateConfigAction } from '../store/config.reducer';
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

  public constructor(@Inject(IS_MOBILE) public isMobile: boolean, private appService: AppService, private store: Store) {
    super();
  }

  public ngOnInit() {
    this.selectedCategory$ = this.store.select(configFeature.selectCategory).pipe(map((category) => CategoryHelper.getCategory(category)));
  }

  public restrictTop(top: number): number {
    return Math.min(this.MAX_TOP, Math.max(this.MIN_TOP, top));
  }

  public toggleDarkMode() {
    this.store.dispatch(updateConfigAction({ darkTheme: this.isDarkMode }));
  }

  public toogleDisplay() {
    this.store.dispatch(updateConfigAction({ smallImage: this.isSmallImage }));
  }

  public toogleSidebar() {
    this.appService.toggleSidebar();
  }
}
