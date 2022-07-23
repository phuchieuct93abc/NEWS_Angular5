import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { IS_MOBILE } from 'src/app/shared/const';
import CategoryHelper from '../../../../model/Categories';
import { opacityNgIf } from '../animation';
import { configFeature, updateConfigAction } from '../store/config.reducer';
import { loginFeature, logout } from '../store/login.effect';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [opacityNgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input()
  public isOpen: boolean;
  public isDarkMode$ = this.store.select(configFeature.selectDarkTheme);
  public isSmallImage$ = this.store.select(configFeature.selectSmallImage);

  public vietnameseCategories = CategoryHelper.vietnameseCategories();
  public englishCategories = CategoryHelper.englishCategories();

  public user$ = this.store.select(loginFeature.selectLoginFeatureState);
  public constructor(@Inject(IS_MOBILE) public isMobile: boolean, private store: Store) {}

  public toggleDarkMode(darkTheme: boolean): void {
    this.store.dispatch(updateConfigAction({ darkTheme }));
  }

  public toggleDisplay(smallImage: boolean): void {
    this.store.dispatch(updateConfigAction({ smallImage }));
  }

  public onSelectCategory(category: string): void {
    this.store.dispatch(updateConfigAction({ category }));
  }

  public logout() {
    this.store.dispatch(logout());
    window.location.reload();
  }
}
