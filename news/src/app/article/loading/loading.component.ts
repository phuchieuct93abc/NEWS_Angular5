import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, shareReplay } from 'rxjs';
import { Theme, configFeature } from 'src/app/store/config.reducer';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  THEME = Theme;
  public isDarkTheme$ = this.store.select(configFeature.selectTheme);
  public skeletonTheme$ = this.isDarkTheme$.pipe(map((darkTheme) => (darkTheme ? 'progress-dark' : 'progress')));

  @Input()
  public mode: 'small' | 'big' = 'small';
  public constructor(private store: Store) {}
}
