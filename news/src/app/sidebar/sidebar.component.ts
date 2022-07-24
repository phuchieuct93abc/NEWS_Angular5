import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import firebase from 'firebase/compat/app';
import { IS_MOBILE } from 'src/app/shared/const';
import CategoryHelper from '../../../../model/Categories';
import { opacityNgIf } from '../animation';
import { configFeature, updateConfigAction } from '../store/config.reducer';
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

  public constructor(@Inject(IS_MOBILE) public isMobile: boolean, private store: Store, public auth: AngularFireAuth) {}

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
    this.auth.signOut();
  }

  public login(): void {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
