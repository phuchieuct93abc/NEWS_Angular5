import { Component, Inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { IS_MOBILE } from 'src/app/shared/const';
import { Theme, configFeature } from 'src/app/store/config.reducer';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  THEME = Theme;
  public isDarkTheme$ = this.store.select(configFeature.selectTheme).pipe(
    map((theme) => {
      if (!this.isMobile) {
        return true;
      }
      if (theme === Theme.PREFERENCE) {
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      }

      return theme === Theme.DARK;
    })
  );
  public skeletonTheme$ = this.isDarkTheme$.pipe(map((darkTheme) => (darkTheme ? 'progress-dark' : 'progress')));

  @Input()
  public mode: 'small' | 'big' = 'small';
  public constructor(private store: Store, @Inject(IS_MOBILE) private isMobile: boolean) {}
}
