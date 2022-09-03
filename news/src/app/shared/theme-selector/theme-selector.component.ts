import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { configFeature, Theme, updateConfigAction } from 'src/app/store/config.reducer';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.css'],
})
export class ThemeSelectorComponent {
  public darkMode$ = this.store.select(configFeature.selectTheme);
  public themes = [
    {
      theme: Theme.PREFERENCE,
      label: 'Tự động',
    },
    {
      theme: Theme.DARK,
      label: 'Tối',
    },
    {
      theme: Theme.LIGHT,
      label: 'Sáng',
    },
  ];
  constructor(private store: Store) {}

  public toggleDarkMode(theme: Theme): void {
    this.store.dispatch(updateConfigAction({ theme }));
  }
}
